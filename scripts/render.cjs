#!/usr/bin/env node
'use strict';
// Render local HTML with actual device scale, validate layout, and make a contact sheet.
const fs = require('node:fs/promises');
const syncFs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {createRequire} = require('node:module');
const {createHash} = require('node:crypto');

function usage() {
  console.log('Usage: node render.cjs <project-directory-or-index.html> [--out <export-directory>]');
  console.log('Needs Playwright via project dependencies or NODE_PATH. Optional CHROME_PATH or PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.');
}
function playwrightFor(root) {
  for (const lookup of [require, createRequire(path.join(root, 'package.json'))]) {
    for (const name of ['playwright', 'playwright-core']) {
      try { return lookup(name); } catch (err) { if (err.code !== 'MODULE_NOT_FOUND') throw err; }
    }
  }
  throw new Error('Playwright is unavailable. Use the environment-provided Node packages via NODE_PATH, or install playwright in the output project.');
}
function chromiumPath(chromium) {
  const override = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (override && !syncFs.existsSync(override)) throw new Error(`Browser override does not exist: ${override}`);
  const choices = [override, chromium.executablePath(),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe')];
  const executablePath = choices.find(candidate => candidate && syncFs.existsSync(candidate));
  if (!executablePath) throw new Error('No Chromium browser found. Set CHROME_PATH to an installed Chrome/Chromium, or install the Playwright Chromium browser.');
  return executablePath;
}
async function ready(page) {
  await page.evaluate(async () => {
    await Promise.all([...document.fonts].map(face => face.load()));
    await document.fonts.ready;
    await Promise.all([...document.images].map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
      img.addEventListener('load', resolve, {once: true});
      img.addEventListener('error', resolve, {once: true});
    })));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
async function preflight(page) {
  return page.evaluate(() => {
    const problems = [];
    const fonts = [...document.fonts].map(f => ({family: f.family, weight: f.weight, status: f.status}));
    for (const weight of ['400', '600']) {
      if (!fonts.some(f => f.family.replaceAll('"', '') === 'MiSans' && f.weight === weight && f.status === 'loaded')) {
        problems.push(`MiSans ${weight} did not load`);
      }
    }
    const pages = [...document.querySelectorAll('.page')].map((el, index) => {
      const label = `Page ${index + 1}`;
      const box = el.getBoundingClientRect();
      if (Math.abs(box.width - 1080) > .5 || Math.abs(box.height - 1440) > .5) problems.push(`${label}: artboard must be 1080 × 1440`);
      const slug = el.dataset.slug || `page-${String(index + 1).padStart(2, '0')}`;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) problems.push(`${label}: use a lowercase ASCII data-slug`);
      if (!el.querySelector('.page-header .brands') || !el.querySelector('.page-footer .progress')) problems.push(`${label}: viewer.js did not populate header/footer`);
      const content = el.querySelector('.content');
      if (content) {
        const area = content.getBoundingClientRect();
        if (content.scrollHeight > content.clientHeight + 2) problems.push(`${label}: content overflows by ${content.scrollHeight - content.clientHeight}px; split or edit the copy`);
        const blocks = [...content.children].filter(child => getComputedStyle(child).position !== 'absolute');
        blocks.forEach((child, i) => {
          const r = child.getBoundingClientRect();
          if (r.top < area.top - 2 || r.bottom > area.bottom + 2) problems.push(`${label}: .${child.className || child.tagName} exceeds the content area`);
          if (i && r.top < blocks[i - 1].getBoundingClientRect().bottom - 2) problems.push(`${label}: adjacent content blocks overlap`);
        });
      }
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim() || node.parentElement.closest('[aria-hidden="true"]')) continue;
        const range = document.createRange(); range.selectNodeContents(node);
        for (const r of range.getClientRects()) {
          if (!r.width || !r.height) continue;
          if (r.left < box.left - 2 || r.right > box.right + 2 || r.top < box.top - 2 || r.bottom > box.bottom + 2) problems.push(`${label}: text leaves the artboard: ${node.textContent.trim().slice(0, 50)}`);
          if (content?.contains(node)) {
            const area = content.getBoundingClientRect();
            if (r.left < area.left - 2 || r.right > area.right + 2 || r.bottom > area.bottom + 2) problems.push(`${label}: text leaves the content area: ${node.textContent.trim().slice(0, 50)}`);
          }
        }
      }
      const images = [...el.querySelectorAll('img')].map(img => {
        if (!img.complete || !img.naturalWidth) problems.push(`${label}: missing image ${img.getAttribute('src')}`);
        const width = img.clientWidth;
        const height = img.clientHeight;
        const fit = getComputedStyle(img).objectFit;
        if (img.naturalWidth && height && fit !== 'cover' && fit !== 'contain' && Math.abs((width / height) / (img.naturalWidth / img.naturalHeight) - 1) > .04) problems.push(`${label}: stretched image ${img.getAttribute('src')}`);
        return {src: img.getAttribute('src'), naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight};
      });
      const copy = el.cloneNode(true);
      copy.querySelectorAll('.page-header,.page-footer,.together-backdrop').forEach(node => node.remove());
      return {index: index + 1, slug, title: el.dataset.title || '', topic: el.dataset.topic || '', text: copy.textContent.replace(/\s+/g, ' ').trim(), images};
    });
    if (!pages.length) problems.push('No .page elements found');
    return {pages, fonts, problems: [...new Set(problems)]};
  });
}
async function pngSize(filename) {
  const data = await fs.readFile(filename);
  if (data.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error(`Not a PNG: ${filename}`);
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}
const htmlEscape = text => String(text).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
async function sourceFiles(root, input) {
  const files = [input, path.join(root, 'styles.css'), path.join(root, 'viewer.js')];
  async function walk(directory) {
    for (const entry of await fs.readdir(directory, {withFileTypes: true})) {
      if (entry.name.startsWith('.')) continue;
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(filename);
      else if (entry.isFile()) files.push(filename);
    }
  }
  await walk(path.join(root, 'assets'));
  return Promise.all(files.sort().map(async filename => ({file: path.relative(root, filename).split(path.sep).join('/'), sha256: createHash('sha256').update(await fs.readFile(filename)).digest('hex')})));
}

async function main() {
  const argv = process.argv.slice(2);
  if (!argv.length || argv.includes('--help')) { usage(); return; }
  let input = path.resolve(argv.shift());
  if ((await fs.stat(input)).isDirectory()) input = path.join(input, 'index.html');
  const root = path.dirname(input);
  let output = path.join(root, 'exports');
  while (argv.length) {
    const arg = argv.shift();
    if (arg !== '--out' || !argv.length) throw new Error(`Unknown or incomplete argument: ${arg}`);
    output = path.resolve(argv.shift());
  }
  if (output === root || path.relative(output, root).split(path.sep)[0] !== '..') throw new Error('Export directory cannot be the source directory or its ancestor.');
  const oldEntries = await fs.readdir(output).catch(err => err.code === 'ENOENT' ? [] : Promise.reject(err));
  if (oldEntries.length) {
    const old = await fs.readFile(path.join(output, 'manifest.json'), 'utf8').then(JSON.parse).catch(() => null);
    if (!['arc-black-xhs', 'zcx-black-xhs', 'together-xiaohongshu'].includes(old?.generator)) throw new Error('Export directory contains unrecognized files; choose a new --out directory.');
  }
  const reviewDir = path.join(root, 'review');
  await fs.mkdir(reviewDir, {recursive: true});
  await fs.mkdir(path.dirname(output), {recursive: true});
  const stage = await fs.mkdtemp(path.join(path.dirname(output), '.together-render-'));
  let browser;
  let report = {status: 'running', source: input, output, timestamp: new Date().toISOString()};
  const saveReport = () => fs.writeFile(path.join(reviewDir, 'render-check.json'), JSON.stringify(report, null, 2) + '\n');
  try {
    await saveReport();
    const sources = await sourceFiles(root, input);
    const {chromium} = playwrightFor(root);
    browser = await chromium.launch({headless: true, executablePath: chromiumPath(chromium)});
    const sourceUrl = pathToFileURL(input); sourceUrl.searchParams.set('render', '1');
    let proof;
    for (const scale of [1, 2]) {
      const context = await browser.newContext({viewport: {width: 1080, height: 1440}, deviceScaleFactor: scale});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      await page.goto(sourceUrl.href, {waitUntil: 'load', timeout: 30000});
      await ready(page);
      const check = await preflight(page);
      check.problems.push(...errors);
      if (check.problems.length) {
        report = {...report, ...check};
        throw new Error(check.problems.join('\n'));
      }
      if (!proof) proof = check;
      const width = 1080 * scale;
      await fs.mkdir(path.join(stage, String(width)), {recursive: true});
      for (const info of check.pages) {
        const filename = `${String(info.index).padStart(2, '0')}-${info.slug}.png`;
        const destination = path.join(stage, String(width), filename);
        await page.locator('.page').nth(info.index - 1).screenshot({path: destination, scale: 'device', animations: 'disabled'});
        const dimensions = await pngSize(destination);
        if (dimensions[0] !== width || dimensions[1] !== 1440 * scale) throw new Error(`Wrong PNG dimensions: ${filename}: ${dimensions}`);
        if (scale === 1) info.filename = filename;
      }
      await context.close();
    }
    const context = await browser.newContext({viewport: {width: 1440, height: 1000}, deviceScaleFactor: 1});
    const preview = await context.newPage();
    await preview.goto(pathToFileURL(input).href, {waitUntil: 'load'});
    await ready(preview);
    const viewportChecks = [];
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      await preview.setViewportSize({width, height});
      await ready(preview);
      const metrics = await preview.evaluate(() => ({viewport: innerWidth, document: document.documentElement.scrollWidth}));
      viewportChecks.push({name, ...metrics});
      if (metrics.document > metrics.viewport + 1) throw new Error(`${name} preview scrolls horizontally: ${metrics.document} > ${metrics.viewport}`);
      await preview.screenshot({path: path.join(stage, `preview-${name}.png`), fullPage: true});
    }
    const columns = Math.min(3, Math.ceil(Math.sqrt(proof.pages.length)));
    const cards = await Promise.all(proof.pages.map(async info => {
      const image = (await fs.readFile(path.join(stage, '1080', info.filename))).toString('base64');
      return `<figure><img src="data:image/png;base64,${image}" width="324" height="432"><figcaption>${String(info.index).padStart(2, '0')} / ${htmlEscape(info.title)}</figcaption></figure>`;
    }));
    const sheet = await context.newPage();
    const sheetWidth = columns * 324 + (columns - 1) * 20 + 48;
    await sheet.setViewportSize({width: sheetWidth, height: 800});
    await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#121514;color:#d4d9d6;font:13px sans-serif}main{display:grid;grid-template-columns:repeat(${columns},324px);gap:24px 20px}figure{margin:0}img{display:block}figcaption{padding-top:10px;line-height:20px}</style><main>${cards.join('')}</main>`);
    await ready(sheet);
    await sheet.screenshot({path: path.join(stage, 'contact-sheet.png'), fullPage: true});
    if (JSON.stringify(sources) !== JSON.stringify(await sourceFiles(root, input))) throw new Error('Source changed during rendering; rerun after finishing edits.');
    const manifest = {generator: 'arc-black-xhs', version: 1, renderedAt: report.timestamp, sources, title: await preview.title(), pageCount: proof.pages.length, artboard: {width: 1080, height: 1440}, variants: [{folder: '1080', width: 1080, height: 1440}, {folder: '2160', width: 2160, height: 2880}], pages: proof.pages.map(({index, slug, title, topic, filename}) => ({index, slug, title, topic, filename}))};
    await fs.writeFile(path.join(stage, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    const backup = output + `.previous-${Date.now()}`;
    let backedUp = false;
    try { await fs.rename(output, backup); backedUp = true; } catch (err) { if (err.code !== 'ENOENT') throw err; }
    try { await fs.rename(stage, output); } catch (err) { if (backedUp) await fs.rename(backup, output); throw err; }
    if (backedUp) await fs.rm(backup, {recursive: true, force: true});
    report = {...report, status: 'passed', ...proof, viewportChecks, variants: manifest.variants};
    await saveReport();
    console.log(`Rendered ${manifest.pageCount} pages at 1080×1440 and 2160×2880.`);
    console.log(`Contact sheet: ${path.join(output, 'contact-sheet.png')}`);
    console.log(`Review: ${path.join(reviewDir, 'render-check.json')}`);
  } catch (err) {
    report = {...report, status: 'failed', error: err.message};
    await saveReport();
    throw err;
  } finally {
    if (browser) await browser.close();
    await fs.rm(stage, {recursive: true, force: true});
  }
}
main().catch(err => { console.error(err.message); process.exitCode = 1; });

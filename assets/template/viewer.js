(() => {
  const pages = [...document.querySelectorAll('.page')];
  const pad = value => String(value).padStart(2, '0');
  const settings = document.body.dataset;
  const image = (className, src, alt) => Object.assign(document.createElement('img'), {className, src, alt});
  pages.forEach((page, index) => {
    page.id = `page-${pad(index + 1)}`;
    page.setAttribute('aria-label', `第 ${index + 1} 页：${page.dataset.title || ''}`);
    const backdropSource = page.dataset.backdrop ?? settings.backdrop;
    if (page.querySelector('.content') && backdropSource && backdropSource !== 'off') {
      const backdrop = image('theme-backdrop', backdropSource, '');
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.dataset.decorative = 'true';
      page.prepend(backdrop);
    }
    const header = page.querySelector('.page-header');
    const logos = [
      {src: settings.logoOne, name: settings.nameOne || '品牌', className: 'brand-one'},
      {src: settings.logoTwo, name: settings.nameTwo || '品牌', className: 'brand-two'}
    ].filter(logo => logo.src?.trim());
    const headerItems = [];
    if (logos.length) {
      const brands = document.createElement('div');
      brands.className = 'brands';
      logos.forEach((logo, i) => {
        if (i) {
          const cross = document.createElement('span');
          cross.className = 'brand-cross';
          cross.setAttribute('aria-hidden', 'true');
          brands.append(cross);
        }
        brands.append(image(logo.className, logo.src, logo.name));
      });
      headerItems.push(brands);
    }
    const folio = document.createElement('p');
    folio.className = 'folio';
    folio.append(document.createTextNode(pad(index + 1)));
    const total = document.createElement('span');
    total.textContent = `/ ${pad(pages.length)}`;
    folio.append(total);
    headerItems.push(folio);
    header?.replaceChildren(...headerItems);
    const topic = document.createElement('span');
    topic.lang = 'en';
    topic.textContent = page.dataset.topic || '';
    const progress = document.createElement('span');
    progress.className = 'progress';
    progress.setAttribute('aria-hidden', 'true');
    pages.forEach((_, i) => {
      const tick = document.createElement('i');
      if (i === index) tick.className = 'active';
      progress.append(tick);
    });
    page.querySelector('.page-footer')?.replaceChildren(topic, progress);
    const caption = page.closest('.sheet')?.querySelector('figcaption');
    if (caption) {
      const label = document.createElement('span');
      label.textContent = `${pad(index + 1)} / ${page.dataset.title || ''}`;
      const link = document.createElement('a');
      link.href = `exports/1080/${pad(index + 1)}-${page.dataset.slug || `page-${pad(index + 1)}`}.png`;
      link.download = '';
      link.textContent = '下载 PNG';
      caption.replaceChildren(label, link);
    }
  });
  document.querySelectorAll('[data-page-count]').forEach(el => el.textContent = pages.length);
  const wrappers = [...document.querySelectorAll('.artboard-wrap')];
  const updateScale = () => wrappers.forEach(w => w.querySelector('.page')?.style.setProperty('--page-scale', w.clientWidth / 1080));
  const gallery = document.querySelector('.gallery');
  if (gallery) new ResizeObserver(updateScale).observe(gallery);
  window.addEventListener('resize', updateScale);
  const viewToggle = document.getElementById('view-toggle');
  viewToggle?.addEventListener('click', () => {
    const focused = document.body.classList.toggle('focus-view');
    viewToggle.setAttribute('aria-pressed', String(focused));
    viewToggle.textContent = focused ? '总览' : '逐页看';
    updateScale();
  });
  const backdropToggle = document.getElementById('backdrop-toggle');
  if (backdropToggle && !document.querySelector('.theme-backdrop')) backdropToggle.hidden = true;
  backdropToggle?.addEventListener('click', () => {
    const hidden = document.body.classList.toggle('no-backdrop');
    backdropToggle.setAttribute('aria-pressed', String(!hidden));
    backdropToggle.textContent = hidden ? '显示背景字' : '隐藏背景字';
  });
  updateScale();
  document.fonts.ready.then(updateScale);
})();

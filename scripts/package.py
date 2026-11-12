#!/usr/bin/env python3
"""Validate export dimensions and zip publishing PNGs, high-res PNGs, and editable source."""
import argparse
import hashlib
import json
from pathlib import Path
import struct
import tempfile
import zipfile


def png_size(filename):
    with filename.open('rb') as handle:
        header = handle.read(24)
    if header[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError(f'Invalid PNG: {filename}')
    return struct.unpack('>II', header[16:24])


def make_zip(destination, files):
    with tempfile.NamedTemporaryFile(dir=destination.parent, suffix='.zip', delete=False) as temp:
        temporary = Path(temp.name)
    try:
        with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
            for filename, relative in files:
                archive.write(filename, str(relative))
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project', type=Path)
    parser.add_argument('--exports', type=Path, help='Defaults to PROJECT/exports')
    args = parser.parse_args()
    root = args.project.expanduser().resolve()
    exports = args.exports.expanduser().resolve() if args.exports else root / 'exports'
    manifest = json.loads((exports / 'manifest.json').read_text())
    if manifest.get('generator') not in ('arc-black-xhs-general', 'arc-black-xhs', 'zcx-black-xhs', 'together-xiaohongshu'):
        parser.error('Use exports created by render.cjs.')
    report = json.loads((root / 'review/render-check.json').read_text())
    if report.get('status') != 'passed' or report.get('timestamp') != manifest.get('renderedAt') or Path(report.get('output', '')).resolve() != exports:
        parser.error('The latest render did not pass for these exports. Render again before packaging.')
    if not manifest.get('sources'):
        parser.error('Source checksums are missing. Render again with the current script.')
    for item in manifest['sources']:
        filename = (root / item['file']).resolve()
        if not filename.is_relative_to(root) or not filename.is_file():
            parser.error(f'Missing or invalid source: {item["file"]}')
        if hashlib.sha256(filename.read_bytes()).hexdigest() != item['sha256']:
            parser.error(f'Source changed after rendering: {item["file"]}. Render again.')
    count = manifest['pageCount']
    if count < 1 or len(manifest['pages']) != count:
        parser.error('Manifest page count is inconsistent.')
    variants = []
    for variant in manifest['variants']:
        folder = str(variant['folder'])
        files = []
        for page in manifest['pages']:
            filename = page['filename']
            if Path(filename).name != filename:
                parser.error('Manifest contains an invalid PNG filename.')
            source = exports / folder / filename
            if png_size(source) != (variant['width'], variant['height']):
                parser.error(f'Wrong dimensions: {source}')
            files.append((source, Path(filename)))
        if set(path.name for path in (exports / folder).glob('*.png')) != set(page['filename'] for page in manifest['pages']):
            parser.error(f'Unexpected or stale PNGs in {exports / folder}')
        variants.append((exports / f'publish-{folder}.zip', files))
    source_files = []
    for name in ['index.html', 'styles.css', 'viewer.js']:
        filename = root / name
        if not filename.is_file():
            parser.error(f'Missing editable source: {filename}')
        source_files.append((filename, Path(name)))
    for filename in sorted((root / 'assets').rglob('*')):
        if filename.is_file() and not any(part.startswith('.') for part in filename.relative_to(root).parts):
            source_files.append((filename, filename.relative_to(root)))
    for destination, files in variants:
        make_zip(destination, files)
    make_zip(exports / 'editable-source.zip', source_files)
    print(f'Packaged {count} pages: publish-1080.zip, publish-2160.zip, editable-source.zip')
    print(exports)


if __name__ == '__main__':
    main()

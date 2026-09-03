/**
 * Records the intrinsic size of every image in public/images so MDX content can
 * be rendered through next/image with a correct aspect ratio — no layout shift,
 * no hand-maintained width/height on each tag.
 *
 * Run via `npm run build` (prebuild) or directly after adding images.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, 'public', 'images');
const OUT = path.join(ROOT, 'lib', 'image-manifest.json');

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(webp|png|jpe?g|avif|gif)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const manifest = {};
for (const file of (await walk(IMAGES)).sort()) {
  const { width, height } = await sharp(file).metadata();
  const key = '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/');
  manifest[key] = { width, height };
}

await fs.writeFile(OUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(`image-manifest: ${Object.keys(manifest).length} images -> ${path.relative(ROOT, OUT)}`);

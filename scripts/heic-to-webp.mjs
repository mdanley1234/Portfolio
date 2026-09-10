/**
 * Converts HEIC/HEIF (straight off an iPhone) to the WebP that public/images
 * expects. No manual export step.
 *
 * sharp cannot read HEIC — its prebuilt libheif has no HEVC decoder — so macOS's
 * `sips` decodes to a lossless PNG first and sharp does the WebP encode.
 *
 * sips ignores the EXIF orientation tag on that decode and drops it from the PNG,
 * so a portrait iPhone shot comes out lying on its side. The tag is read off the
 * HEIC here and applied to the pixels instead.
 *
 *   node scripts/heic-to-webp.mjs <file-or-dir>... [-o outdir] [--max-width N] [-q 82]
 *
 * Defaults to writing into public/images. Run scripts/image-manifest.mjs after.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

/** EXIF Orientation (tag 0x0112) out of the HEIC's Exif box; 1 when absent. */
function exifOrientation(buf) {
  const marker = Buffer.from('Exif\0\0');
  let at = buf.indexOf(marker);
  while (at !== -1) {
    const tiff = at + marker.length;
    const bom = buf.toString('ascii', tiff, tiff + 2);
    if (bom === 'II' || bom === 'MM') {
      const le = bom === 'II';
      const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
      const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
      if (u16(tiff + 2) === 42) {
        const ifd = tiff + u32(tiff + 4);
        const count = u16(ifd);
        for (let i = 0; i < count; i++) {
          const entry = ifd + 2 + i * 12;
          if (u16(entry) === 0x0112) return u16(entry + 8);
        }
        return 1;
      }
    }
    at = buf.indexOf(marker, at + 1);
  }
  return 1;
}

/** The transform that puts an image of the given orientation upright. */
function upright(pipeline, orientation) {
  switch (orientation) {
    case 2: return pipeline.flop();
    case 3: return pipeline.rotate(180);
    case 4: return pipeline.flip();
    case 5: return pipeline.rotate(90).flop();
    case 6: return pipeline.rotate(90);
    case 7: return pipeline.rotate(270).flop();
    case 8: return pipeline.rotate(270);
    default: return pipeline;
  }
}

const run = promisify(execFile);
const ROOT = process.cwd();

const args = process.argv.slice(2);
const inputs = [];
let outDir = path.join(ROOT, 'public', 'images');
let quality = 82;
let maxWidth = 0;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '-o' || a === '--out') outDir = path.resolve(args[++i]);
  else if (a === '-q' || a === '--quality') quality = Number(args[++i]);
  else if (a === '--max-width') maxWidth = Number(args[++i]);
  else inputs.push(a);
}

if (!inputs.length) {
  console.error('usage: node scripts/heic-to-webp.mjs <file-or-dir>... [-o outdir] [--max-width N] [-q 82]');
  process.exit(1);
}

async function collect(target) {
  const full = path.resolve(target);
  const stat = await fs.stat(full);
  if (stat.isDirectory()) {
    const entries = await fs.readdir(full);
    return entries.filter((n) => /\.heic$|\.heif$/i.test(n)).map((n) => path.join(full, n)).sort();
  }
  return [full];
}

const files = (await Promise.all(inputs.map(collect))).flat();
if (!files.length) {
  console.error('no HEIC/HEIF files found');
  process.exit(1);
}

await fs.mkdir(outDir, { recursive: true });
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'heic2webp-'));

try {
  for (const file of files) {
    const base = path.basename(file).replace(/\.hei[cf]$/i, '');
    const mid = path.join(tmp, `${base}.png`);
    const out = path.join(outDir, `${base}.webp`);

    const orientation = exifOrientation(await fs.readFile(file));
    await run('sips', ['-s', 'format', 'png', file, '--out', mid]);

    let pipeline = upright(sharp(mid), orientation);
    // Rotation happens before the resize, so maxWidth caps the upright width.
    if (maxWidth) pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    const info = await pipeline.webp({ quality }).toFile(out);

    const src = (await fs.stat(file)).size;
    console.log(
      `${path.basename(file)} -> ${path.relative(ROOT, out)}  ` +
        `${info.width}x${info.height}  ${(src / 1024 / 1024).toFixed(1)}MB -> ${(info.size / 1024).toFixed(0)}KB`
    );
  }
} finally {
  await fs.rm(tmp, { recursive: true, force: true });
}

/**
 * Prepare photos for the PicsWebsite project.
 *
 * - Supports .jpg, .png and .CR3 (Canon RAW) by extracting the embedded JPEG.
 * - Edge-scan trim: row/column majority-vote approach (90% pixels must match
 *   border colour) → handles JPEG compression artefacts at border edges.
 * - FIRST_IDX lets you pick which photo appears first in a given album.
 * - All output images are resized to TARGET_H px height.
 * - Only .jpg and .png are processed (CR3 is not used).
 * - Output: public/pics-website/<album>/<file>-trim.webp
 * - Generates src/data/picsWebsite.ts with paths and width/height per image.
 *
 * Run: npx tsx scripts/prepare-pics-website.ts
 */

import { mkdirSync, readdirSync, statSync, writeFileSync, existsSync } from "fs";
import { basename, dirname, join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const sourceRoot = join(root, "..", "PicsWebsite");
const publicDir  = join(root, "public");
const outRoot    = join(publicDir, "pics-website");

/** All output images will have this height in pixels. */
const TARGET_H = 600;

/** Per-channel deviation allowed for a pixel to count as "border colour". */
const THRESH = 50;

/** Fraction of pixels in a row/col that must be border-coloured to call it a border row. */
const BORDER_FRACTION = 0.90;

/** Max width used for the edge-scan proxy (faster on large files). */
const SCAN_W = 1200;

/** Override which index (0-based) to use as the FIRST image for an album.
 *  Albums are keyed by their generated id (lowercase, dashes). */
const FIRST_IDX: Record<string, number> = {
  duinen: 1,  // IMG_3744 instead of IMG_3291
  west:   2,  // third photo
};

/** Basenames (zonder extensie) waarvoor géén edge-trim: volledige foto behouden. */
const NO_TRIM_BASENAMES: Set<string> = new Set([
  "IMG_6317",
  "492131814_29726935853558330_5950526167662999453_n",
]);

interface ImageOut { src: string; width: number; height: number }
interface AlbumOut { id: string; title: string; images: ImageOut[] }

// ── Edge-scan trim ───────────────────────────────────────────────────────────
interface CropBox { left: number; top: number; width: number; height: number }

function edgeScan(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
): CropBox {
  const ch = Math.min(channels, 3);

  function px(x: number, y: number): [number, number, number] {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2 < ch ? i + 2 : i + 1]];
  }

  function colourDiff(a: [number, number, number], b: [number, number, number]) {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
  }

  // Border reference = average of 4 corners
  const corners = [
    px(0, 0), px(width - 1, 0), px(0, height - 1), px(width - 1, height - 1),
  ];
  const ref: [number, number, number] = [
    Math.round(corners.reduce((s, c) => s + c[0], 0) / 4),
    Math.round(corners.reduce((s, c) => s + c[1], 0) / 4),
    Math.round(corners.reduce((s, c) => s + c[2], 0) / 4),
  ];

  // Skip trim if corners are not uniform OR not grey/white-ish
  const spread = Math.max(
    Math.max(...corners.map(c => c[0])) - Math.min(...corners.map(c => c[0])),
    Math.max(...corners.map(c => c[1])) - Math.min(...corners.map(c => c[1])),
    Math.max(...corners.map(c => c[2])) - Math.min(...corners.map(c => c[2])),
  );
  const saturation = Math.max(...ref) - Math.min(...ref);
  if (spread > 40 || saturation > 35) {
    return { left: 0, top: 0, width, height };
  }

  /** True if ≥ BORDER_FRACTION of pixels in [xl..xr] on row y match ref. */
  function rowIsBorder(y: number, xl: number, xr: number): boolean {
    let match = 0;
    const total = xr - xl + 1;
    for (let x = xl; x <= xr; x++) if (colourDiff(px(x, y), ref) <= THRESH) match++;
    return match / total >= BORDER_FRACTION;
  }

  /** True if ≥ BORDER_FRACTION of pixels in [yt..yb] on col x match ref. */
  function colIsBorder(x: number, yt: number, yb: number): boolean {
    let match = 0;
    const total = yb - yt + 1;
    for (let y = yt; y <= yb; y++) if (colourDiff(px(x, y), ref) <= THRESH) match++;
    return match / total >= BORDER_FRACTION;
  }

  let top = 0, bottom = height - 1, left = 0, right = width - 1;

  while (top    <= bottom && rowIsBorder(top,    left, right)) top++;
  while (bottom >= top    && rowIsBorder(bottom, left, right)) bottom--;
  while (left   <= right  && colIsBorder(left,   top,  bottom)) left++;
  while (right  >= left   && colIsBorder(right,  top,  bottom)) right--;

  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

// ── Process one image (jpg/png only) ───────────────────────────────────────
async function processImage(
  sharp: typeof import("sharp"),
  inPath: string,
  outPath: string,
): Promise<{ width: number; height: number }> {
  const baseName = basename(inPath, extname(inPath));
  const skipTrim = NO_TRIM_BASENAMES.has(baseName);

  let pipeline = sharp(inPath).flatten({ background: { r: 255, g: 255, b: 255 } });

  if (!skipTrim) {
    const probe = await sharp(inPath)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .resize({ width: SCAN_W, fit: "inside", withoutEnlargement: false })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = probe;
    const box = edgeScan(data as Buffer, info.width, info.height, info.channels);

    const origMeta = await sharp(inPath).metadata();
    const origW = origMeta.width ?? info.width;
    const origH = origMeta.height ?? info.height;
    const scaleX = origW / info.width;
    const scaleY = origH / info.height;

    const cropLeft   = Math.max(0, Math.round(box.left   * scaleX));
    const cropTop    = Math.max(0, Math.round(box.top    * scaleY));
    const cropWidth  = Math.min(Math.round(box.width  * scaleX), origW - cropLeft);
    const cropHeight = Math.min(Math.round(box.height * scaleY), origH - cropTop);

    if (cropWidth > 0 && cropHeight > 0 && (cropLeft > 0 || cropTop > 0)) {
      pipeline = pipeline.extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight });
    }
  }

  const result = await pipeline.resize({ height: TARGET_H }).webp({ quality: 88 }).toFile(outPath);
  return { width: (result as { width: number }).width, height: (result as { height: number }).height };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  let sharp: typeof import("sharp");
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("Install sharp: npm i -D sharp");
    return;
  }

  if (!existsSync(sourceRoot)) { console.error("Not found:", sourceRoot); process.exit(1); }
  mkdirSync(outRoot, { recursive: true });

  const albums: AlbumOut[] = [];

  for (const dirName of readdirSync(sourceRoot)
    .filter(n => statSync(join(sourceRoot, n)).isDirectory())
    .sort()) {
    const albumSource = join(sourceRoot, dirName);
    const files = readdirSync(albumSource)
      .filter(f => /\.(jpe?g|png)$/i.test(f))
      .sort();
    if (!files.length) continue;

    const albumId     = dirName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const albumOutDir = join(outRoot, albumId);
    mkdirSync(albumOutDir, { recursive: true });

    const outImages: ImageOut[] = [];
    for (const file of files) {
      const base    = basename(file, extname(file));
      const outName = `${base}-trim.webp`;
      const outPath = join(albumOutDir, outName);
      try {
        const { width, height } = await processImage(sharp, join(albumSource, file), outPath);
        outImages.push({ src: `/pics-website/${albumId}/${outName}`, width, height });
        console.log("✓", albumId, "/", file);
      } catch (e) {
        console.warn("✗", file, (e as Error).message);
      }
    }

    if (!outImages.length) continue;

    // Apply first-image override
    const firstIdx = FIRST_IDX[albumId] ?? 0;
    if (firstIdx > 0 && firstIdx < outImages.length) {
      const [img] = outImages.splice(firstIdx, 1);
      outImages.unshift(img);
    }

    albums.push({ id: albumId, title: dirName, images: outImages });
  }

  const ts = `/**
 * Generated by scripts/prepare-pics-website.ts
 */

export interface PicsImage {
  src: string;
  width: number;
  height: number;
}

export interface PicsAlbum {
  id: string;
  title: string;
  images: PicsImage[];
}

export const picsAlbums: PicsAlbum[] = ${JSON.stringify(albums, null, 2)} as const;
`;
  writeFileSync(join(root, "src", "data", "picsWebsite.ts"), ts);
  console.log("\nDone. Albums:", albums.length);
}

main().catch(e => { console.error(e); process.exit(1); });

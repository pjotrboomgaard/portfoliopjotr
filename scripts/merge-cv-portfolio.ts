import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PDFDocument } from "pdf-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, ".."); // .../Portfolio Website/Portfolio/Portfolio
const distDir = join(root, "dist");

// Bestaande website-PDF uit het export-script
const websitePdfPath = join(distDir, "portfolio-website.pdf");

// CV-PDF in Aanvragen/Mijn eigen gegevens
const cvPdfPath = join(
  root,
  "..",
  "..",
  "..",
  "Mijn eigen gegevens",
  "CV tracklist (2).pdf",
);

// Uitvoer: portfolio mét CV vooraan
const outPath = join(distDir, "portfolio-met-cv.pdf");

async function main() {
  const cvBytes = readFileSync(cvPdfPath);
  const webBytes = readFileSync(websitePdfPath);

  const cvDoc = await PDFDocument.load(cvBytes);
  const webDoc = await PDFDocument.load(webBytes);

  const merged = await PDFDocument.create();

  // Eerst alle CV-pagina's
  const cvPages = await merged.copyPages(cvDoc, cvDoc.getPageIndices());
  cvPages.forEach((p) => merged.addPage(p));

  // Daarna alle portfolio-pagina's
  const webPages = await merged.copyPages(webDoc, webDoc.getPageIndices());
  webPages.forEach((p) => merged.addPage(p));

  const outBytes = await merged.save();
  writeFileSync(outPath, outBytes);

  // eslint-disable-next-line no-console
  console.log("✓ portfolio-met-cv.pdf geschreven naar dist/");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


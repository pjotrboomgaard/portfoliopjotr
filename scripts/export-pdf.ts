/**
 * Export portfolio to a single PDF without working hyperlinks (links shown as plain text).
 * Run: npm run pdf   or   npx tsx scripts/export-pdf.ts
 * Output: dist/portfolio-pjotr-boomgaard.pdf
 */

import { projects, aboutText } from "../src/data/projects";
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const visible = projects.filter((p) => !p.hidden);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(): string {
  const projectSections = visible
    .map((p) => {
      const wip = p.wip ? ' <span class="wip">wip</span>' : "";
      const descs = (p.descriptions || [])
        .map((d) => `<p class="desc">${escapeHtml(d)}</p>`)
        .join("");
      const cv = p.cvInfo
        ? `<p class="cv">${escapeHtml(p.cvInfo)}</p>`
        : "";
      const linkList =
        p.links && p.links.length > 0
          ? `<p class="links">${p.links
              .map((l) => `<span>${escapeHtml(l.label)}</span>`)
              .join(" · ")}</p>`
          : "";
      const videoLink = p.videoUrl
        ? `<p class="links"><span>Bekijk op YouTube</span></p>`
        : "";
      return `
        <section class="project">
          <h2>${escapeHtml(p.title)}${wip}</h2>
          <p class="meta">${escapeHtml(p.year)}${p.subtitle ? " · " + escapeHtml(p.subtitle) : ""}</p>
          ${descs}
          ${cv}
          ${linkList}
          ${videoLink}
        </section>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <title>Pjotr Boomgaard — Portfolio</title>
  <style>
    body { font-family: "Lucida Console", "Courier New", monospace; font-size: 11pt; line-height: 1.6; color: #111; max-width: 700px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 1.4rem; font-weight: 400; margin-bottom: 2rem; }
    .project { margin-bottom: 2.5rem; break-inside: avoid; }
    .project h2 { font-size: 1.15rem; font-weight: 400; margin-bottom: 0.2rem; }
    .wip { font-size: 0.7rem; text-transform: uppercase; background: #111; color: #fff; padding: 2px 6px; margin-left: 0.5rem; }
    .meta { font-size: 0.75rem; color: #555; margin-bottom: 0.8rem; }
    .desc, .cv { margin-bottom: 0.5rem; }
    .cv { font-size: 0.85rem; color: #555; }
    .links { margin-top: 0.5rem; font-size: 0.85rem; color: #111; }
    .about { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ddd; }
    .about h2 { font-size: 1rem; margin-bottom: 0.8rem; }
    .about p { margin-bottom: 0.6rem; }
    .contact { font-size: 0.85rem; color: #555; margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>Pjotr Boomgaard</h1>
  ${projectSections}
  <section class="about">
    <h2>Over</h2>
    <p>${escapeHtml(aboutText)}</p>
    <p class="contact">Amsterdam · pjotrboomgaard@gmail.com</p>
  </section>
</body>
</html>`;
}

async function main() {
  const html = buildHtml();
  const outDir = join(root, "dist");
  mkdirSync(outDir, { recursive: true });
  const pdfPath = join(outDir, "portfolio-pjotr-boomgaard.pdf");

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });
    console.log("PDF written:", pdfPath);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

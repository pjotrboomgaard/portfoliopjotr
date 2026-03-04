/**
 * Export portfolio as screen-sized PDF (1440×900px per page).
 *
 * - First: CV (from Mijn eigen gegevens/CV tracklist (2).pdf)
 * - Then: Page 1 TOC, Home grid, projects, About, Partners, Tobor zone pages.
 *
 * Every portfolio page: footer left "Portfolio film  ·  pjotrboomgaard@gmail.com", right page number.
 * Robot zones are clickable links to the zone pages.
 *
 * Run:  npm run pdf:website
 * Out:  dist/portfolio-website.pdf
 */

import puppeteer from "puppeteer";
import { spawn } from "child_process";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { PDFDocument } from "pdf-lib";
import { toborZoneContent } from "../src/data/tobor";
import type { ToborZoneId } from "../src/data/tobor";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = join(__dirname, "..");
const distDir   = join(root, "dist");
const pdfPath   = join(distDir, "portfolio-website.pdf");

// CV komt vooraan; pad: Aanvragen/Mijn eigen gegevens/ (root = Portfolio, 3x omhoog = Aanvragen)
const cvPdfPath = join(root, "..", "..", "..", "Mijn eigen gegevens", "CV tracklist (2).pdf");

const PORT = 4173;
const SITE = `http://127.0.0.1:${PORT}`;
const W = 1440, H = 900;

const FOOTER_LEFT = "Portfolio film  ·  pjotrboomgaard@gmail.com";

// Zone order for PDF pages (top to bottom)
const ZONE_ORDER: ToborZoneId[] = ["sirene", "hoofd", "nek", "romp", "benen", "hoverboard"];

// Zone positions on robot (same as ProjectSection) for clickable overlays
const ZONE_STYLES: { id: ToborZoneId; top: string; height: string }[] = [
  { id: "sirene", top: "0%", height: "10%" },
  { id: "hoofd", top: "12%", height: "12%" },
  { id: "nek", top: "18%", height: "18%" },
  { id: "romp", top: "25%", height: "25%" },
  { id: "benen", top: "45%", height: "45%" },
  { id: "hoverboard", top: "78%", height: "20%" },
];

function runBuild(): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn("npm", ["run", "build"], { cwd: root, shell: true, stdio: "inherit" });
    p.on("close", code => code === 0 ? resolve() : reject(new Error(`build exited ${code}`)));
  });
}

function startPreview() {
  const p = spawn("npx", ["vite", "preview", "--port", String(PORT)], {
    cwd: root, shell: true, stdio: ["ignore", "pipe", "pipe"],
  });
  return new Promise<typeof p>(r => setTimeout(() => r(p), 2500));
}

function waitForServer(url: string, tries = 80): Promise<void> {
  return new Promise((resolve, reject) => {
    let n = 0;
    const ping = () => {
      n++;
      fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) })
        .then(() => resolve())
        .catch(() => n < tries ? setTimeout(ping, 400) : reject(new Error("server timeout")));
    };
    ping();
  });
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log("▶  Building…");
  await runBuild();
  if (!existsSync(distDir)) throw new Error("dist/ not found after build");

  console.log("▶  Starting preview server…");
  const server = await startPreview();
  await waitForServer(SITE);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-web-security"],
    protocolTimeout: 300_000,
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(120_000);
    page.setDefaultNavigationTimeout(90_000);
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await page.goto(SITE, { waitUntil: "networkidle0", timeout: 60_000 });

    await page.evaluateHandle("document.fonts.ready");
    await Promise.race([
      page.evaluate(`new Promise(function(resolve) {
        var imgs = Array.from(document.querySelectorAll('img'));
        var left = imgs.filter(function(i){ return !i.complete; });
        if (!left.length) { resolve(); return; }
        var done = 0;
        left.forEach(function(img) {
          function fin() { done++; if (done === left.length) resolve(); }
          img.addEventListener('load', fin);
          img.addEventListener('error', fin);
        });
      })`),
      sleep(25_000),
    ]);

    await page.evaluate(`(async function() {
      function d(ms){ return new Promise(function(r){ setTimeout(r,ms); }); }
      var h = document.body.scrollHeight;
      for (var y = 0; y <= h; y += 500) { window.scrollTo(0, y); await d(60); }
      window.scrollTo(0, 0);
      await d(400);
    })()`);
    await sleep(600);

    const sections = await page.evaluate(`(function() {
      var out = [];
      if (document.querySelector('#home')) out.push({ id: 'home', label: 'Portfolio' });
      document.querySelectorAll('.project-section').forEach(function(el) {
        if (!el.id) return;
        var h2 = el.querySelector('h2');
        var yr = el.querySelector('.p-year');
        out.push({ id: el.id, label: (h2 ? h2.textContent : el.id) + (yr ? '  ·  ' + yr.textContent : '') });
      });
      return out;
    })()`);

    // ── TOC: two columns (title left, list right), compact so all 14 fit ─────
    await page.evaluate(`(function(sections, W, H) {
      var toc = document.createElement('section');
      toc.id = 'pdf-toc';
      toc.className = 'pdf-toc';
      toc.style.cssText = 'width:' + W + 'px;height:' + H + 'px;box-sizing:border-box;padding:60px 100px;background:#fff;font-family:"Lucida Console","Courier New",monospace;display:flex;flex-direction:row;align-items:stretch;gap:80px;position:relative;';

      var left = document.createElement('div');
      left.style.cssText = 'flex:0 0 320px;display:flex;flex-direction:column;justify-content:center;';
      var h1 = document.createElement('h1');
      h1.textContent = 'Pjotr Boomgaard';
      h1.style.cssText = 'font-size:1.85rem;font-weight:400;margin:0 0 0.35rem;letter-spacing:0.04em;';
      left.appendChild(h1);
      var sub = document.createElement('p');
      sub.textContent = 'filmmaker  ·  architect  ·  maker';
      sub.style.cssText = 'font-size:0.8rem;color:rgba(0,0,0,0.4);margin:0;letter-spacing:0.08em;';
      left.appendChild(sub);
      toc.appendChild(left);

      var right = document.createElement('div');
      right.style.cssText = 'flex:1;display:flex;flex-direction:column;justify-content:center;min-width:0;';
      var inhoud = document.createElement('p');
      inhoud.textContent = 'Inhoud';
      inhoud.style.cssText = 'font-size:0.65rem;text-transform:uppercase;letter-spacing:0.12em;color:rgba(0,0,0,0.35);margin:0 0 0.6rem;';
      right.appendChild(inhoud);
      var ul = document.createElement('ul');
      ul.style.cssText = 'list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.38rem;';
      sections.forEach(function(s, i) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + s.id;
        a.textContent = (i + 1) + '.  ' + s.label;
        a.style.cssText = 'font-size:0.7rem;color:#111;text-decoration:none;letter-spacing:0.02em;';
        li.appendChild(a);
        ul.appendChild(li);
      });
      right.appendChild(ul);
      toc.appendChild(right);

      var main = document.querySelector('main') || document.body;
      main.insertBefore(toc, main.firstChild);
    })(${JSON.stringify(sections)}, ${W}, ${H})`);

    // ── Tobor zone pages (after #tobor-ai) ────────────────────────────────────
    const zoneData = ZONE_ORDER.map(id => ({
      id,
      image: toborZoneContent[id].image,
      caption: toborZoneContent[id].captionNl,
      text: toborZoneContent[id].nl,
    }));
    const toborAiSection = await page.$("#tobor-ai");
    if (toborAiSection) {
      await page.evaluate(
        (data: typeof zoneData, H: number, W: number) => {
          const main = document.querySelector("main") || document.body;
          const ref = document.getElementById("tobor-ai");
          if (!ref) return;
          const font = '"Lucida Console","Courier New",monospace';
          // Insert in reverse so DOM order is sirene, hoofd, nek, romp, benen, hoverboard
          for (let i = data.length - 1; i >= 0; i--) {
            const z = data[i];
            const sec = document.createElement("section");
            sec.id = "pdf-tobor-zone-" + z.id;
            sec.className = "project-section pdf-zone-page";
            sec.style.cssText = `width:${W}px;height:${H}px;box-sizing:border-box;padding:80px 100px;background:#fff;font-family:${font};display:flex;flex-direction:column;align-items:flex-start;gap:1rem;overflow:hidden;position:relative;`;
            const img = document.createElement("img");
            img.src = z.image;
            img.alt = z.caption;
            img.style.cssText = "max-width:320px;max-height:320px;object-fit:contain;display:block;";
            const cap = document.createElement("p");
            cap.textContent = z.caption;
            cap.style.cssText = "font-size:0.9rem;font-weight:400;margin:0;";
            const p = document.createElement("p");
            p.textContent = z.text;
            p.style.cssText = "font-size:0.8rem;line-height:1.6;color:#111;margin:0;max-width:42em;";
            sec.appendChild(img);
            sec.appendChild(cap);
            sec.appendChild(p);
            main.insertBefore(sec, ref.nextSibling);
          }
        },
        zoneData,
        H,
        W
      );
    }

    // ── Replace Tobor zone buttons with links ─────────────────────────────────
    await page.evaluate(
      (styles: { id: string; top: string; height: string }[]) => {
        const wrap = document.querySelector(".ps-tobor-body-img-container");
        if (!wrap) return;
        const buttons = wrap.querySelectorAll(".ps-tobor-body-zone");
        buttons.forEach((btn, i) => {
          const zoneId = (btn as HTMLElement).getAttribute("data-zone-id");
          if (!zoneId) return;
          const s = styles.find(z => z.id === zoneId);
          if (!s) return;
          const a = document.createElement("a");
          a.href = "#pdf-tobor-zone-" + zoneId;
          a.setAttribute("aria-label", zoneId);
          a.style.cssText = `position:absolute;left:0;right:0;width:100%;top:${s.top};height:${s.height};display:block;z-index:2;cursor:pointer;`;
          btn.parentNode!.insertBefore(a, btn);
          a.appendChild(btn);
        });
      },
      ZONE_STYLES
    );

    // ── Make project images and grid cards clickable (same as before) ─────────
    await page.evaluate(`(function() {
      document.querySelectorAll('.project-section').forEach(function(section) {
        var linkEl = section.querySelector('.p-links a, .p-video-link a');
        if (!linkEl) return;
        var href = linkEl.getAttribute('href');
        if (!href) return;
        var figure = section.querySelector('.p-figure');
        if (!figure || figure.parentElement && figure.parentElement.tagName === 'A') return;
        var a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.cssText = 'display:block;text-decoration:none;cursor:pointer;';
        figure.parentNode.insertBefore(a, figure);
        a.appendChild(figure);
      });
      document.querySelectorAll('.grid-card').forEach(function(card) {
        var pid = card.getAttribute('data-project-id');
        if (!pid) return;
        var thumb = card.querySelector('.grid-card-thumb');
        if (!thumb || (thumb.parentElement && thumb.parentElement.tagName === 'A')) return;
        var a = document.createElement('a');
        a.href = '#' + pid;
        a.style.cssText = 'display:block;text-decoration:none;';
        thumb.parentNode.insertBefore(a, thumb);
        a.appendChild(thumb);
      });
    })()`);

    // ── Add footer to every page in DOM order (after zone pages are inserted) ─
    await page.evaluate(
      (leftText: string) => {
        const main = document.querySelector("main");
        if (!main) return;
        const font = '"Lucida Console","Courier New",monospace';
        const pages = Array.from(main.children).filter(
          (c) => (c as HTMLElement).id === "pdf-toc" || (c as HTMLElement).id === "home" || c.classList.contains("project-section") || c.classList.contains("pdf-zone-page")
        );
        const total = pages.length;
        pages.forEach((el, idx) => {
          const node = el as HTMLElement;
          if (node.querySelector(".pdf-page-footer")) return;
          const pageNum = idx + 1;
          const footer = document.createElement("div");
          footer.className = "pdf-page-footer";
          footer.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;box-sizing:border-box;font-family:${font};font-size:0.68rem;color:rgba(0,0,0,0.4);letter-spacing:0.04em;`;
          const left = document.createElement("span");
          left.textContent = leftText;
          const right = document.createElement("span");
          right.textContent = pageNum + " / " + total;
          footer.appendChild(left);
          footer.appendChild(right);
          node.style.position = "relative";
          node.appendChild(footer);
        });
      },
      FOOTER_LEFT
    );

    // ── PDF print CSS ────────────────────────────────────────────────────────
    await page.addStyleTag({
      content: `
      .ps-inner { opacity: 1 !important; transform: none !important; transition: none !important; }
      .site-header, .nav-overlay, .nav-menu, [class*="DevToolbar"], [id*="dev-toolbar"] { display: none !important; }
      html, body { overflow: visible !important; height: auto !important; }
      .main-content { height: auto !important; }

      #pdf-toc, .pdf-toc { break-before: auto !important; page-break-before: auto !important; }

      #home, .project-section, .ps-about, .ps-partners, .pdf-zone-page {
        break-before: page !important;
        page-break-before: always !important;
        height: ${H}px !important;
        min-height: unset !important;
        max-height: ${H}px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }

      #home *, .project-section *, .ps-about *, .ps-partners *, .pdf-zone-page * {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .p-embed iframe, .ps-memo-embed iframe { max-height: ${H - 160}px !important; }
      .ps-tobor-body-zone { cursor: pointer !important; }
      .grid-card-thumb { cursor: pointer !important; }
    `,
    });

    mkdirSync(distDir, { recursive: true });
    const websitePdfPath = join(distDir, "portfolio-website-only.pdf");
    await (page as any).pdf({
      path: websitePdfPath,
      width: W + "px",
      height: H + "px",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    // CV vooraan, daarna website: samenvoegen tot portfolio-website.pdf
    const mergedPdf = await PDFDocument.create();
    if (existsSync(cvPdfPath)) {
      const cvBytes = readFileSync(cvPdfPath);
      const cvDoc = await PDFDocument.load(cvBytes);
      const cvPages = await mergedPdf.copyPages(cvDoc, cvDoc.getPageIndices());
      cvPages.forEach((p) => mergedPdf.addPage(p));
      console.log("✓  CV toegevoegd (" + cvPages.length + " pagina's)");
    } else {
      console.warn("⚠  CV niet gevonden:", cvPdfPath);
    }
    const webBytes = readFileSync(websitePdfPath);
    const webDoc = await PDFDocument.load(webBytes);
    const webPages = await mergedPdf.copyPages(webDoc, webDoc.getPageIndices());
    webPages.forEach((p) => mergedPdf.addPage(p));
    const mergedBytes = await mergedPdf.save();
    writeFileSync(pdfPath, mergedBytes);
    console.log("✓  PDF written:", pdfPath);
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

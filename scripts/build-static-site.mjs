import { mkdir, readFile, writeFile } from "node:fs/promises";
import { escapeHtml, extractContent } from "./content-utils.mjs";

const sourcePath = "public/generated/storyblok-content.json";
const rawContent = await readFile(sourcePath, "utf8");
const { nails, services } = extractContent(JSON.parse(rawContent));

const lookbookMarkup = nails.length
  ? nails
      .map(
        (nail) => `
          <article class="lookbook-card${nail.isFeatured ? " featured" : ""}">
            ${nail.imageUrl ? `<img src="${escapeHtml(nail.imageUrl)}" alt="${escapeHtml(nail.title)}" loading="lazy">` : "<div class=\"image-placeholder\">尚未提供公開圖片</div>"}
            <div class="card-copy">
              <p>${escapeHtml(nail.category)}</p>
              <h3>${escapeHtml(nail.title)}</h3>
              ${nail.isFeatured ? "<span class=\"featured-label\">FEATURED</span>" : ""}
            </div>
          </article>`,
      )
      .join("")
  : `<p class="empty-state">目前尚無已發布的 Lookbook 作品。Storyblok Draft 內容不會出現在此 staging 頁面。</p>`;

const serviceMarkup = services.length
  ? services
      .map(
        (service) => `
          <article class="service-card">
            <p class="eyebrow">${escapeHtml(service.priceDisplay)}</p>
            <h3>${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description)}</p>
          </article>`,
      )
      .join("")
  : `<p class="empty-state">目前尚無已發布的服務資料。</p>`;

const html = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>CS Nail Studio｜Storyblok Staging</title>
    <style>
      :root { color-scheme: light; --cream: #f8f5f0; --ink: #292727; --rose: #a76061; --line: #e7ded6; }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--cream); color: var(--ink); font-family: Arial, "Noto Sans TC", sans-serif; line-height: 1.6; }
      main { width: min(1100px, calc(100% - 40px)); margin: 0 auto; padding: 64px 0 96px; }
      .eyebrow { color: var(--rose); font-size: .74rem; font-weight: 700; letter-spacing: .15em; margin: 0 0 10px; }
      h1 { font-size: clamp(2.2rem, 9vw, 5.5rem); letter-spacing: -.06em; line-height: .96; margin: 0; max-width: 760px; }
      .intro { max-width: 620px; color: #655f5a; margin: 24px 0 64px; }
      section { border-top: 1px solid var(--line); padding-top: 30px; margin-top: 46px; }
      h2 { font-size: 1rem; letter-spacing: .12em; margin: 0 0 24px; }
      .lookbook-grid { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 18px; }
      .lookbook-card { background: #fff; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 30px rgba(65, 47, 37, .06); }
      .lookbook-card.featured { outline: 1px solid var(--rose); outline-offset: 4px; }
      img, .image-placeholder { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; background: #e8dfd6; }
      .image-placeholder { align-content: center; color: #7d736b; padding: 24px; text-align: center; }
      .card-copy { padding: 18px; }
      .card-copy p { color: var(--rose); font-size: .75rem; letter-spacing: .1em; margin: 0; text-transform: uppercase; }
      h3 { font-size: 1.15rem; margin: 4px 0 0; }
      .featured-label { color: var(--rose); display: block; font-size: .68rem; font-weight: 700; letter-spacing: .15em; margin-top: 10px; }
      .services { display: grid; gap: 14px; }
      .service-card { background: #fff; border-left: 3px solid var(--rose); padding: 22px; }
      .service-card > p:last-child { color: #655f5a; margin-bottom: 0; }
      .empty-state { background: #fff; color: #655f5a; padding: 24px; }
      footer { color: #756d67; font-size: .78rem; margin-top: 64px; }
      @media (min-width: 700px) { .lookbook-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .services { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <p class="eyebrow">CS NAIL STUDIO · STORYBLOK STAGING</p>
        <h1>指尖美學，靜態內容驗收。</h1>
        <p class="intro">此頁只在建置階段讀取 Storyblok 的已發布內容。未發布 Draft 不會呈現在公開部署結果中。</p>
      </header>
      <section>
        <h2>LOOKBOOK</h2>
        <div class="lookbook-grid">${lookbookMarkup}</div>
      </section>
      <section>
        <h2>SERVICES</h2>
        <div class="services">${serviceMarkup}</div>
      </section>
      <footer>Staging only · No customer booking link is included in this verification site.</footer>
    </main>
  </body>
</html>`;

await mkdir("dist", { recursive: true });
await writeFile("dist/index.html", html, "utf8");
await writeFile("dist/.nojekyll", "", "utf8");

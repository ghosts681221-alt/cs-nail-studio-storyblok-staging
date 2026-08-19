import assert from "node:assert/strict";
import test from "node:test";
import { escapeHtml, extractContent } from "../scripts/content-utils.mjs";

test("extractContent only returns Storyblok Lookbook and service blocks in display order", () => {
  const result = extractContent({
    body: [
      { component: "service_price", title: "極致全彩", price_display: "NT$1,000 — 1,300", description: "全套列印" },
      { component: "nail_design", title: "Later", sort_order: 2, image: { filename: "https://example.com/later.jpg" } },
      { component: "teaser", headline: "Ignore" },
      { component: "nail_design", title: "First", sort_order: 1, is_featured: true, image: { filename: "https://example.com/first.jpg" } },
    ],
  });

  assert.deepEqual(result.nails.map((nail) => nail.title), ["First", "Later"]);
  assert.equal(result.nails[0].isFeatured, true);
  assert.equal(result.nails[0].imageUrl, "https://example.com/first.jpg");
  assert.equal(result.services[0].title, "極致全彩");
});

test("escapeHtml prevents CMS text from becoming markup", () => {
  assert.equal(escapeHtml('<img src=x onerror="bad">'), "&lt;img src=x onerror=&quot;bad&quot;&gt;");
});

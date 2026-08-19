export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function extractContent(content) {
  const body = Array.isArray(content?.body) ? content.body : [];
  const nails = body
    .filter((block) => block?.component === "nail_design")
    .map((block) => ({
      title: String(block.title ?? "未命名作品"),
      category: String(block.category ?? "Lookbook"),
      imageUrl:
        typeof block.image === "string"
          ? block.image
          : String(block.image?.filename ?? ""),
      isFeatured: block.is_featured === true,
      sortOrder: Number.isFinite(Number(block.sort_order)) ? Number(block.sort_order) : 9999,
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);

  const services = body
    .filter((block) => block?.component === "service_price")
    .map((block) => ({
      title: String(block.title ?? "服務方案"),
      priceDisplay: String(block.price_display ?? "價格洽詢"),
      description: String(block.description ?? ""),
    }));

  return { nails, services };
}

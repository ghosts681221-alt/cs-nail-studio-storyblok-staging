import { mkdir, writeFile } from "node:fs/promises";

const token = process.env.STORYBLOK_DELIVERY_TOKEN;

if (!token) {
  throw new Error("Missing STORYBLOK_DELIVERY_TOKEN. Use a Storyblok delivery token, never a management token.");
}

const url = new URL("https://api.storyblok.com/v2/cdn/stories/home");
url.searchParams.set("token", token);
url.searchParams.set("version", "published");

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Storyblok published-content request failed: ${response.status}`);
}

const payload = await response.json();
if (!payload?.story?.content) {
  throw new Error("Storyblok response did not include story.content");
}

await mkdir("public/generated", { recursive: true });
await writeFile(
  "public/generated/storyblok-content.json",
  `${JSON.stringify(payload.story.content, null, 2)}\n`,
  "utf8",
);

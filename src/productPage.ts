export type ProductPageExtraction = {
  ok: boolean;
  source: string;
  text: string;
  warnings: string[];
};

const supportedHosts = [
  { host: "iherb.com", source: "iHerb" },
  { host: "coupang.com", source: "Coupang" },
  { host: "shopping.naver.com", source: "Naver Shopping" },
  { host: "search.shopping.naver.com", source: "Naver Shopping" },
  { host: "smartstore.naver.com", source: "Naver Smartstore" },
];

const usefulSections = [
  "supplement facts",
  "영양",
  "기능정보",
  "성분",
  "원재료",
  "ingredients",
  "epa",
  "dha",
  "vitamin",
  "mg",
  "iu",
  "mcg",
  "cfu",
];

export function isSupportedShoppingUrl(value: string) {
  return getShoppingSource(value) !== "지원하지 않는 사이트";
}

export function getShoppingSource(value: string) {
  const hostname = extractHostname(value);
  if (!hostname) {
    return "지원하지 않는 사이트";
  }
  return supportedHosts.find((item) => hostname === item.host || hostname.endsWith(`.${item.host}`))?.source ?? "지원하지 않는 사이트";
}

export function extractProductPageText(html: string, url: string): ProductPageExtraction {
  const source = getShoppingSource(url);
  const urlProductName = extractProductNameFromUrl(url);
  const jsonLdText = extractJsonLdText(html);
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescription = firstMatch(
    html,
    /<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  );
  const heading = firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const visibleText = htmlToText(html);
  const usefulText = selectUsefulLines(visibleText);
  const text = uniqueLines([title, metaDescription, heading, urlProductName, jsonLdText, usefulText].filter(Boolean).join("\n"));

  return {
    ok: text.length > 0,
    source,
    text,
    warnings: text.length > 0 ? [] : ["제품명이나 성분표를 충분히 읽지 못했습니다."],
  };
}

export function extractProductNameFromUrl(value: string) {
  const path = /^https?:\/\/[^/?#]+\/([^?#]+)/i.exec(value.trim())?.[1] ?? "";
  const segments = path
    .split("/")
    .map((segment) => decodeURIComponentSafe(segment))
    .filter((segment) => segment && !/^\d+$/.test(segment) && segment !== "pr" && segment !== "vp" && segment !== "products");
  const bestSegment = segments.find((segment) => /[a-z가-힣]/i.test(segment)) ?? "";
  return bestSegment
    .replace(/\.(html?|php)$/i, "")
    .replace(/[-_+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function extractJsonLdText(html: string) {
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return matches
    .flatMap((match) => flattenJsonText(parseJson(stripHtml(match[1]))))
    .filter(Boolean)
    .join("\n");
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function flattenJsonText(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (typeof value === "number") return [String(value)];
  if (Array.isArray(value)) return value.flatMap(flattenJsonText);
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([key]) => ["name", "description", "brand", "sku", "category", "offers"].includes(key) || !key.startsWith("@"))
      .flatMap(([, nested]) => flattenJsonText(nested));
  }
  return [];
}

function htmlToText(html: string) {
  return stripHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<(br|p|div|li|tr|section|h[1-6])\b[^>]*>/gi, "\n"),
  );
}

function stripHtml(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, " "));
}

function decodeHtml(value: string) {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function selectUsefulLines(text: string) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 2 && line.length <= 240);
  const directHits = lines.filter((line) => usefulSections.some((term) => line.toLowerCase().includes(term)));
  return directHits.slice(0, 80).join("\n");
}

function uniqueLines(value: string) {
  const seen = new Set<string>();
  return value
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((line) => {
      const key = line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join("\n");
}

function firstMatch(value: string, pattern: RegExp) {
  const match = pattern.exec(value);
  return match ? stripHtml(match[1]).trim() : "";
}

function extractHostname(value: string) {
  const match = /^https?:\/\/([^/?#]+)/i.exec(value.trim());
  return match?.[1]?.toLowerCase().replace(/:\d+$/, "") ?? "";
}

function decodeURIComponentSafe(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

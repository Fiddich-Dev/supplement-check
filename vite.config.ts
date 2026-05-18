import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { extractProductNameFromUrl, extractProductPageText, getShoppingSource, isSupportedShoppingUrl } from "./src/productPage";

export default defineConfig({
  plugins: [react(), productParseApi()],
});

function productParseApi() {
  return {
    name: "product-parse-api",
    configureServer(server: any) {
      server.middlewares.use("/api/parse-product", handleParseProduct);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use("/api/parse-product", handleParseProduct);
    },
  };
}

function handleParseProduct(req: any, res: any) {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "POST 요청만 지원합니다." });
    return;
  }

  readJsonBody(req)
    .then(async (body) => {
      const url = typeof body.url === "string" ? body.url.trim() : "";

      if (!isSupportedShoppingUrl(url)) {
        sendJson(res, 400, {
          ok: false,
          error: "현재는 Coupang, iHerb, Naver Shopping 링크만 읽습니다.",
        });
        return;
      }

      const fetchPage = (globalThis as unknown as {
        fetch: (input: string, init?: { headers?: Record<string, string> }) => Promise<{
          ok: boolean;
          status: number;
          text: () => Promise<string>;
        }>;
      }).fetch;
      const response = await fetchPage(url, {
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
        },
      });

      if (!response.ok) {
        const fallbackName = extractProductNameFromUrl(url);
        if (fallbackName) {
          sendJson(res, 200, {
            ok: true,
            source: getShoppingSource(url),
            text: fallbackName,
            warnings: [`상품 페이지가 HTTP ${response.status}로 차단되어 URL에서 제품명만 읽었습니다.`],
          });
          return;
        }
        sendJson(res, 502, {
          ok: false,
          error: `상품 페이지를 읽지 못했습니다. HTTP ${response.status}`,
        });
        return;
      }

      const html = await response.text();
      const result = extractProductPageText(html, url);
      sendJson(res, 200, result);
    })
    .catch(() => {
      sendJson(res, 500, {
        ok: false,
        error: "상품 페이지를 분석하는 중 오류가 발생했습니다.",
      });
    });
}

function readJsonBody(req: any): Promise<{ url?: unknown }> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: { toString: () => string }) => {
      body += chunk.toString();
      if (body.length > 20_000) reject(new Error("request too large"));
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: any, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

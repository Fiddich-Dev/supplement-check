import { describe, expect, it } from "vitest";
import { extractProductNameFromUrl, extractProductPageText, isSupportedShoppingUrl } from "./productPage";

describe("product page extraction", () => {
  it("detects supported shopping URLs", () => {
    expect(isSupportedShoppingUrl("https://www.iherb.com/pr/example")).toBe(true);
    expect(isSupportedShoppingUrl("https://www.coupang.com/vp/products/123")).toBe(true);
    expect(isSupportedShoppingUrl("https://search.shopping.naver.com/catalog/123")).toBe(true);
    expect(isSupportedShoppingUrl("https://example.com/product")).toBe(false);
  });

  it("extracts useful text from iHerb-like product HTML", () => {
    const result = extractProductPageText(
      `
        <html>
          <head>
            <title>Example Omega 3</title>
            <meta name="description" content="Fish Oil with EPA and DHA">
          </head>
          <body>
            <h1>Example Omega 3</h1>
            <section>
              <h2>Supplement Facts</h2>
              <p>Fish Oil 1000 mg</p>
              <p>EPA 300 mg</p>
              <p>DHA 150 mg</p>
            </section>
          </body>
        </html>
      `,
      "https://www.iherb.com/pr/example",
    );

    expect(result.ok).toBe(true);
    expect(result.text).toContain("Example Omega 3");
    expect(result.text).toContain("EPA 300 mg");
    expect(result.text).toContain("DHA 150 mg");
    expect(result.source).toBe("iHerb");
  });

  it("extracts product text from JSON-LD when visible facts are sparse", () => {
    const result = extractProductPageText(
      `
        <html>
          <head>
            <script type="application/ld+json">
              {"@type":"Product","name":"Vitamin D 5000 IU","description":"Vitamin D3 5000 IU per softgel"}
            </script>
          </head>
          <body></body>
        </html>
      `,
      "https://search.shopping.naver.com/catalog/123",
    );

    expect(result.text).toContain("Vitamin D 5000 IU");
    expect(result.text).toContain("Vitamin D3 5000 IU");
    expect(result.source).toBe("Naver Shopping");
  });

  it("extracts a readable product name from an iHerb URL when the page blocks fetch", () => {
    expect(
      extractProductNameFromUrl(
        "https://www.iherb.com/pr/california-gold-nutrition-omega-3-premium-fish-oil-100-fish-gelatin-softgels/62118",
      ),
    ).toBe("california gold nutrition omega 3 premium fish oil 100 fish gelatin softgels");
  });
});

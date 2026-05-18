import { describe, expect, it } from "vitest";
import { buildDsldSearchUrl, formatDsldSummary, normalizeDsldHits, normalizeDsldQuery } from "./dsld";

describe("DSLD helpers", () => {
  it("builds an NIH DSLD search URL for product lookup", () => {
    const url = buildDsldSearchUrl("omega 3");

    expect(url).toContain("https://api.ods.od.nih.gov/dsld/v9/search-filter");
    expect(url).toContain("q=omega+3+fish+oil");
    expect(url).toContain("status=1");
  });

  it("normalizes Korean ingredient names before searching DSLD", () => {
    expect(normalizeDsldQuery("오메가3 1000mg")).toBe("omega 3 fish oil");
    expect(normalizeDsldQuery("루테인 20mg")).toBe("lutein zeaxanthin");
  });

  it("normalizes DSLD hits into readable product summaries", () => {
    const summaries = normalizeDsldHits([
      {
        _id: "123",
        _source: {
          fullName: "Omega 3",
          brandName: "Example Brand",
          allIngredients: [
            { ingredientGroup: "EPA" },
            { ingredientGroup: "DHA" },
            { ingredientGroup: "EPA" },
          ],
        },
      },
    ]);

    expect(summaries[0]).toEqual({
      id: "123",
      name: "Omega 3",
      brand: "Example Brand",
      ingredients: ["EPA", "DHA"],
    });
    expect(formatDsldSummary(summaries[0])).toContain("NIH DSLD 조회 제품");
  });
});

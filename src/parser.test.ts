import { describe, expect, it } from "vitest";
import { amountToIu, amountToMg, parseProductFacts } from "./parser";

describe("parseProductFacts", () => {
  it("parses omega-3 EPA and DHA amounts from pasted label text", () => {
    const facts = parseProductFacts("Fish Oil 1000 mg. EPA 300mg, DHA 150mg per capsule.");

    expect(facts.ingredients.map((item) => item.id)).toContain("omega3");
    expect(amountToMg(facts.epa)).toBe(300);
    expect(amountToMg(facts.dha)).toBe(150);
  });

  it("parses Korean vitamin D and microgram units", () => {
    const facts = parseProductFacts("비타민D 25μg 1일 1정");
    const vitaminD = facts.ingredients.find((item) => item.id === "vitaminD");

    expect(vitaminD?.amount?.value).toBe(25);
    expect(vitaminD?.amount?.unit).toBe("mcg");
  });

  it("parses probiotic CFU amounts written in Korean units", () => {
    const facts = parseProductFacts("프로바이오틱스 10억 cfu 보장");
    const probiotics = facts.ingredients.find((item) => item.id === "probiotics");

    expect(probiotics?.amount?.value).toBe(1_000_000_000);
  });

  it("converts vitamin D IU amounts for analysis", () => {
    const facts = parseProductFacts("Vitamin D3 5000 IU per capsule");
    const vitaminD = facts.ingredients.find((item) => item.id === "vitaminD");

    expect(amountToIu(vitaminD?.amount)).toBe(5000);
  });
});

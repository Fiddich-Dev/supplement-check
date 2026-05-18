import { describe, expect, it } from "vitest";
import { analyzeSupplement } from "./analysis";

describe("analyzeSupplement", () => {
  it("creates a product-link result with dose, interaction, and timing guidance", () => {
    const result = analyzeSupplement({
      mode: "product",
      primaryInput: "https://www.iherb.com/pr/example-omega-3",
      goal: "눈 건조감",
      currentSupplements: "멀티비타민, 비타민 D",
      currentMedicines: "항응고제",
    });

    expect(result.conclusion).toContain("제품 기준");
    expect(result.tags).toContain("EPA+DHA 확인");
    expect(result.sections.dose).toContain("라벨");
    expect(result.sections.interactions).toContain("전문가 확인");
    expect(result.sections.timing).toContain("식사");
    expect(result.showServingScenario).toBe(true);
  });

  it("creates a goal result that separates evidence from marketing habits", () => {
    const result = analyzeSupplement({
      mode: "goal",
      primaryInput: "눈 피로",
      goal: "",
      currentSupplements: "",
      currentMedicines: "",
    });

    expect(result.conclusion).toContain("성분보다 목적");
    expect(result.tags).toContain("목적 먼저 확인");
    expect(result.sections.explanation).toContain("마케팅");
    expect(result.showServingScenario).toBe(false);
  });

  it("creates an ad-copy result focused on meaningfulness rather than simple truth", () => {
    const result = analyzeSupplement({
      mode: "ad",
      primaryInput: "하루 한 캡슐로 온 가족 눈 건강을 관리하세요",
      goal: "눈 피로",
      currentSupplements: "",
      currentMedicines: "",
    });

    expect(result.conclusion).toContain("거짓 여부보다");
    expect(result.tags).toContain("맥락 부족");
    expect(result.sections.explanation).toContain("맞는 말");
    expect(result.sections.evidence).toContain("공식 출처");
  });
});

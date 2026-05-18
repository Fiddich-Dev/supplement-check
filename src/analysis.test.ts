import { describe, expect, it } from "vitest";
import { analyzeSupplement } from "./analysis";

describe("analyzeSupplement", () => {
  it("creates a product-link result with dose, interaction, and timing guidance", () => {
    const result = analyzeSupplement({
      mode: "product",
      primaryInput: "https://www.iherb.com/pr/example-omega-3",
      productDetails: "",
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
      productDetails: "",
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
      productDetails: "",
      goal: "눈 피로",
      currentSupplements: "",
      currentMedicines: "",
    });

    expect(result.conclusion).toContain("거짓 여부보다");
    expect(result.tags).toContain("맥락 부족");
    expect(result.sections.explanation).toContain("맞는 말");
    expect(result.sections.evidence).toContain("공식 출처");
  });

  it("parses omega-3 label text and calculates active EPA plus DHA amount", () => {
    const result = analyzeSupplement({
      mode: "product",
      primaryInput: "테스트 오메가3",
      productDetails: "Supplement Facts: Fish Oil 1000 mg, EPA 400 mg, DHA 200 mg. Suggested use: 1 softgel daily.",
      goal: "눈 건조감",
      currentSupplements: "",
      currentMedicines: "warfarin",
    });

    expect(result.conclusion).toContain("EPA+DHA 600 mg");
    expect(result.tags).toContain("유효 함량 계산됨");
    expect(result.sections.dose).toContain("EPA 400 mg + DHA 200 mg");
    expect(result.sections.interactions).toContain("warfarin");
    expect(result.sections.evidence).toContain("NIH ODS");
  });

  it("flags lutein marketing as weak for generic eye fatigue while recognizing AREDS2 context", () => {
    const result = analyzeSupplement({
      mode: "product",
      primaryInput: "루테인 제품",
      productDetails: "Lutein 20 mg, Zeaxanthin 2 mg. 눈 피로와 스마트폰 눈 건강.",
      goal: "눈 피로",
      currentSupplements: "",
      currentMedicines: "",
    });

    expect(result.conclusion).toContain("눈 피로 목적");
    expect(result.tags).toContain("목적 불일치");
    expect(result.sections.dose).toContain("AREDS2");
    expect(result.sections.evidence).toContain("National Eye Institute");
  });

  it("warns when vitamin D amount is near or above the adult upper limit", () => {
    const result = analyzeSupplement({
      mode: "product",
      primaryInput: "비타민D 고함량",
      productDetails: "Vitamin D3 5000 IU per capsule",
      goal: "면역",
      currentSupplements: "멀티비타민 vitamin d 1000 IU",
      currentMedicines: "",
    });

    expect(result.tags).toContain("상한 주의");
    expect(result.sections.dose).toContain("4,000 IU");
    expect(result.sections.interactions).toContain("중복");
  });
});

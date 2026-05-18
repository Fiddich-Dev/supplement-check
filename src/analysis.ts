import { ingredientRules } from "./evidence";
import {
  amountToIu,
  amountToMg,
  formatAmount,
  ParsedProductFacts,
  parseProductFacts,
} from "./parser";

export type Mode = "product" | "goal" | "ad";

export type AnalyzeInput = {
  mode: Mode;
  primaryInput: string;
  productDetails?: string;
  goal: string;
  currentSupplements: string;
  currentMedicines: string;
  servingScenario?: string;
};

export type AnalysisResult = {
  title: string;
  conclusion: string;
  tags: string[];
  confidence: "낮음" | "보통" | "높음";
  showServingScenario: boolean;
  sections: {
    explanation: string;
    parsedFacts: string;
    dose: string;
    interactions: string;
    timing: string;
    evidence: string;
    expert: string[];
  };
};

const hasText = (value: string) => value.trim().length > 0;

const formatGoal = (input: AnalyzeInput) => {
  if (hasText(input.goal)) return input.goal.trim();
  if (input.mode === "goal" && hasText(input.primaryInput)) return input.primaryInput.trim();
  return "입력한 목적";
};

const formatPurposeContext = (input: AnalyzeInput) => {
  const goal = formatGoal(input);
  return goal === "입력한 목적" ? goal : `${goal} 목적`;
};

const withTopicParticle = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return "입력한 목적은";
  const lastChar = trimmed.charCodeAt(trimmed.length - 1);
  const hasFinalConsonant = lastChar >= 0xac00 && lastChar <= 0xd7a3 && (lastChar - 0xac00) % 28 !== 0;
  return `${trimmed}${hasFinalConsonant ? "은" : "는"}`;
};

export function analyzeSupplement(input: AnalyzeInput): AnalysisResult {
  if (input.mode === "goal") return analyzeGoal(input);
  if (input.mode === "ad") return analyzeAd(input);
  return analyzeProduct(input);
}

function analyzeProduct(input: AnalyzeInput): AnalysisResult {
  const facts = parseProductFacts([input.primaryInput, input.productDetails].filter(Boolean).join("\n"));

  if (facts.ingredients.length === 0) {
    return analyzeProductWithoutFacts(input);
  }

  const firstIngredient = facts.ingredients[0];
  if (firstIngredient.id === "omega3") return analyzeOmega3(input, facts);
  if (firstIngredient.id === "lutein") return analyzeLutein(input, facts);
  if (firstIngredient.id === "vitaminD") return analyzeVitaminD(input, facts);
  return analyzeKnownIngredient(input, facts);
}

function analyzeProductWithoutFacts(input: AnalyzeInput): AnalysisResult {
  const purpose = formatPurposeContext(input);
  const hasMedicine = hasText(input.currentMedicines);
  const hasSupplements = hasText(input.currentSupplements);
  const serving = input.servingScenario || "라벨 권장량";

  return {
    title: "제품 링크 체크 결과",
    conclusion: `제품 기준으로 보면 ${purpose}에는 성분표 보완 입력이 필요합니다.`,
    tags: ["성분표 필요", "제품 기준 판단", "라벨 기준", "섭취 시점 안내"],
    confidence: "낮음",
    showServingScenario: true,
    sections: {
      explanation:
        "상품 링크만으로는 브라우저 보안과 쇼핑몰 동적 렌더링 때문에 안정적인 성분표 추출이 어렵습니다. 제품명은 NIH DSLD 라벨 DB로 조회를 시도하고, 성분표나 상품 설명을 붙여넣으면 실제 룰 기반 판단을 수행합니다.",
      parsedFacts:
        "아직 성분표에서 읽은 함량이 없습니다. 제품 페이지의 Supplement Facts, 영양·기능정보, 원재료/성분표 텍스트를 붙여넣어 주세요.",
      dose:
        `${serving} 기준으로 판단하려면 Supplement Facts 또는 성분표 텍스트가 필요합니다. 오메가3는 EPA+DHA, 비타민류는 1일 섭취량과 상한을 봅니다.`,
      interactions:
        hasMedicine
          ? "입력한 의약품이 있어 상호작용 가능성은 전문가 확인이 필요합니다. 앱은 복용 중단이나 처방 변경을 말하지 않습니다."
          : hasSupplements
            ? "입력한 영양제와 성분이 겹칠 수 있어 총 섭취량 확인이 필요합니다."
            : "복용 중인 영양제나 약을 입력하면 중복 성분과 상호작용 주의를 함께 볼 수 있습니다.",
      timing:
        "성분이 확인되면 지용성 성분, 미네랄, 카페인, 약물 간격 등 섭취 시점 안내를 제공합니다.",
      evidence:
        "NIH ODS, NCCIH, National Eye Institute, FDA 자료를 우선 사용합니다. 제품 페이지의 브랜드 주장은 판단 근거가 아니라 검토 대상입니다.",
      expert: [
        "현재 상태: 링크/제품명만 입력됨",
        "다음 행동: 성분표 캡처 또는 Supplement Facts 텍스트 붙여넣기",
        "외부 API: NIH Dietary Supplement Label Database 검색을 보조 조회로 사용",
      ],
    },
  };
}

function analyzeOmega3(input: AnalyzeInput, facts: ParsedProductFacts): AnalysisResult {
  const goal = formatGoal(input);
  const purpose = formatPurposeContext(input);
  const serving = input.servingScenario || "라벨 권장량";
  const multiplier = servingMultiplier(serving);
  const epaMg = amountToMg(facts.epa);
  const dhaMg = amountToMg(facts.dha);
  const adjustedEpa = epaMg !== undefined ? epaMg * multiplier : undefined;
  const adjustedDha = dhaMg !== undefined ? dhaMg * multiplier : undefined;
  const combined = adjustedEpa !== undefined && adjustedDha !== undefined ? adjustedEpa + adjustedDha : undefined;
  const hasAnticoagulant = containsAny(input.currentMedicines, ["warfarin", "와파린", "항응고", "항혈소판", "aspirin", "아스피린"]);
  const hasCombinedDose = combined !== undefined;

  return {
    title: "제품 링크 체크 결과",
    conclusion:
      hasCombinedDose
        ? `EPA+DHA ${formatMg(combined)} 확인됨. ${purpose}은 제품 함량과 근거 맥락을 나눠 봐야 합니다.`
        : `제품 기준으로 보면 ${purpose}의 오메가3 제품이지만 EPA+DHA 함량이 명확하지 않습니다.`,
    tags: [
      hasCombinedDose ? "유효 함량 계산됨" : "성분표 필요",
      hasCombinedDose ? "EPA+DHA 확인" : "EPA+DHA 확인 필요",
      goal.includes("눈") ? "목적 근거 확인" : "목적별 근거 확인",
      hasAnticoagulant ? "상호작용 주의" : "섭취 시점 안내",
    ],
    confidence: hasCombinedDose ? "보통" : "낮음",
    showServingScenario: true,
    sections: {
      explanation:
        "오메가3는 총 어유량보다 EPA와 DHA 합산량을 봐야 합니다. 혈중 중성지방 목적과 일반 건강·눈 관련 목적은 필요한 함량과 근거 맥락이 다릅니다.",
      parsedFacts: summarizeFacts(facts),
      dose:
        hasCombinedDose
          ? `${serving} 기준 EPA ${formatMg(adjustedEpa!)} + DHA ${formatMg(adjustedDha!)} = EPA+DHA ${formatMg(combined)}입니다. 라벨 원문 기준은 EPA ${formatAmount(facts.epa)}, DHA ${formatAmount(facts.dha)}입니다. 총 어유량만 크게 표시된 제품보다 실제 유효 성분량이 더 중요합니다.`
          : "라벨에서 EPA와 DHA가 따로 표시되지 않아 유효 함량을 계산할 수 없습니다. 성분표에서 EPA, DHA 항목을 확인해야 합니다.",
      interactions: hasAnticoagulant
        ? `현재 먹는 약에 ${input.currentMedicines}가 입력되어 있습니다. NIH ODS는 fish oil이 warfarin 등과 관련해 응고 시간 논의가 있어 전문가 확인이 필요하다고 설명합니다.`
        : "항응고제나 항혈소판제를 복용 중이면 오메가3 고함량 제품은 전문가 확인이 필요합니다.",
      timing: "오메가3는 식사와 함께 먹는 편이 속 불편감과 흡수 측면에서 더 자연스럽습니다.",
      evidence:
        "NIH ODS Omega-3 Fatty Acids fact sheet와 NCCIH omega-3 supplement overview를 기준으로 EPA/DHA, 목적별 근거, 항응고제 주의를 반영했습니다.",
      expert: [
        `파싱된 성분: ${summarizeFacts(facts)}`,
        "근거 출처: NIH ODS Omega-3 Fatty Acids fact sheet",
        "판단 한계: 제품 원료사, 산패 검사, 제3자 인증은 아직 자동 검증하지 않음",
      ],
    },
  };
}

function analyzeLutein(input: AnalyzeInput, facts: ParsedProductFacts): AnalysisResult {
  const goal = formatGoal(input);
  const lutein = facts.ingredients.find((item) => item.id === "lutein");
  const luteinAmount = lutein?.amount;
  const zeaxanthin = findAmountByAlias(facts, "지아잔틴");
  const isGenericEyeFatigue = containsAny(goal, ["눈 피로", "피로", "스마트폰", "수험생"]);

  return {
    title: "제품 링크 체크 결과",
    conclusion: isGenericEyeFatigue
      ? `눈 피로 목적이라면 루테인 제품의 구매 근거는 약합니다. AREDS2 맥락과 일반 눈 피로는 다릅니다.`
      : `${goal} 목적의 루테인 제품은 AREDS2 맥락과 사용 목적을 구분해야 합니다.`,
    tags: [isGenericEyeFatigue ? "목적 불일치" : "목적 확인", "AREDS2 맥락", "지용성 섭취"],
    confidence: "보통",
    showServingScenario: true,
    sections: {
      explanation:
        "루테인과 지아잔틴은 주로 연령 관련 황반변성 진행 억제 맥락에서 다뤄집니다. 일반적인 사무직 눈 피로나 스마트폰 눈 피로 광고는 근거 맥락이 다를 수 있습니다.",
      parsedFacts: summarizeFacts(facts),
      dose:
        `파싱된 함량은 루테인 ${formatAmount(luteinAmount)}${zeaxanthin ? `, 지아잔틴 ${formatAmount(zeaxanthin)}` : ""}입니다. National Eye Institute의 AREDS2 조합은 루테인 10 mg, 지아잔틴 2 mg 맥락으로 제시됩니다.`,
      interactions: "일반적인 의약품 상호작용 단정은 하지 않습니다. 눈 질환이 있거나 치료 중이면 안과 전문의와 상의하는 편이 안전합니다.",
      timing: "루테인 같은 카로티노이드는 지방이 있는 식사와 함께 먹는 방식이 더 자연스럽습니다.",
      evidence:
        "National Eye Institute AREDS2 supplement guidance와 NCCIH eye-condition supplement summary를 기준으로 일반 눈 피로 주장과 AMD 맥락을 분리했습니다.",
      expert: [
        `파싱된 성분: ${summarizeFacts(facts)}`,
        "근거 출처: National Eye Institute AREDS2",
        "판단 한계: 사용자가 AMD 진단을 받았는지 알 수 없으므로 치료 판단은 하지 않음",
      ],
    },
  };
}

function analyzeVitaminD(input: AnalyzeInput, facts: ParsedProductFacts): AnalysisResult {
  const vitaminD = facts.ingredients.find((item) => item.id === "vitaminD");
  const serving = input.servingScenario || "라벨 권장량";
  const multiplier = servingMultiplier(serving);
  const rawAmountIu = amountToIu(vitaminD?.amount);
  const amountIu = rawAmountIu !== undefined ? rawAmountIu * multiplier : undefined;
  const supplementOverlap = containsAny(input.currentSupplements, ["vitamin d", "비타민 d", "비타민d"]);
  const highDose = amountIu !== undefined && amountIu >= 4000;

  return {
    title: "제품 링크 체크 결과",
    conclusion: highDose
      ? `비타민 D ${formatIu(amountIu)}는 성인 상한 4,000 IU 기준에 가까워 중복 섭취 확인이 필요합니다.`
      : `비타민 D 제품은 총 섭취량과 기존 영양제 중복을 같이 봐야 합니다.`,
    tags: [highDose ? "상한 주의" : "총량 확인", supplementOverlap ? "중복 섭취" : "지용성 섭취", "공식 상한 기준"],
    confidence: amountIu !== undefined ? "보통" : "낮음",
    showServingScenario: true,
    sections: {
      explanation:
        "비타민 D는 단일 제품 함량보다 식품, 멀티비타민, 별도 비타민 D 제품을 합친 총 섭취량이 중요합니다.",
      parsedFacts: summarizeFacts(facts),
      dose:
        amountIu !== undefined
          ? `${serving} 기준 비타민 D ${formatIu(amountIu)}입니다. NIH ODS가 제시하는 성인 상한은 총 섭취량 기준 100 mcg, 4,000 IU입니다.`
          : "비타민 D 함량 단위를 읽지 못했습니다. IU 또는 mcg 단위의 라벨 정보를 확인해야 합니다.",
      interactions: supplementOverlap
        ? `현재 먹는 영양제에 비타민 D가 포함되어 있어 중복 섭취 가능성이 있습니다. 총량이 4,000 IU에 가까운지 확인해야 합니다.`
        : "티아지드 이뇨제, 디곡신 등 일부 약을 복용 중이면 전문가 확인이 필요할 수 있습니다.",
      timing: "비타민 D는 지용성 비타민이라 식사와 함께 먹는 방식이 실용적입니다.",
      evidence:
        "NIH ODS Vitamin D fact sheet의 성인 상한 100 mcg, 4,000 IU 기준을 반영했습니다.",
      expert: [
        `파싱된 성분: ${summarizeFacts(facts)}`,
        "근거 출처: NIH ODS Vitamin D fact sheet",
        "판단 한계: 혈중 25(OH)D 농도나 의학적 결핍 진단은 앱이 알 수 없음",
      ],
    },
  };
}

function analyzeKnownIngredient(input: AnalyzeInput, facts: ParsedProductFacts): AnalysisResult {
  const goal = formatGoal(input);
  const ingredient = facts.ingredients[0];
  const rule = ingredientRules.find((item) => item.id === ingredient.id)!;
  const weakGoal = rule.weakGoalHints.some((hint) => goal.toLowerCase().includes(hint.toLowerCase()));
  const interactionHit = rule.interactionKeywords.find((keyword) =>
    [input.currentMedicines, input.currentSupplements].some((text) => text.toLowerCase().includes(keyword.toLowerCase())),
  );

  return {
    title: "제품 링크 체크 결과",
    conclusion: `${rule.displayName} 제품은 ${goal} 목적에서 근거와 함량 맥락을 함께 확인해야 합니다.`,
    tags: [weakGoal ? "근거 제한" : "목적별 확인", interactionHit ? "상호작용 주의" : "함량 확인", "공식 근거 반영"],
    confidence: "보통",
    showServingScenario: true,
    sections: {
      explanation: rule.evidenceSummary,
      parsedFacts: summarizeFacts(facts),
      dose: `${rule.displayName} 함량은 ${formatAmount(ingredient.amount)}로 파싱되었습니다. 제품 라벨의 1일 섭취량 기준인지 확인해야 합니다.`,
      interactions: interactionHit
        ? `${interactionHit} 관련 입력이 있어 전문가 확인이 필요합니다.`
        : "복용 중인 약이나 영양제를 입력하면 중복과 상호작용 가능성을 더 보수적으로 확인합니다.",
      timing: rule.timing,
      evidence: `${rule.evidenceSource}를 기준으로 판단했습니다. 출처: ${rule.sourceUrl}`,
      expert: [
        `파싱된 성분: ${summarizeFacts(facts)}`,
        `근거 출처: ${rule.evidenceSource}`,
        "판단 한계: 성분표 텍스트 품질에 따라 함량 파싱 정확도가 달라짐",
      ],
    },
  };
}

function analyzeGoal(input: AnalyzeInput): AnalysisResult {
  const goal = formatGoal(input);
  const matchingRules = ingredientRules.filter((rule) =>
    rule.weakGoalHints.some((hint) => goal.toLowerCase().includes(hint.toLowerCase())),
  );
  const names = matchingRules.map((rule) => rule.displayName).join(", ") || "오메가3, 루테인, 마그네슘 등";

  return {
    title: "목적 기반 상담 결과",
    conclusion: `${withTopicParticle(goal)} 성분보다 목적과 근거 수준을 먼저 확인해야 합니다.`,
    tags: ["목적 먼저 확인", "근거 수준 분리", "마케팅 표현 주의"],
    confidence: "보통",
    showServingScenario: false,
    sections: {
      explanation:
        `이 목적에는 ${names} 같은 성분이 자주 마케팅됩니다. 하지만 연구된 목적과 광고되는 목적이 다를 수 있어 성분명만으로 구매 판단을 하면 안 됩니다.`,
      parsedFacts:
        "목적 상담은 아직 제품 성분표를 읽지 않습니다. 제품을 고르면 제품 링크 체크에서 실제 함량을 계산합니다.",
      dose:
        "제품을 고르기 전 단계라 구체적인 함량 판단은 하지 않습니다. 제품을 선택하면 라벨 기준 함량과 실제 섭취량을 다시 계산합니다.",
      interactions:
        "목적에 따라 주의 성분이 달라집니다. 복용 중인 약이나 영양제가 있으면 제품 체크 단계에서 중복과 상호작용을 확인합니다.",
      timing:
        "목적 상담 단계에서는 일반적인 시간대만 안내합니다. 실제 섭취 시점은 제품 성분과 복용 중인 약을 함께 봐야 합니다.",
      evidence:
        "식약처, NIH ODS, NCCIH, FDA 같은 공식 출처와 주요 메타분석을 우선합니다.",
      expert: [
        "목적 입력을 성분 후보로 바로 바꾸지 않고 근거 수준부터 분리",
        "광고에서 자주 연결되는 성분과 실제 연구 맥락을 구분",
        "제품 선택 전 상담이므로 구매 추천보다 오해 예방에 집중",
      ],
    },
  };
}

function analyzeAd(input: AnalyzeInput): AnalysisResult {
  const goal = formatGoal(input);
  const facts = parseProductFacts(input.primaryInput);
  const mentioned = facts.ingredients.map((item) => item.name).join(", ");

  return {
    title: "광고/상품 설명 해석 결과",
    conclusion: `${goal} 관련 문구는 거짓 여부보다 구매 판단에 의미 있는 정보인지 확인해야 합니다.`,
    tags: ["맥락 부족", facts.ingredients.length > 0 ? "성분 감지" : "함량 정보 필요", "광고 문구 해석"],
    confidence: facts.ingredients.length > 0 ? "보통" : "낮음",
    showServingScenario: false,
    sections: {
      explanation:
        mentioned
          ? `광고 문구에서 ${mentioned} 성분이 감지되었습니다. 맞는 말처럼 보여도 연구 대상, 섭취량, 사용자 목적이 빠져 있으면 구매 근거로는 약합니다.`
          : "광고에는 맞는 말처럼 보이지만 실제 구매 판단에는 약한 정보가 많습니다. 연구 대상, 섭취량, 사용자 목적이 빠져 있으면 결론을 낮춰 봐야 합니다.",
      parsedFacts: facts.ingredients.length > 0 ? summarizeFacts(facts) : "광고 문구에서 읽은 성분/함량이 없습니다.",
      dose:
        facts.ingredients.length > 0
          ? `감지된 함량: ${summarizeFacts(facts)}. 광고 문구만으로 부족하면 제품 성분표가 필요합니다.`
          : "광고 문구만으로는 유효 함량을 판단할 수 없습니다. 성분표와 1일 섭취량이 있어야 제품 판단으로 넘어갈 수 있습니다.",
      interactions:
        "광고 문구가 안전성을 충분히 설명하지 않는 경우가 많습니다. 약을 복용 중이라면 상호작용 가능성을 별도로 확인해야 합니다.",
      timing:
        "광고에서 섭취 시점을 단정하면 제품 라벨과 성분 특성을 다시 확인해야 합니다.",
      evidence:
        "공식 출처와 논문 근거를 기준으로 광고 문구가 어떤 맥락을 생략했는지 확인합니다.",
      expert: [
        "질병 치료처럼 보이는 표현은 보수적으로 표시",
        "맞는 말과 구매 판단에 유용한 말을 분리",
        "제품 링크나 라벨이 추가되면 함량 판단으로 확장",
      ],
    },
  };
}

function containsAny(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

function findAmountByAlias(facts: ParsedProductFacts, displayName: string) {
  return facts.ingredients.find((item) => item.name.includes(displayName))?.amount;
}

function summarizeFacts(facts: ParsedProductFacts) {
  if (facts.ingredients.length === 0) return "감지된 성분 없음";
  if (facts.epa || facts.dha) {
    return [
      facts.epa ? `EPA ${formatAmount(facts.epa)}` : undefined,
      facts.dha ? `DHA ${formatAmount(facts.dha)}` : undefined,
    ]
      .filter(Boolean)
      .join(", ");
  }
  return facts.ingredients.map((item) => `${item.name} ${formatAmount(item.amount)}`).join(", ");
}

function servingMultiplier(servingScenario: string) {
  if (servingScenario.includes("2캡슐") || servingScenario.includes("두")) return 2;
  if (servingScenario.includes("이틀") || servingScenario.includes("격일")) return 0.5;
  return 1;
}

function formatMg(value: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)} mg`;
}

function formatIu(value: number | undefined) {
  if (value === undefined) return "함량 미확인";
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)} IU`;
}

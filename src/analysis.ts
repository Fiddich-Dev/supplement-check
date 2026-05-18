export type Mode = "product" | "goal" | "ad";

export type AnalyzeInput = {
  mode: Mode;
  primaryInput: string;
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
  const goal = formatGoal(input);
  const hasMedicine = hasText(input.currentMedicines);
  const hasSupplements = hasText(input.currentSupplements);
  const serving = input.servingScenario || "라벨 권장량";

  return {
    title: "제품 링크 체크 결과",
    conclusion: `제품 기준으로 보면 ${goal} 목적에는 함량과 광고 맥락을 함께 확인해야 합니다.`,
    tags: ["제품 기준 판단", "EPA+DHA 확인", "라벨 기준", "섭취 시점 안내"],
    confidence: "보통",
    showServingScenario: true,
    sections: {
      explanation:
        "상품 링크만으로 성분명보다 제품의 실제 섭취량, 유효 성분 함량, 광고 문구의 맥락을 함께 봅니다. 현재 프로토타입은 실제 페이지 파싱 전 단계라 샘플 판단을 보여줍니다.",
      dose:
        `${serving} 기준으로 먼저 판단합니다. 오메가3라면 총 어유량보다 EPA+DHA 합산량이 핵심이고, 비타민류는 상한과 중복 섭취를 같이 봐야 합니다.`,
      interactions:
        hasMedicine
          ? "입력한 의약품이 있어 상호작용 가능성은 전문가 확인이 필요합니다. 앱은 복용 중단이나 처방 변경을 말하지 않습니다."
          : hasSupplements
            ? "입력한 영양제와 성분이 겹칠 수 있어 총 섭취량 확인이 필요합니다."
            : "복용 중인 영양제나 약을 입력하면 중복 성분과 상호작용 주의를 함께 볼 수 있습니다.",
      timing:
        "지용성 성분이나 오메가3 계열은 식사와 함께 먹는 편이 자연스럽습니다. 철분, 칼슘, 카페인, 일부 약은 시간 간격 확인이 필요합니다.",
      evidence:
        "공식 출처와 주요 논문을 우선합니다. 제품 페이지의 브랜드 주장은 판단 근거가 아니라 검토 대상입니다.",
      expert: [
        "추출 대상: 상품명, 성분표, 1일 섭취량, 광고 문구, 원료사/인증 정보",
        "용량 기준: 라벨 권장량을 기본값으로 두고 필요한 경우 섭취량 시나리오를 계산",
        "안전 기준: 의약품 입력 시 단정 대신 전문가 확인 안내",
      ],
    },
  };
}

function analyzeGoal(input: AnalyzeInput): AnalysisResult {
  const goal = formatGoal(input);

  return {
    title: "목적 기반 상담 결과",
    conclusion: `${withTopicParticle(goal)} 성분보다 목적과 근거 수준을 먼저 확인해야 합니다.`,
    tags: ["목적 먼저 확인", "근거 수준 분리", "마케팅 표현 주의"],
    confidence: "보통",
    showServingScenario: false,
    sections: {
      explanation:
        "같은 성분이라도 연구된 목적과 광고되는 목적이 다를 수 있습니다. 이 화면은 익숙한 마케팅 표현과 실제 근거가 연결되는지를 먼저 나눕니다.",
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

  return {
    title: "광고/상품 설명 해석 결과",
    conclusion: `${goal} 관련 문구는 거짓 여부보다 구매 판단에 의미 있는 정보인지 확인해야 합니다.`,
    tags: ["맥락 부족", "함량 정보 필요", "광고 문구 해석"],
    confidence: "낮음",
    showServingScenario: false,
    sections: {
      explanation:
        "광고에는 맞는 말처럼 보이지만 실제 구매 판단에는 약한 정보가 많습니다. 연구 대상, 섭취량, 사용자 목적이 빠져 있으면 결론을 낮춰 봐야 합니다.",
      dose:
        "광고 문구만으로는 유효 함량을 판단할 수 없습니다. 성분표와 1일 섭취량이 있어야 제품 판단으로 넘어갈 수 있습니다.",
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

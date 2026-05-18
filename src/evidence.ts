export type IngredientId =
  | "omega3"
  | "lutein"
  | "vitaminD"
  | "magnesium"
  | "iron"
  | "calcium"
  | "milkThistle"
  | "probiotics";

export type IngredientRule = {
  id: IngredientId;
  displayName: string;
  aliases: string[];
  evidenceSummary: string;
  evidenceSource: string;
  sourceUrl: string;
  timing: string;
  weakGoalHints: string[];
  interactionKeywords: string[];
};

export const ingredientRules: IngredientRule[] = [
  {
    id: "omega3",
    displayName: "오메가3",
    aliases: ["omega-3", "omega 3", "fish oil", "epa", "dha", "오메가3", "어유"],
    evidenceSummary:
      "오메가3 판단은 총 어유량보다 EPA와 DHA 함량이 핵심입니다. 혈중 중성지방 목적은 고용량 맥락에서 근거가 뚜렷하지만, 일반 건강이나 눈 피로 목적은 제품 함량과 목적을 나눠 봐야 합니다.",
    evidenceSource: "NIH ODS Omega-3 Fatty Acids fact sheet",
    sourceUrl: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
    timing: "오메가3는 식사와 함께 먹는 편이 속 불편감과 흡수 측면에서 더 자연스럽습니다.",
    weakGoalHints: ["눈 피로", "집중", "피로", "피부"],
    interactionKeywords: ["warfarin", "와파린", "항응고", "항혈소판", "aspirin", "아스피린"],
  },
  {
    id: "lutein",
    displayName: "루테인/지아잔틴",
    aliases: ["lutein", "zeaxanthin", "루테인", "지아잔틴"],
    evidenceSummary:
      "루테인과 지아잔틴은 AREDS2 맥락에서 연령 관련 황반변성 진행을 늦추는 조합으로 다뤄집니다. 일반적인 눈 피로, 스마트폰 눈 건강 주장과는 근거 맥락이 다릅니다.",
    evidenceSource: "National Eye Institute AREDS2 supplement guidance",
    sourceUrl:
      "https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/age-related-macular-degeneration/nutritional-supplements-age-related-macular-degeneration",
    timing: "루테인 같은 카로티노이드는 지방이 있는 식사와 함께 먹는 방식이 더 자연스럽습니다.",
    weakGoalHints: ["눈 피로", "스마트폰", "블루라이트", "수험생", "집중"],
    interactionKeywords: [],
  },
  {
    id: "vitaminD",
    displayName: "비타민 D",
    aliases: ["vitamin d", "vitamin d3", "cholecalciferol", "비타민 d", "비타민d"],
    evidenceSummary:
      "성인 비타민 D 상한은 총 섭취량 기준 100 mcg, 4,000 IU입니다. 이미 먹는 멀티비타민이나 고함량 제품과 합산해야 합니다.",
    evidenceSource: "NIH ODS Vitamin D fact sheet",
    sourceUrl: "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/",
    timing: "비타민 D는 지용성 비타민이라 식사와 함께 먹는 방식이 실용적입니다.",
    weakGoalHints: ["면역", "피로", "우울", "다이어트"],
    interactionKeywords: ["thiazide", "티아지드", "digoxin", "디곡신"],
  },
  {
    id: "magnesium",
    displayName: "마그네슘",
    aliases: ["magnesium", "마그네슘"],
    evidenceSummary:
      "보충제에서 표시되는 마그네슘은 원료 화합물 무게가 아니라 원소 마그네슘 기준인지 확인해야 합니다. 보충제 유래 마그네슘 상한은 성인 350 mg/day입니다.",
    evidenceSource: "NIH ODS Magnesium fact sheet",
    sourceUrl: "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/",
    timing: "비스포스포네이트나 일부 항생제와는 시간 간격이 필요할 수 있습니다.",
    weakGoalHints: ["수면", "긴장", "근육"],
    interactionKeywords: ["bisphosphonate", "비스포스포네이트", "antibiotic", "항생제"],
  },
  {
    id: "iron",
    displayName: "철분",
    aliases: ["iron", "ferrous", "ferric", "철분"],
    evidenceSummary:
      "철분은 결핍이나 임신 등 맥락에 따라 의미가 크지만, 임의 복용은 중복과 상호작용을 확인해야 합니다. 칼슘과 동시에 먹으면 흡수 방해가 생길 수 있습니다.",
    evidenceSource: "NIH ODS Iron fact sheet",
    sourceUrl: "https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/",
    timing: "철분은 칼슘, 제산제, 갑상선약 등과 시간 간격을 두는 것이 중요할 수 있습니다.",
    weakGoalHints: ["피로", "빈혈"],
    interactionKeywords: ["levothyroxine", "레보티록신", "levodopa", "레보도파", "calcium", "칼슘"],
  },
  {
    id: "calcium",
    displayName: "칼슘",
    aliases: ["calcium", "칼슘"],
    evidenceSummary:
      "칼슘은 제품 라벨의 원소 칼슘량을 봐야 합니다. 철분, 갑상선약 등과 시간 간격이 필요할 수 있습니다.",
    evidenceSource: "NIH ODS Calcium fact sheet",
    sourceUrl: "https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/",
    timing: "칼슘은 철분이나 갑상선약과 동시에 먹지 않도록 간격 확인이 필요할 수 있습니다.",
    weakGoalHints: ["키", "성장"],
    interactionKeywords: ["iron", "철분", "levothyroxine", "레보티록신"],
  },
  {
    id: "milkThistle",
    displayName: "밀크씨슬",
    aliases: ["milk thistle", "silymarin", "밀크씨슬", "실리마린"],
    evidenceSummary:
      "밀크씨슬은 간 건강으로 많이 광고되지만, NCCIH는 사람 대상 건강 상태에 대해 확정적 결론을 내릴 만큼 고품질 근거가 충분하지 않다고 봅니다.",
    evidenceSource: "NCCIH Milk Thistle overview",
    sourceUrl: "https://www.nccih.nih.gov/health/milk-thistle",
    timing: "특정 시간대보다 제품 라벨과 복용 중인 약 확인이 우선입니다.",
    weakGoalHints: ["간", "숙취", "해독", "피로"],
    interactionKeywords: ["diabetes", "당뇨", "간질환", "liver"],
  },
  {
    id: "probiotics",
    displayName: "프로바이오틱스",
    aliases: ["probiotic", "probiotics", "lactobacillus", "bifidobacterium", "cfu", "유산균", "프로바이오틱스"],
    evidenceSummary:
      "프로바이오틱스는 균주와 CFU가 중요합니다. 제품에 총 미생물 무게만 표시되면 살아있는 균 수를 판단하기 어렵습니다.",
    evidenceSource: "NIH ODS Probiotics fact sheet and NCCIH probiotics overview",
    sourceUrl: "https://ods.od.nih.gov/factsheets/Probiotics-HealthProfessional/",
    timing: "균주와 제품 지시에 따르되, 면역저하 상태나 중증 질환이 있으면 전문가 확인이 필요합니다.",
    weakGoalHints: ["면역", "장 건강", "피부"],
    interactionKeywords: ["immunosuppressant", "면역억제", "항암", "중증"],
  },
];

export const sources = ingredientRules.map((rule) => `${rule.evidenceSource}: ${rule.sourceUrl}`);

type DsldHit = {
  _id: string;
  _source?: {
    fullName?: string;
    brandName?: string;
    allIngredients?: Array<{
      name?: string;
      ingredientGroup?: string;
    }>;
  };
};

export type DsldProductSummary = {
  id: string;
  name: string;
  brand: string;
  ingredients: string[];
};

export function buildDsldSearchUrl(query: string) {
  const normalizedQuery = normalizeDsldQuery(query);
  const params = new URLSearchParams({
    q: normalizedQuery,
    status: "1",
    size: "3",
    sort_by: "_score",
    sort_order: "desc",
  });

  return `https://api.ods.od.nih.gov/dsld/v9/search-filter?${params.toString()}`;
}

export function normalizeDsldHits(hits: DsldHit[]): DsldProductSummary[] {
  return hits.map((hit) => {
    const source = hit._source ?? {};
    const ingredientNames = (source.allIngredients ?? [])
      .map((ingredient) => ingredient.ingredientGroup || ingredient.name)
      .filter((name): name is string => Boolean(name))
      .filter(unique)
      .slice(0, 8);

    return {
      id: hit._id,
      name: source.fullName || "제품명 미확인",
      brand: source.brandName || "브랜드 미확인",
      ingredients: ingredientNames,
    };
  });
}

export function formatDsldSummary(summary: DsldProductSummary) {
  return [
    `NIH DSLD 조회 제품: ${summary.brand} ${summary.name}`,
    summary.ingredients.length > 0 ? `라벨 성분 후보: ${summary.ingredients.join(", ")}` : "라벨 성분 후보 없음",
  ].join("\n");
}

function unique(value: string, index: number, array: string[]) {
  return array.indexOf(value) === index;
}

export function normalizeDsldQuery(query: string) {
  const lowered = query.toLowerCase();

  if (lowered.includes("오메가") || lowered.includes("omega")) return "omega 3 fish oil";
  if (lowered.includes("루테인") || lowered.includes("lutein")) return "lutein zeaxanthin";
  if (lowered.includes("비타민d") || lowered.includes("비타민 d") || lowered.includes("vitamin d")) return "vitamin d";
  if (lowered.includes("마그네슘") || lowered.includes("magnesium")) return "magnesium";
  if (lowered.includes("철분") || lowered.includes("iron")) return "iron";
  if (lowered.includes("프로바이오틱") || lowered.includes("유산균") || lowered.includes("probiotic")) return "probiotic";

  return query.replace(/\b\d+(?:\.\d+)?\s?(?:mg|mcg|iu|정|캡슐|softgels?|capsules?)\b/gi, "").trim();
}

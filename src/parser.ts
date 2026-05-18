import { IngredientId, ingredientRules } from "./evidence";

export type ParsedAmount = {
  value: number;
  unit: "mg" | "mcg" | "iu" | "cfu";
};

export type ParsedIngredient = {
  id: IngredientId;
  name: string;
  amount?: ParsedAmount;
};

export type ParsedProductFacts = {
  rawText: string;
  ingredients: ParsedIngredient[];
  epa?: ParsedAmount;
  dha?: ParsedAmount;
  servingText?: string;
};

const unitPattern = "(mg|mcg|µg|μg|iu|i\\.u\\.|cfu|billion cfu|억 cfu)";

export function parseProductFacts(text: string): ParsedProductFacts {
  const rawText = text.trim();
  const ingredients = ingredientRules
    .filter((rule) => rule.aliases.some((alias) => containsTerm(rawText, alias)))
    .map((rule) => ({
      id: rule.id,
      name: rule.displayName,
      amount: findAmountNearAliases(rawText, rule.aliases),
    }));

  return {
    rawText,
    ingredients,
    epa: findAmountNearAliases(rawText, ["epa"]),
    dha: findAmountNearAliases(rawText, ["dha"]),
    servingText: findServingText(rawText),
  };
}

export function normalizeAmount(amount?: ParsedAmount): ParsedAmount | undefined {
  if (!amount) return undefined;
  if (amount.unit === "mcg") return amount;
  return amount;
}

export function amountToMg(amount?: ParsedAmount): number | undefined {
  if (!amount) return undefined;
  if (amount.unit === "mg") return amount.value;
  if (amount.unit === "mcg") return amount.value / 1000;
  return undefined;
}

export function amountToIu(amount?: ParsedAmount): number | undefined {
  if (!amount) return undefined;
  if (amount.unit === "iu") return amount.value;
  return undefined;
}

export function formatAmount(amount?: ParsedAmount): string {
  if (!amount) return "함량 미확인";
  if (amount.unit === "cfu") return `${formatNumber(amount.value)} CFU`;
  if (amount.unit === "iu") return `${formatNumber(amount.value)} IU`;
  if (amount.unit === "mcg") return `${formatNumber(amount.value)} mcg`;
  return `${formatNumber(amount.value)} mg`;
}

function containsTerm(text: string, term: string) {
  return text.toLowerCase().includes(term.toLowerCase());
}

function findAmountNearAliases(text: string, aliases: string[]): ParsedAmount | undefined {
  for (const alias of aliases) {
    const escaped = escapeRegExp(alias);
    const after = new RegExp(`${escaped}[^\\d]{0,40}([\\d,.]+)\\s*${unitPattern}`, "i").exec(text);
    if (after) return toAmount(after[1], after[2]);

    const before = new RegExp(`([\\d,.]+)\\s*${unitPattern}[^\\n,;]{0,40}${escaped}`, "i").exec(text);
    if (before) return toAmount(before[1], before[2]);
  }
  return undefined;
}

function toAmount(value: string, unit: string): ParsedAmount {
  const normalizedUnit = unit.toLowerCase().replaceAll(".", "");
  const parsedValue = Number(value.replaceAll(",", ""));

  if (normalizedUnit === "µg" || normalizedUnit === "μg") {
    return { value: parsedValue, unit: "mcg" };
  }
  if (normalizedUnit === "billion cfu") {
    return { value: parsedValue * 1_000_000_000, unit: "cfu" };
  }
  if (normalizedUnit === "억 cfu") {
    return { value: parsedValue * 100_000_000, unit: "cfu" };
  }
  if (normalizedUnit === "iu") {
    return { value: parsedValue, unit: "iu" };
  }
  if (normalizedUnit === "cfu") {
    return { value: parsedValue, unit: "cfu" };
  }
  return { value: parsedValue, unit: normalizedUnit as "mg" | "mcg" };
}

function findServingText(text: string) {
  const match = /(suggested use|serving size|섭취량|권장량|하루|1일)[^\n.。]{0,80}/i.exec(text);
  return match?.[0]?.trim();
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

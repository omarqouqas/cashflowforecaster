export type VariabilityLevel = 'low' | 'medium' | 'high';

export type MonthlyIncome = {
  id: string;
  label: string; // "January 2025" or "Month 1"
  amount: number;
};

export type VariabilityCalculatorInput = {
  incomes: MonthlyIncome[];
  monthlyExpenses?: number;
};

export type VariabilityCalculatorResult = {
  variabilityLevel: VariabilityLevel;
  variabilityScore: number; // coefficient of variation (%)

  averageIncome: number;
  medianIncome: number;
  standardDeviation: number;
  highestMonth: MonthlyIncome;
  lowestMonth: MonthlyIncome;
  incomeRange: number;
  rangeAsPercentage: number;

  dangerZoneThreshold: number | null;
  monthsBelowDanger: number;
  dangerPercentage: number;
  dangerMonths: MonthlyIncome[];

  percentileBetterThan: number;

  recommendedEmergencyMonths: number;
  recommendedEmergencyFund: number;

  incomeData: Array<{
    label: string;
    amount: number;
    status: 'good' | 'below_average' | 'danger';
  }>;
};

function calculateStandardDeviation(values: number[], mean: number): number {
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid]!;
  }
  const a = sorted[mid - 1]!;
  const b = sorted[mid]!;
  return (a + b) / 2;
}

function getVariabilityLevel(cv: number): VariabilityLevel {
  if (cv < 20) return 'low';
  if (cv < 40) return 'medium';
  return 'high';
}

function getEmergencyMonths(level: VariabilityLevel): number {
  switch (level) {
    case 'low':
      return 2;
    case 'medium':
      return 4;
    case 'high':
      return 6;
  }
}

// Lower CV = more stable = better than more freelancers.
function calculatePercentile(cv: number): number {
  if (cv < 10) return 95;
  if (cv < 15) return 85;
  if (cv < 20) return 75;
  if (cv < 25) return 60;
  if (cv < 30) return 50;
  if (cv < 40) return 35;
  if (cv < 50) return 20;
  if (cv < 60) return 10;
  return 5;
}

export function calculateIncomeVariability(input: VariabilityCalculatorInput): VariabilityCalculatorResult {
  const { incomes, monthlyExpenses } = input;
  const amounts = incomes.map((i) => i.amount);

  const sum = amounts.reduce((a, b) => a + b, 0);
  const averageIncome = sum / amounts.length;
  const medianIncome = calculateMedian(amounts);
  const standardDeviation = calculateStandardDeviation(amounts, averageIncome);

  const variabilityScore = averageIncome > 0 ? (standardDeviation / averageIncome) * 100 : 0;
  const variabilityLevel = getVariabilityLevel(variabilityScore);

  const sortedByAmount = [...incomes].sort((a, b) => b.amount - a.amount);
  const highestMonth = sortedByAmount[0];
  const lowestMonth = sortedByAmount[sortedByAmount.length - 1];
  const incomeRange = highestMonth.amount - lowestMonth.amount;
  const rangeAsPercentage = averageIncome > 0 ? (incomeRange / averageIncome) * 100 : 0;

  const dangerZoneThreshold = monthlyExpenses && monthlyExpenses > 0 ? monthlyExpenses : null;
  const dangerMonths = dangerZoneThreshold ? incomes.filter((i) => i.amount < dangerZoneThreshold) : [];
  const monthsBelowDanger = dangerMonths.length;
  const dangerPercentage = dangerZoneThreshold ? (monthsBelowDanger / incomes.length) * 100 : 0;

  const percentileBetterThan = calculatePercentile(variabilityScore);

  const recommendedEmergencyMonths = getEmergencyMonths(variabilityLevel);
  const baseExpense = dangerZoneThreshold ?? averageIncome * 0.7;
  const recommendedEmergencyFund = recommendedEmergencyMonths * baseExpense;

  const incomeData = incomes.map((income) => {
    let status: 'good' | 'below_average' | 'danger' = 'good';
    if (dangerZoneThreshold && income.amount < dangerZoneThreshold) {
      status = 'danger';
    } else if (income.amount < averageIncome) {
      status = 'below_average';
    }
    return { label: income.label, amount: income.amount, status };
  });

  return {
    variabilityLevel,
    variabilityScore: Math.round(variabilityScore * 10) / 10,
    averageIncome: Math.round(averageIncome),
    medianIncome: Math.round(medianIncome),
    standardDeviation: Math.round(standardDeviation),
    highestMonth,
    lowestMonth,
    incomeRange: Math.round(incomeRange),
    rangeAsPercentage: Math.round(rangeAsPercentage),
    dangerZoneThreshold,
    monthsBelowDanger,
    dangerPercentage: Math.round(dangerPercentage),
    dangerMonths,
    percentileBetterThan,
    recommendedEmergencyMonths,
    recommendedEmergencyFund: Math.round(recommendedEmergencyFund),
    incomeData,
  };
}


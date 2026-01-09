export type RateCalculatorInput = {
  annualIncomeGoal: number;
  monthlyExpenses: number;
  billableHoursPerWeek: number;
  vacationWeeks: number;
};

export type RateCalculatorResult = {
  // Core rates
  minimumHourlyRate: number;
  suggestedHourlyRate: number;
  premiumHourlyRate: number;

  // Derived values
  dailyRate: number;
  weeklyRate: number;
  monthlyRevenueNeeded: number;
  annualRevenueNeeded: number;

  // Context
  annualBillableHours: number;
  workingWeeks: number;
  annualExpenses: number;

  // Project rate examples
  tenHourProject: number;
  twentyHourProject: number;
  fortyHourProject: number;
};

export function calculateHourlyRate(input: RateCalculatorInput): RateCalculatorResult {
  const { annualIncomeGoal, monthlyExpenses, billableHoursPerWeek, vacationWeeks } = input;

  // Calculate working time
  const workingWeeks = Math.max(1, 52 - vacationWeeks);
  const annualBillableHours = billableHoursPerWeek * workingWeeks;

  // Calculate expenses
  const annualExpenses = monthlyExpenses * 12;

  // Total annual revenue needed
  const annualRevenueNeeded = annualIncomeGoal + annualExpenses;

  // Calculate rates
  const minimumHourlyRate = annualBillableHours > 0 ? annualRevenueNeeded / annualBillableHours : 0;

  const suggestedHourlyRate = minimumHourlyRate * 1.2; // 20% buffer
  const premiumHourlyRate = minimumHourlyRate * 1.5; // 50% premium

  // Derived values (based on suggested rate)
  const dailyRate = suggestedHourlyRate * 8;
  const weeklyRate = suggestedHourlyRate * billableHoursPerWeek;
  const monthlyRevenueNeeded = annualRevenueNeeded / 12;

  // Project examples (based on suggested rate)
  const tenHourProject = suggestedHourlyRate * 10;
  const twentyHourProject = suggestedHourlyRate * 20;
  const fortyHourProject = suggestedHourlyRate * 40;

  return {
    minimumHourlyRate: Math.round(minimumHourlyRate * 100) / 100,
    suggestedHourlyRate: Math.round(suggestedHourlyRate * 100) / 100,
    premiumHourlyRate: Math.round(premiumHourlyRate * 100) / 100,
    dailyRate: Math.round(dailyRate),
    weeklyRate: Math.round(weeklyRate),
    monthlyRevenueNeeded: Math.round(monthlyRevenueNeeded),
    annualRevenueNeeded: Math.round(annualRevenueNeeded),
    annualBillableHours,
    workingWeeks,
    annualExpenses: Math.round(annualExpenses),
    tenHourProject: Math.round(tenHourProject),
    twentyHourProject: Math.round(twentyHourProject),
    fortyHourProject: Math.round(fortyHourProject),
  };
}


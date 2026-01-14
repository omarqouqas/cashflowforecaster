// Tax calculation utilities

export interface TaxCalculation {
  grossIncome: number
  taxRate: number
  taxOwed: number
  afterTaxIncome: number
}

export interface QuarterlyTaxSummary {
  quarter: 1 | 2 | 3 | 4
  quarterLabel: string
  months: string
  dueDate: string
  estimatedIncome: number
  estimatedTax: number
  paidSoFar: number
  remaining: number
  status: 'paid' | 'partial' | 'unpaid' | 'upcoming'
}

export interface AnnualTaxSummary {
  year: number
  totalIncome: number
  totalTaxOwed: number
  totalPaid: number
  remaining: number
  quarters: QuarterlyTaxSummary[]
}

/**
 * Calculate tax on a single income amount
 */
export function calculateTax(amount: number, taxRate: number): TaxCalculation {
  const taxOwed = amount * (taxRate / 100)
  const afterTaxIncome = amount - taxOwed

  return {
    grossIncome: amount,
    taxRate,
    taxOwed,
    afterTaxIncome,
  }
}

/**
 * Get quarterly tax deadlines for a given year
 */
export function getQuarterlyDeadlines(year: number) {
  return [
    {
      quarter: 1 as const,
      quarterLabel: 'Q1',
      months: 'Jan-Mar',
      dueDate: `${year}-04-15`,
      dueDateFormatted: 'April 15',
    },
    {
      quarter: 2 as const,
      quarterLabel: 'Q2',
      months: 'Apr-Jun',
      dueDate: `${year}-06-15`,
      dueDateFormatted: 'June 15',
    },
    {
      quarter: 3 as const,
      quarterLabel: 'Q3',
      months: 'Jul-Sep',
      dueDate: `${year}-09-15`,
      dueDateFormatted: 'September 15',
    },
    {
      quarter: 4 as const,
      quarterLabel: 'Q4',
      months: 'Oct-Dec',
      dueDate: `${year + 1}-01-15`,
      dueDateFormatted: `January 15, ${year + 1}`,
    },
  ]
}

/**
 * Get the current quarter based on date
 */
export function getCurrentQuarter(date: Date = new Date()): 1 | 2 | 3 | 4 {
  const month = date.getMonth() + 1 // 1-12
  if (month <= 3) return 1
  if (month <= 6) return 2
  if (month <= 9) return 3
  return 4
}

/**
 * Get the quarter for a specific date
 */
export function getQuarterForDate(date: Date): 1 | 2 | 3 | 4 {
  const month = date.getMonth() + 1 // 1-12
  if (month <= 3) return 1
  if (month <= 6) return 2
  if (month <= 9) return 3
  return 4
}

/**
 * Calculate quarterly tax summary
 */
export function calculateQuarterlyTax(
  income: number,
  taxRate: number,
  paidAmount: number,
  quarter: 1 | 2 | 3 | 4,
  year: number
): QuarterlyTaxSummary {
  const deadlines = getQuarterlyDeadlines(year)
  const deadline = deadlines[quarter - 1]!
  const estimatedTax = income * (taxRate / 100)
  const remaining = Math.max(0, estimatedTax - paidAmount)

  let status: QuarterlyTaxSummary['status'] = 'unpaid'
  if (paidAmount >= estimatedTax) {
    status = 'paid'
  } else if (paidAmount > 0) {
    status = 'partial'
  } else {
    const dueDate = new Date(deadline.dueDate)
    if (dueDate > new Date()) {
      status = 'upcoming'
    }
  }

  return {
    quarter,
    quarterLabel: deadline.quarterLabel,
    months: deadline.months,
    dueDate: deadline.dueDateFormatted,
    estimatedIncome: income,
    estimatedTax,
    paidSoFar: paidAmount,
    remaining,
    status,
  }
}

/**
 * Calculate annual tax summary
 */
export function calculateAnnualTaxSummary(
  quarterlyIncome: [number, number, number, number],
  taxRate: number,
  quarterlyPaid: [number, number, number, number],
  year: number
): AnnualTaxSummary {
  const quarters = quarterlyIncome.map((income, index) =>
    calculateQuarterlyTax(
      income,
      taxRate,
      quarterlyPaid[index]!,
      (index + 1) as 1 | 2 | 3 | 4,
      year
    )
  )

  const totalIncome = quarterlyIncome.reduce((sum, income) => sum + income, 0)
  const totalTaxOwed = totalIncome * (taxRate / 100)
  const totalPaid = quarterlyPaid.reduce((sum, paid) => sum + paid, 0)
  const remaining = Math.max(0, totalTaxOwed - totalPaid)

  return {
    year,
    totalIncome,
    totalTaxOwed,
    totalPaid,
    remaining,
    quarters,
  }
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Get next quarterly deadline
 */
export function getNextQuarterlyDeadline(): { quarter: number; date: Date; formatted: string } {
  const now = new Date()
  const year = now.getFullYear()
  const deadlines = getQuarterlyDeadlines(year)

  for (const deadline of deadlines) {
    const dueDate = new Date(deadline.dueDate)
    if (dueDate > now) {
      return {
        quarter: deadline.quarter,
        date: dueDate,
        formatted: deadline.dueDateFormatted,
      }
    }
  }

  // If no deadline this year, return Q1 of next year
  const nextYearDeadlines = getQuarterlyDeadlines(year + 1)
  const q1NextYear = nextYearDeadlines[0]!
  return {
    quarter: 1,
    date: new Date(q1NextYear.dueDate),
    formatted: q1NextYear.dueDateFormatted,
  }
}

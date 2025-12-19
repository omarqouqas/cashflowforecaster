import posthog from 'posthog-js'

// ============================================
// CORE FEATURE EVENTS
// ============================================

/**
 * Track when user views the calendar
 */
export const trackCalendarView = (daysShown: number = 60) => {
  posthog.capture('calendar_viewed', {
    days_shown: daysShown,
  })
}

/**
 * Track "Can I Afford It?" checks - your core differentiator
 */
export const trackCanIAffordIt = (result: {
  amount: number
  canAfford: boolean
  daysUntilSafe?: number
  dateChecked?: string
}) => {
  posthog.capture('can_i_afford_it_checked', {
    amount: result.amount,
    can_afford: result.canAfford,
    days_until_safe: result.daysUntilSafe,
    date_checked: result.dateChecked,
  })
}

/**
 * Track when user saves a scenario
 */
export const trackScenarioCreated = (scenario: {
  amount: number
  name: string
}) => {
  posthog.capture('scenario_created', {
    amount: scenario.amount,
    scenario_name: scenario.name,
  })
}

/**
 * Track when user clicks on a specific day in the calendar
 */
export const trackDayDetailOpened = (dayData: {
  balance: number
  isNegative: boolean
  transactionCount: number
  daysFromToday: number
}) => {
  posthog.capture('day_detail_opened', {
    balance: dayData.balance,
    is_negative: dayData.isNegative,
    transaction_count: dayData.transactionCount,
    days_from_today: dayData.daysFromToday,
  })
}

// ============================================
// ONBOARDING EVENTS
// ============================================

/**
 * Track each step of the onboarding wizard
 */
export const trackOnboardingStep = (
  step: number,
  stepName: 'account' | 'income' | 'bills' | 'review'
) => {
  posthog.capture('onboarding_step_completed', {
    step_number: step,
    step_name: stepName,
  })
}

/**
 * Track when user completes full onboarding
 */
export const trackOnboardingCompleted = (data?: {
  accountsCreated: number
  incomeSourcesCreated: number
  billsCreated: number
  timeToComplete?: number // in seconds
}) => {
  posthog.capture('onboarding_completed', {
    accounts_created: data?.accountsCreated,
    income_sources_created: data?.incomeSourcesCreated,
    bills_created: data?.billsCreated,
    time_to_complete_seconds: data?.timeToComplete,
  })
}

/**
 * Track if user skips onboarding
 */
export const trackOnboardingSkipped = (atStep: number) => {
  posthog.capture('onboarding_skipped', {
    skipped_at_step: atStep,
  })
}

// ============================================
// DATA ENTRY EVENTS
// ============================================

/**
 * Track when user adds a bank account
 */
export const trackAccountCreated = (
  accountType: 'checking' | 'savings' | 'credit' | 'other'
) => {
  posthog.capture('account_created', {
    account_type: accountType,
  })
}

/**
 * Track when user adds an income source
 */
export const trackIncomeAdded = (data: {
  frequency: string
  isRecurring: boolean
  hasEndDate: boolean
}) => {
  posthog.capture('income_added', {
    frequency: data.frequency,
    is_recurring: data.isRecurring,
    has_end_date: data.hasEndDate,
  })
}

/**
 * Track when user adds a bill
 */
export const trackBillAdded = (data: {
  frequency: string
  category?: string
}) => {
  posthog.capture('bill_added', {
    frequency: data.frequency,
    category: data.category,
  })
}

// ============================================
// RUNWAY COLLECT (INVOICING) EVENTS
// ============================================

/**
 * Track invoice creation
 */
export const trackInvoiceCreated = (data: {
  amount: number
  hasLineItems: boolean
  lineItemCount?: number
}) => {
  posthog.capture('invoice_created', {
    amount: data.amount,
    has_line_items: data.hasLineItems,
    line_item_count: data.lineItemCount,
  })
}

/**
 * Track when user downloads invoice PDF
 */
export const trackInvoiceDownloaded = (amount: number) => {
  posthog.capture('invoice_downloaded', {
    amount,
  })
}

/**
 * Track when invoice is emailed to client
 */
export const trackInvoiceSent = (amount: number) => {
  posthog.capture('invoice_sent', {
    amount,
  })
}

/**
 * Track payment reminder sent
 */
export const trackPaymentReminderSent = (data: {
  reminderType: 'friendly' | 'firm' | 'final'
  daysOverdue: number
  invoiceAmount: number
}) => {
  posthog.capture('payment_reminder_sent', {
    reminder_type: data.reminderType,
    days_overdue: data.daysOverdue,
    invoice_amount: data.invoiceAmount,
  })
}

/**
 * Track when invoice is marked as paid
 */
export const trackInvoiceMarkedPaid = (data: {
  amount: number
  daysOutstanding: number
}) => {
  posthog.capture('invoice_marked_paid', {
    amount: data.amount,
    days_outstanding: data.daysOutstanding,
  })
}

// ============================================
// SUBSCRIPTION & CONVERSION EVENTS
// ============================================

/**
 * Track when user clicks upgrade button
 */
export const trackUpgradeClicked = (data: {
  fromTier: 'free' | 'pro' | 'premium'
  toTier: 'pro' | 'premium'
  interval: 'month' | 'year'
  location: 'pricing_page' | 'settings' | 'feature_gate' | 'dashboard'
}) => {
  posthog.capture('upgrade_clicked', {
    from_tier: data.fromTier,
    to_tier: data.toTier,
    interval: data.interval,
    click_location: data.location,
  })
}

/**
 * Track successful subscription start (call from webhook or success page)
 */
export const trackSubscriptionStarted = (data: {
  tier: 'pro' | 'premium'
  interval: 'month' | 'year'
  amount: number
}) => {
  posthog.capture('subscription_started', {
    tier: data.tier,
    interval: data.interval,
    amount: data.amount,
  })
}

/**
 * Track subscription cancellation
 */
export const trackSubscriptionCanceled = (data: {
  tier: 'pro' | 'premium'
  reason?: string
  daysActive?: number
}) => {
  posthog.capture('subscription_canceled', {
    tier: data.tier,
    reason: data.reason,
    days_active: data.daysActive,
  })
}

/**
 * Track when free user hits a feature gate
 */
export const trackFeatureGateHit = (feature: string) => {
  posthog.capture('feature_gate_hit', {
    feature,
  })
}

// ============================================
// ENGAGEMENT & RETENTION EVENTS
// ============================================

/**
 * Track when low balance warning is displayed
 */
export const trackLowBalanceWarningShown = (data: {
  lowestBalance: number
  daysUntilLow: number
  warningLevel: 'amber' | 'rose'
}) => {
  posthog.capture('low_balance_warning_shown', {
    lowest_balance: data.lowestBalance,
    days_until_low: data.daysUntilLow,
    warning_level: data.warningLevel,
  })
}

/**
 * Track dashboard load with summary data
 */
export const trackDashboardViewed = (summary?: {
  accountCount: number
  totalBalance: number
  upcomingBillsCount: number
  pendingIncomeCount: number
}) => {
  posthog.capture('dashboard_viewed', {
    account_count: summary?.accountCount,
    total_balance: summary?.totalBalance,
    upcoming_bills_count: summary?.upcomingBillsCount,
    pending_income_count: summary?.pendingIncomeCount,
  })
}

// ============================================
// AUTH EVENTS
// ============================================

/**
 * Track signup method
 */
export const trackSignup = (method: 'email' | 'google') => {
  posthog.capture('user_signed_up', {
    auth_method: method,
  })
}

/**
 * Track login
 */
export const trackLogin = (method: 'email' | 'google') => {
  posthog.capture('user_logged_in', {
    auth_method: method,
  })
}

// ============================================
// ERROR EVENTS
// ============================================

/**
 * Track errors for debugging
 */
export const trackError = (data: {
  errorType: string
  errorMessage: string
  component?: string
}) => {
  posthog.capture('error_occurred', {
    error_type: data.errorType,
    error_message: data.errorMessage,
    component: data.component,
  })
}

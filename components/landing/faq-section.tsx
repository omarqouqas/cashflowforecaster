'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What is a cash flow calendar?",
    answer: "A cash flow calendar is a visual tool that maps your expected income (like invoices, paychecks, or client payments) and upcoming bills onto specific dates. Unlike a traditional budget that shows monthly totals, a cash flow calendar shows your projected bank balance day-by-day. This helps you spot low-balance days before they happen, see when multiple bills land on the same day (bill collisions), and know exactly what's safe to spend. Also known as: bill calendar, payment calendar, balance forecast, income calendar."
  },
  {
    question: "What does 'Safe to Spend' mean?",
    answer: "Safe to Spend is the maximum amount you can spend today without risking an overdraft in the next 14 days. It's calculated by taking your lowest projected balance over the next two weeks and subtracting your safety buffer. For example, if your lowest upcoming balance will be $2,500 and your buffer is $500, your Safe to Spend is $2,000. This gives freelancers with irregular income a clear, single number that answers 'Can I afford this?' without guessing. Also known as: available balance, spendable amount, discretionary income."
  },
  {
    question: "How does Cash Flow Forecaster predict my balance?",
    answer: "Cash Flow Forecaster uses a simple but powerful algorithm. You enter your current account balance, recurring income (with frequencies like weekly, bi-weekly, or monthly), and recurring bills with their due dates. The app then projects your balance day-by-day—up to 90 days on Free, or a full 365 days on Pro—showing you exactly when money comes in and goes out. It's like having a financial crystal ball that answers 'Will I have enough on the 15th?' with precision."
  },
  {
    question: "What's included in the weekly email digest?",
    answer: "Every week, you'll receive an email summarizing your upcoming cash flow: total income expected, bills due, your lowest balance day, and any alerts like bill collisions or overdraft risks. You can customize which day and time you receive it in your settings."
  },
  {
    question: "How is this different from Mint or YNAB?",
    answer: "Traditional budgeting apps like Mint and YNAB focus on tracking where your money went—they're backward-looking. Cash Flow Forecaster is forward-looking. Instead of categorizing past expenses, we show you your projected daily balance for up to a full year ahead. The calendar interface answers the real question freelancers have: 'Can I afford this expense before my next paycheck arrives?' Plus, our 'Can I Afford It?' feature lets you test hypothetical purchases and see exactly how they'd impact your future balance."
  },
  {
    question: "Can I import my data from YNAB or Mint?",
    answer: "Yes! We have a dedicated YNAB importer that auto-detects your export format—just upload your CSV and we'll handle the rest. The importer recognizes both YNAB's basic export and register export formats, automatically converting transactions into bills and income sources. No manual column mapping required. For Mint users, our generic CSV importer works great with Mint exports. Either way, you can be up and running with your historical data in minutes. Find the import tools in your dashboard under Import Transactions."
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. Your data is protected with enterprise-grade security. We use Supabase with Row Level Security (RLS), meaning your data is completely isolated and only accessible by you. All connections are encrypted with SSL, and we never store sensitive payment information—that's handled securely by Stripe. We don't sell your data, and you can delete your account and all associated data at any time."
  },
  {
    question: "What's the difference between Free and Pro?",
    answer: "The Free plan gives you the core experience: up to 10 bills, 10 income sources, 90-day forecast, and CSV export. Pro ($7.99/month) unlocks unlimited bills and income sources, extends your forecast to a full year (365 days), adds Excel and JSON export formats, and includes Runway Collect—our professional invoicing feature with PDF generation and automated payment reminders."
  },
  {
    question: "Can I connect my bank account?",
    answer: "Bank sync is coming soon! Currently, Cash Flow Forecaster works with manual entry, which many freelancers actually prefer—it gives you full control and awareness of your finances. You enter your starting balance once, then add your recurring income and bills. The calendar updates automatically. When bank sync launches, it will be optional, not required."
  },
  {
    question: "Who is Cash Flow Forecaster built for?",
    answer: "We built this for freelancers, gig workers, and anyone with irregular income. If you've ever wondered 'Can I pay rent on the 1st?' or 'Am I safe until my next invoice pays?', this is for you. Traditional budgeting apps assume you get a steady paycheck on the 1st and 15th—we don't. Great fit for graphic designers, freelance writers, marketing consultants, web developers, and side-gig hustlers. Not built for complex accounting or businesses with full-time bookkeepers—we keep it simple on purpose."
  },
  {
    question: "What is Runway Collect?",
    answer: "Runway Collect is our built-in invoicing system for Pro users. Create professional invoices, generate PDFs, and email them directly to clients—from your dashboard. When you create an invoice, it automatically appears as expected income in your cash flow forecast. You can also send payment reminders (friendly, firm, or final) to chase down late payments. It's invoicing that actually connects to your cash flow planning."
  },
  {
    question: "How do clients pay my invoices?",
    answer: "With Runway Collect, each invoice includes a secure Stripe payment link. Your client clicks 'Pay Now', enters their card details on Stripe's hosted checkout page, and the payment goes directly to your connected Stripe account. You can also add your logo and business name to invoices for a professional look. When they pay, the invoice status updates automatically and syncs with your forecast—no manual tracking required."
  },
  {
    question: "Can I try it before I pay?",
    answer: "Yes! Our Free tier is fully functional—not a limited trial. You get 10 bills, 10 income sources, 90-day forecasting, and the 'Can I Afford It?' scenario tester. If you want unlimited entries, a longer forecast, or invoicing (Runway Collect), you can upgrade anytime. There's no credit card required to sign up."
  },
  {
    question: "How do I budget with irregular income?",
    answer: "Budgeting with irregular income requires a different approach than traditional monthly budgets. First, calculate your baseline expenses—the minimum you need each month for rent, utilities, insurance, and essentials. Second, build a buffer fund of 2-3 months of expenses to smooth out income fluctuations. Third, use a cash flow calendar (not a monthly budget) to see your projected balance day-by-day. Finally, pay yourself a consistent 'salary' from your business income rather than spending whatever comes in. Cash Flow Forecaster automates the cash flow calendar part, showing you exactly when you'll run low and what's safe to spend."
  },
  {
    question: "Can I export my data?",
    answer: "Yes! Cash Flow Forecaster includes a full Reports & Export feature. Free users can export their data to CSV format, which opens in Excel, Google Sheets, or Numbers. Pro users unlock Excel and JSON export formats, plus access to all report types including Cash Forecast and complete data backups. You can export quick reports like Monthly Summary or Category Spending with one click, or use the Custom Export Builder to select exactly what data you want, choose a date range, and pick your preferred format. Your export history is saved for 30 days so you can re-download previous exports."
  },
  {
    question: "What reports can I generate?",
    answer: "The Reports page offers four quick reports: Monthly Summary (income vs expenses with net cash flow), Category Spending (breakdown by bill category with percentages), Cash Forecast (daily projected balances—Pro only), and All Data (complete backup of your accounts, bills, income, and invoices—Pro only). You can also use the Custom Export Builder to create tailored exports by selecting specific data types, date ranges, and formats. All reports can be exported to CSV (free) or Excel/JSON (Pro)."
  },
  {
    question: "What is cash flow forecasting?",
    answer: "Cash flow forecasting is predicting your future bank balance based on known income and expenses. For freelancers, this means projecting when invoices will be paid, when bills are due, and what your balance will be on any given day. A good cash flow forecast helps you avoid overdrafts, plan large purchases, and manage irregular income. Unlike monthly budgets that hide timing problems, a day-by-day cash flow forecast reveals exactly when you'll run low—before it happens. Also known as: balance projection, cash projection, liquidity forecast."
  }
]

// Generate JSON-LD structured data for FAQPage schema
function generateFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }
}

interface FAQAccordionItemProps {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  index: number
}

function FAQAccordionItem({ item, isOpen, onToggle, index }: FAQAccordionItemProps) {
  return (
    <div 
      className="border border-zinc-700/50 rounded-xl overflow-hidden bg-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-600/50"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-xl"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className="text-lg font-medium text-zinc-100 pr-4">
          {item.question}
        </span>
        <span 
          className={`flex-shrink-0 w-10 h-10 rounded-full bg-zinc-700/50 flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-teal-500/20 rotate-180' : ''
          }`}
        >
          <ChevronDown 
            className={`w-5 h-5 transition-colors duration-300 ${
              isOpen ? 'text-teal-400' : 'text-zinc-400'
            }`} 
          />
        </span>
      </button>
      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 pt-0">
          <p className="text-zinc-400 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section 
      className="relative py-24 bg-zinc-900"
      aria-labelledby="faq-heading"
    >
      {/* Background gradient accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(faqs))
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6">
            <HelpCircle className="w-8 h-8 text-teal-400" />
          </div>
          <h2 
            id="faq-heading"
            className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Everything you need to know about forecasting your cash flow and taking control of your finances.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQAccordionItem
              key={faq.question}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>

        {/* CTA below FAQ */}
        <div className="mt-12 text-center">
          <p className="text-zinc-400 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@cashflowforecaster.io"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors"
          >
            Contact our support team
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
// app/privacy/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Cash Flow Forecaster",
  description: "Privacy Policy for Cash Flow Forecaster",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link
            href="/"
            className="text-lg font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            ← Back to Cash Flow Forecaster
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-zinc-400 mb-8">Last updated: December 21, 2025</p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Introduction
            </h2>
            <p>
              Cash Flow Forecaster ("we", "our", or "us") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our web application at cashflowforecaster.io (the "Service").
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Information We Collect
            </h2>

            <h3 className="text-lg font-medium text-zinc-200 mb-2 mt-4">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Account Information:</strong>{" "}
                Email address, name (if provided via Google OAuth)
              </li>
              <li>
                <strong className="text-white">Financial Data:</strong> Bank
                account names and balances, income sources, bills, and invoices
                you enter into the Service
              </li>
              <li>
                <strong className="text-white">Payment Information:</strong>{" "}
                Processed securely by Stripe; we do not store credit card
                numbers
              </li>
              <li>
                <strong className="text-white">Communications:</strong> Emails
                or messages you send to our support
              </li>
            </ul>

            <h3 className="text-lg font-medium text-zinc-200 mb-2 mt-4">
              2.2 Information Collected Automatically
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Usage Data:</strong> Pages
                visited, features used, time spent on the Service
              </li>
              <li>
                <strong className="text-white">Device Information:</strong>{" "}
                Browser type, operating system, device type
              </li>
              <li>
                <strong className="text-white">Analytics:</strong> We use
                PostHog to understand how users interact with the Service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. How We Use Your Information
            </h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, operate, and maintain the Service</li>
              <li>
                Generate your cash flow projections and financial forecasts
              </li>
              <li>Process your subscription payments</li>
              <li>Send transactional emails (invoices, payment reminders)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve and personalize the Service</li>
              <li>Analyze usage patterns to enhance features</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Data Storage and Security
            </h2>
            <p className="mb-3">
              Your data is stored securely using industry-standard practices:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Database:</strong> Hosted on
                Supabase with encrypted storage and Row Level Security (RLS)
              </li>
              <li>
                <strong className="text-white">Authentication:</strong> Handled
                by Supabase Auth with secure password hashing
              </li>
              <li>
                <strong className="text-white">Payments:</strong> Processed by
                Stripe, a PCI-compliant payment processor
              </li>
              <li>
                <strong className="text-white">Transmission:</strong> All data
                transmitted via HTTPS/TLS encryption
              </li>
            </ul>
            <p className="mt-3">
              While we implement safeguards to protect your information, no
              method of transmission over the internet is 100% secure. We cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Data Sharing and Disclosure
            </h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your data
              with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Service Providers:</strong>{" "}
                Third-party services that help us operate (Supabase, Stripe,
                Vercel, Resend, PostHog)
              </li>
              <li>
                <strong className="text-white">Legal Requirements:</strong> If
                required by law or to protect our rights
              </li>
              <li>
                <strong className="text-white">Business Transfers:</strong> In
                connection with a merger, acquisition, or sale of assets
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Third-Party Services
            </h2>
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Supabase:</strong> Database and
                authentication (
                <a
                  href="https://supabase.com/privacy"
                  className="text-teal-400 hover:text-teal-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong className="text-white">Stripe:</strong> Payment
                processing (
                <a
                  href="https://stripe.com/privacy"
                  className="text-teal-400 hover:text-teal-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong className="text-white">Vercel:</strong> Hosting (
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  className="text-teal-400 hover:text-teal-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong className="text-white">PostHog:</strong> Analytics (
                <a
                  href="https://posthog.com/privacy"
                  className="text-teal-400 hover:text-teal-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong className="text-white">Resend:</strong> Email delivery (
                <a
                  href="https://resend.com/legal/privacy-policy"
                  className="text-teal-400 hover:text-teal-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong className="text-white">Google:</strong> OAuth
                authentication (
                <a
                  href="https://policies.google.com/privacy"
                  className="text-teal-400 hover:text-teal-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                )
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Cookies and Tracking
            </h2>
            <p>
              We use cookies and similar technologies to maintain your session,
              remember your preferences, and analyze usage. PostHog may use
              cookies for analytics purposes. You can control cookie settings
              through your browser, but disabling cookies may affect Service
              functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Your Rights and Choices
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Access:</strong> Request a copy
                of your personal data
              </li>
              <li>
                <strong className="text-white">Correction:</strong> Update
                inaccurate or incomplete data
              </li>
              <li>
                <strong className="text-white">Deletion:</strong> Request
                deletion of your account and data
              </li>
              <li>
                <strong className="text-white">Export:</strong> Download your
                data in a portable format
              </li>
              <li>
                <strong className="text-white">Opt-out:</strong> Unsubscribe
                from marketing communications
              </li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a
                href="mailto:support@cashflowforecaster.io"
                className="text-teal-400 hover:text-teal-300"
              >
                support@cashflowforecaster.io
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active or as
              needed to provide the Service. If you delete your account, we will
              delete your personal data within 30 days, except where retention
              is required by law or for legitimate business purposes (such as
              fraud prevention).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Children's Privacy
            </h2>
            <p>
              The Service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If we learn that we have collected such information, we will
              delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              11. International Users
            </h2>
            <p>
              If you access the Service from outside the United States, your
              data may be transferred to and processed in the United States or
              other countries. By using the Service, you consent to this
              transfer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              12. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes by email or through the Service.
              The "Last updated" date at the top indicates when the policy was
              last revised.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              13. Contact Us
            </h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our
              data practices, please contact us at:
            </p>
            <p className="mt-3">
              <strong className="text-white">Email:</strong>{" "}
              <a
                href="mailto:support@cashflowforecaster.io"
                className="text-teal-400 hover:text-teal-300"
              >
                support@cashflowforecaster.io
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="mx-auto max-w-4xl px-6 py-6 text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} Cash Flow Forecaster. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}

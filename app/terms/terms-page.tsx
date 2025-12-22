// app/terms/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Cash Flow Forecaster",
  description: "Terms of Service for Cash Flow Forecaster",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-zinc-400 mb-8">Last updated: December 21, 2025</p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Cash Flow Forecaster ("the Service"), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Description of Service
            </h2>
            <p>
              Cash Flow Forecaster is a web application that helps users project
              their bank balance into the future by tracking income and
              expenses. The Service provides cash flow forecasting, invoice
              generation (for paid tiers), and financial planning tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. User Accounts
            </h2>
            <p className="mb-3">
              To use certain features of the Service, you must create an
              account. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Providing accurate and complete information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Subscription and Payments
            </h2>
            <p className="mb-3">
              Cash Flow Forecaster offers free and paid subscription tiers:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Free:</strong> Limited features
                with usage caps
              </li>
              <li>
                <strong className="text-white">Pro ($7.99/month):</strong>{" "}
                Unlimited bills/income, 90-day forecasts, invoicing
              </li>
              <li>
                <strong className="text-white">Premium ($14.99/month):</strong>{" "}
                365-day forecasts, all features
              </li>
            </ul>
            <p className="mt-3">
              Payments are processed securely through Stripe. Subscriptions
              renew automatically unless cancelled. You may cancel at any time
              through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Refund Policy
            </h2>
            <p>
              We offer a 7-day refund policy for new subscribers who are not
              satisfied with the Service. To request a refund, contact us at{" "}
              <a
                href="mailto:support@cashflowforecaster.io"
                className="text-teal-400 hover:text-teal-300"
              >
                support@cashflowforecaster.io
              </a>{" "}
              within 7 days of your initial payment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Acceptable Use
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Upload malicious code or content</li>
              <li>Resell or redistribute the Service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Financial Disclaimer
            </h2>
            <p>
              Cash Flow Forecaster is a planning tool and does not provide
              financial advice. Projections are estimates based on the
              information you provide and may not reflect actual future
              balances. We are not responsible for any financial decisions made
              based on the Service's projections. Always consult a qualified
              financial professional for financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Data and Privacy
            </h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <Link
                href="/privacy"
                className="text-teal-400 hover:text-teal-300"
              >
                Privacy Policy
              </Link>
              . By using the Service, you consent to the collection and use of
              your data as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Intellectual Property
            </h2>
            <p>
              The Service, including its design, features, and content, is owned
              by Cash Flow Forecaster and protected by copyright and other
              intellectual property laws. You may not copy, modify, or
              distribute any part of the Service without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Cash Flow Forecaster shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of the
              Service. Our total liability shall not exceed the amount you paid
              for the Service in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              11. Service Availability
            </h2>
            <p>
              We strive to maintain high availability but do not guarantee
              uninterrupted access to the Service. We may modify, suspend, or
              discontinue the Service at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              12. Changes to Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. We will
              notify you of significant changes by email or through the Service.
              Continued use of the Service after changes constitutes acceptance
              of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              13. Termination
            </h2>
            <p>
              We may terminate or suspend your account at any time for violation
              of these terms. Upon termination, your right to use the Service
              ceases immediately. You may also delete your account at any time
              through account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              14. Governing Law
            </h2>
            <p>
              These Terms shall be governed by the laws of the jurisdiction in
              which Cash Flow Forecaster operates, without regard to conflict of
              law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              15. Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at{" "}
              <a
                href="mailto:support@cashflowforecaster.io"
                className="text-teal-400 hover:text-teal-300"
              >
                support@cashflowforecaster.io
              </a>
              .
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

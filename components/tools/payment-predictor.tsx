'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import posthog from 'posthog-js';
import {
  PaymentPredictorForm,
  type PaymentPredictorFormAction,
  type PaymentPredictorFormValues,
} from '@/components/tools/payment-predictor-form';
import { PaymentPredictorResult } from '@/components/tools/payment-predictor-result';
import {
  calculatePaymentDate,
  sortInvoicesByPaymentDate,
  type InvoiceEntry,
  type PaymentPredictorResult as PredictorResult,
} from '@/lib/tools/calculate-payment-date';

function makeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `inv_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

export function PaymentPredictor() {
  const [result, setResult] = useState<PredictorResult | null>(null);
  const [lastInput, setLastInput] = useState<PaymentPredictorFormValues | null>(null);
  const [invoices, setInvoices] = useState<InvoiceEntry[]>([]);

  const interactedOnce = useRef(false);

  useEffect(() => {
    try {
      posthog.capture('tool_payment_predictor_viewed');
    } catch {
      // best-effort
    }
  }, []);

  const defaultValues = useMemo<Partial<PaymentPredictorFormValues>>(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      invoiceDate: today,
      paymentTerms: 'net_30',
      customDays: undefined,
      adjustForWeekends: true,
      clientHistory: 'on_time',
      invoiceAmount: undefined,
      clientName: '',
    };
  }, []);

  const handleAction = (values: PaymentPredictorFormValues, action: PaymentPredictorFormAction) => {
    const computed = calculatePaymentDate({
      invoiceDate: values.invoiceDate,
      paymentTerms: values.paymentTerms,
      customDays: values.customDays,
      adjustForWeekends: values.adjustForWeekends,
      clientHistory: values.clientHistory,
      invoiceAmount: values.invoiceAmount,
      clientName: values.clientName,
    });

    setResult(computed);
    setLastInput(values);

    try {
      posthog.capture('tool_payment_predictor_calculated', {
        payment_terms: values.paymentTerms,
        adjust_for_weekends: values.adjustForWeekends,
        client_history: values.clientHistory,
        days_until_payment: computed.daysFromToday,
      });
    } catch {
      // best-effort
    }

    if (action === 'add_invoice') {
      const entry: InvoiceEntry = {
        id: makeId(),
        invoiceDate: values.invoiceDate,
        paymentTerms: values.paymentTerms,
        customDays: values.customDays,
        adjustForWeekends: values.adjustForWeekends,
        clientHistory: values.clientHistory,
        invoiceAmount: values.invoiceAmount,
        clientName: values.clientName,
        result: computed,
      };

      setInvoices((prev) => {
        const next = sortInvoicesByPaymentDate([...prev, entry]);
        try {
          posthog.capture('tool_payment_predictor_invoice_added', {
            invoices_count: next.length,
            payment_terms: values.paymentTerms,
          });
        } catch {}
        return next;
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Your invoice</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Enter your invoice date and payment terms. We’ll adjust for weekends and clients who pay late.
          </p>

          <div className="mt-6">
            <PaymentPredictorForm
              defaultValues={defaultValues}
              onAction={handleAction}
              onFirstInteraction={() => {
                if (interactedOnce.current) return;
                interactedOnce.current = true;
                try {
                  posthog.capture('tool_payment_predictor_form_interaction');
                } catch {}
              }}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Expected payment</h2>
          <p className="mt-1 text-sm text-zinc-400">
            This is an estimate. The goal is to help you plan cash flow—especially when invoices stack up.
          </p>

          <div className="mt-6">
            <PaymentPredictorResult result={result} lastInput={lastInput} invoices={invoices} />
          </div>
        </div>
      </div>
    </div>
  );
}


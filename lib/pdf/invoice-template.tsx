import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import type { Tables } from '@/types/supabase';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';

type Invoice = Tables<'invoices'>;

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontSize: 11,
    color: '#111827',
    fontFamily: 'Helvetica',
    lineHeight: 1.35,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'right',
  },
  sectionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 18,
  },
  section: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  sectionLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionValue: {
    fontSize: 11,
    color: '#111827',
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 16,
    marginTop: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  amount: {
    fontSize: 26,
    fontWeight: 700,
  },
  meta: {
    fontSize: 11,
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  descriptionLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  description: {
    fontSize: 11,
    color: '#111827',
  },
  footer: {
    marginTop: 28,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 10,
  },
});

export function InvoiceTemplate({
  invoice,
  fromEmail,
}: {
  invoice: Invoice;
  fromEmail: string;
}): React.ReactElement<DocumentProps> {
  const status = invoice.status ?? 'draft';

  return (
    <Document
      title={`Invoice ${invoice.invoice_number}`}
      author={fromEmail}
      subject={`Invoice ${invoice.invoice_number} for ${invoice.client_name}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>INVOICE</Text>
          <View>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
            <Text style={styles.invoiceNumber}>Status: {status}</Text>
          </View>
        </View>

        {/* From / To */}
        <View style={styles.sectionRow}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>From</Text>
            <Text style={styles.sectionValue}>{fromEmail}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>To</Text>
            <Text style={styles.sectionValue}>{invoice.client_name}</Text>
            {invoice.client_email ? (
              <Text style={styles.sectionValue}>{invoice.client_email}</Text>
            ) : null}
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsBox}>
          <View style={styles.detailsRow}>
            <Text style={styles.amount}>{formatCurrency(invoice.amount)}</Text>
            <View>
              <Text style={styles.meta}>Due: {formatDateOnly(invoice.due_date)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.description}>
            {invoice.description?.trim()
              ? invoice.description
              : 'No description provided.'}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Thank you for your business</Text>
      </Page>
    </Document>
  );
}



# Email Parser Feature - Implementation Plan

## Overview

Enable users to import bills by forwarding emails to `bills@cashflowforecaster.io`. The app receives the forwarded email, extracts invoice data using AI, and presents it for user review before creating a bill.

**Problem it solves:** Freelancers receive bills via email from various vendors (utilities, software subscriptions, contractors). Manually entering each bill is tedious and error-prone. This feature automates bill capture while keeping the user in full control - they only share what they explicitly forward.

**Target Users:** Pro subscribers

**Privacy Advantage:** Unlike OAuth-based email scanning, this approach never accesses the user's inbox. Users explicitly choose which emails to share by forwarding them.

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. USER FORWARDS EMAIL                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  User forwards invoice email to bills@cashflowforecaster.io      │   │
│  │  Works from ANY email provider (Gmail, Outlook, Yahoo, etc.)     │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               ▼                                          │
│  2. RESEND RECEIVES EMAIL                                                │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Resend inbound webhook → /api/email/inbound                     │   │
│  │  Identifies user by sender email address                         │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               ▼                                          │
│  3. AI EXTRACTION                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  OpenAI GPT-4 Vision analyzes email body + attachments           │   │
│  │  Extracts: vendor, amount, due date, category                    │   │
│  │  Confidence score per field                                      │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               ▼                                          │
│  4. REVIEW QUEUE                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  User sees extracted bill in Import Bills page                   │   │
│  │  Can edit any field before confirming                            │   │
│  │  Actions: Confirm | Edit | Reject                                │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               ▼                                          │
│  5. BILL CREATED                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Confirmed → creates entry in bills table                        │   │
│  │  Appears on calendar & cash flow forecasts                       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## UI Location

**New dedicated page:** `/dashboard/import-bills`

- Located in navigation after "Bills"
- Shows pending imports awaiting review
- Badge shows count of pending items

**Additional UI elements:**
- Instructions card explaining how to forward emails
- Copy button for `bills@cashflowforecaster.io`
- Import history view

---

## Database Changes

### 1. New Table: `parsed_emails`

Stores received emails and extraction results.

**Migration:** `supabase/migrations/[timestamp]_add_parsed_emails.sql`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users (matched by sender) |
| message_id | VARCHAR(255) | Resend message ID (for deduplication) |
| from_email | VARCHAR(255) | Original sender (before forwarding) |
| forwarded_by | VARCHAR(255) | User's email that forwarded |
| subject | VARCHAR(500) | Email subject line |
| body_text | TEXT | Plain text body |
| body_html | TEXT | HTML body (if available) |
| received_at | TIMESTAMPTZ | When Resend received the email |
| extracted_vendor | VARCHAR(255) | AI-extracted vendor name |
| extracted_amount | DECIMAL(12,2) | AI-extracted amount |
| extracted_currency | VARCHAR(3) | AI-extracted currency (USD, EUR, etc) |
| extracted_due_date | DATE | AI-extracted due date |
| extracted_invoice_number | VARCHAR(100) | AI-extracted invoice number |
| extracted_category | VARCHAR(50) | AI-suggested category |
| extraction_confidence | DECIMAL(3,2) | Overall confidence (0.00-1.00) |
| field_confidences | JSONB | Per-field confidence scores |
| raw_extraction | JSONB | Full AI response for debugging |
| attachments | JSONB | Array of attachment metadata |
| status | VARCHAR(20) | pending, confirmed, rejected, failed |
| confirmed_bill_id | UUID | Link to created bill (after confirm) |
| rejection_reason | VARCHAR(255) | Why user rejected (optional) |
| error_message | TEXT | If processing failed |
| created_at | TIMESTAMPTZ | When record was created |
| updated_at | TIMESTAMPTZ | Last modified |

```sql
CREATE TABLE parsed_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id VARCHAR(255) NOT NULL UNIQUE,
  from_email VARCHAR(255),
  forwarded_by VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  body_text TEXT,
  body_html TEXT,
  received_at TIMESTAMPTZ NOT NULL,
  extracted_vendor VARCHAR(255),
  extracted_amount DECIMAL(12, 2),
  extracted_currency VARCHAR(3) DEFAULT 'USD',
  extracted_due_date DATE,
  extracted_invoice_number VARCHAR(100),
  extracted_category VARCHAR(50),
  extraction_confidence DECIMAL(3, 2),
  field_confidences JSONB DEFAULT '{}',
  raw_extraction JSONB,
  attachments JSONB DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'rejected', 'failed', 'no_user')),
  confirmed_bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
  rejection_reason VARCHAR(255),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE parsed_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own parsed emails"
  ON parsed_emails FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own parsed emails"
  ON parsed_emails FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own parsed emails"
  ON parsed_emails FOR DELETE USING (auth.uid() = user_id);

-- Service role can insert (webhook doesn't have user context)
CREATE POLICY "Service can insert parsed emails"
  ON parsed_emails FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_parsed_emails_user_status
  ON parsed_emails(user_id, status);
CREATE INDEX idx_parsed_emails_forwarded_by
  ON parsed_emails(forwarded_by);
CREATE INDEX idx_parsed_emails_message_id
  ON parsed_emails(message_id);
```

### 2. Extend users table (if needed)

Add verified email addresses for matching forwarded emails.

```sql
-- Users may forward from different emails than their auth email
-- This table allows multiple verified sender addresses per user
CREATE TABLE user_verified_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

ALTER TABLE user_verified_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verified emails"
  ON user_verified_emails FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verified emails"
  ON user_verified_emails FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own verified emails"
  ON user_verified_emails FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_verified_emails_email
  ON user_verified_emails(email);
```

---

## Resend Inbound Email Setup

### 1. Domain Configuration

Add MX record for receiving emails at `bills@cashflowforecaster.io`:

```
Type: MX
Host: bills (or @ for root)
Value: inbound.resend.com
Priority: 10
```

### 2. Resend Webhook Configuration

In Resend dashboard, configure inbound webhook:
- **Endpoint:** `https://cashflowforecaster.io/api/email/inbound`
- **Events:** `email.received`

### 3. Environment Variables

```env
# Already configured for outbound
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Webhook secret for verifying inbound requests
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Inbound email address
BILL_PARSER_EMAIL=bills@cashflowforecaster.io
```

---

## File Structure

```
lib/email-parser/
├── extraction/
│   ├── types.ts                 # Extraction result types
│   ├── openai-extractor.ts      # OpenAI GPT-4 Vision implementation
│   └── parse-email-content.ts   # Email body parsing utilities
├── services/
│   ├── process-inbound.ts       # Main inbound email processor
│   ├── user-matcher.ts          # Match sender email to user
│   └── attachment-handler.ts    # Download and store attachments
└── index.ts                     # Public exports

lib/actions/
├── parsed-emails.ts             # CRUD for parsed emails
└── verify-email.ts              # Add verified sender emails

app/api/email/
├── inbound/route.ts             # Resend webhook endpoint
└── verify-sender/route.ts       # Email verification endpoint

app/dashboard/import-bills/
├── page.tsx                     # Review queue (main page)
├── history/page.tsx             # Import history
└── loading.tsx                  # Loading state

components/import-bills/
├── import-bills-content.tsx     # Main content wrapper
├── how-it-works-card.tsx        # Instructions for forwarding
├── parsed-email-card.tsx        # Individual import card
├── confirm-import-dialog.tsx    # Edit & confirm modal
├── add-sender-email.tsx         # Add verified email form
└── import-stats.tsx             # Summary statistics
```

---

## Inbound Email Webhook

### Webhook Handler (`app/api/email/inbound/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/admin';
import { processInboundEmail } from '@/lib/email-parser/services/process-inbound';
import { verifyResendWebhook } from '@/lib/email-parser/verify-webhook';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get('resend-signature');
    const body = await request.text();

    if (!verifyResendWebhook(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    // Only process email.received events
    if (payload.type !== 'email.received') {
      return NextResponse.json({ received: true });
    }

    const emailData = payload.data;

    // Process asynchronously - return 200 immediately
    // (Resend expects quick response)
    processInboundEmail(emailData).catch(console.error);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Inbound email webhook error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
```

### Email Processor (`lib/email-parser/services/process-inbound.ts`)

```typescript
import { createClient } from '@/lib/supabase/admin';
import { extractInvoiceFromEmail } from '../extraction/openai-extractor';
import { matchUserByEmail } from './user-matcher';
import { storeAttachments } from './attachment-handler';

interface ResendEmailPayload {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content_type: string;
    content: string; // base64
  }>;
  created_at: string;
}

export async function processInboundEmail(email: ResendEmailPayload) {
  const supabase = createClient();

  // Extract the forwarder's email (the "from" address)
  const forwardedBy = extractEmail(email.from);

  // Try to match to a user
  const user = await matchUserByEmail(forwardedBy);

  // Store the email record
  const { data: parsedEmail, error: insertError } = await supabase
    .from('parsed_emails')
    .insert({
      user_id: user?.id || null,
      message_id: email.id,
      from_email: extractOriginalSender(email.text || email.html || ''),
      forwarded_by: forwardedBy,
      subject: email.subject,
      body_text: email.text,
      body_html: email.html,
      received_at: email.created_at,
      status: user ? 'pending' : 'no_user',
      attachments: email.attachments?.map(a => ({
        filename: a.filename,
        content_type: a.content_type,
        size: a.content.length,
      })) || [],
    })
    .select()
    .single();

  if (insertError) {
    console.error('Failed to insert parsed email:', insertError);
    return;
  }

  // If no user found, we're done (they can claim later)
  if (!user) {
    console.log(`No user found for ${forwardedBy}`);
    return;
  }

  // Store attachments in Supabase Storage
  let attachmentUrls: string[] = [];
  if (email.attachments?.length) {
    attachmentUrls = await storeAttachments(
      user.id,
      parsedEmail.id,
      email.attachments
    );
  }

  // Extract invoice data with AI
  const extraction = await extractInvoiceFromEmail({
    subject: email.subject,
    bodyText: email.text,
    bodyHtml: email.html,
    attachments: email.attachments?.map((a, i) => ({
      filename: a.filename,
      contentType: a.content_type,
      content: Buffer.from(a.content, 'base64'),
      url: attachmentUrls[i],
    })),
  });

  // Update record with extraction results
  await supabase
    .from('parsed_emails')
    .update({
      extracted_vendor: extraction.vendor,
      extracted_amount: extraction.amount,
      extracted_currency: extraction.currency,
      extracted_due_date: extraction.dueDate,
      extracted_invoice_number: extraction.invoiceNumber,
      extracted_category: extraction.category,
      extraction_confidence: extraction.confidence.overall,
      field_confidences: extraction.confidence,
      raw_extraction: extraction.rawResponse,
      attachments: email.attachments?.map((a, i) => ({
        filename: a.filename,
        content_type: a.content_type,
        url: attachmentUrls[i],
      })),
      status: extraction.success ? 'pending' : 'failed',
      error_message: extraction.error,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsedEmail.id);

  // TODO: Send push notification or email to user about new import
}

function extractEmail(from: string): string {
  // "John Doe <john@example.com>" -> "john@example.com"
  const match = from.match(/<([^>]+)>/);
  return match ? match[1].toLowerCase() : from.toLowerCase();
}

function extractOriginalSender(content: string): string | null {
  // Try to find "From:" in forwarded email content
  // Common patterns: "From: vendor@company.com" or "---------- Forwarded message ----------"
  const patterns = [
    /From:\s*([^\n<]+<)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    /Original Message.*From:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/is,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[2] || match[1];
    }
  }

  return null;
}
```

### User Matcher (`lib/email-parser/services/user-matcher.ts`)

```typescript
import { createClient } from '@/lib/supabase/admin';

interface MatchedUser {
  id: string;
  email: string;
}

export async function matchUserByEmail(email: string): Promise<MatchedUser | null> {
  const supabase = createClient();
  const normalizedEmail = email.toLowerCase().trim();

  // First, check verified sender emails
  const { data: verified } = await supabase
    .from('user_verified_emails')
    .select('user_id')
    .eq('email', normalizedEmail)
    .single();

  if (verified) {
    const { data: user } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('id', verified.user_id)
      .single();

    return user;
  }

  // Fall back to auth email
  const { data: user } = await supabase
    .from('auth.users')
    .select('id, email')
    .eq('email', normalizedEmail)
    .single();

  return user;
}
```

---

## AI Invoice Extraction

### Extraction Types (`lib/email-parser/extraction/types.ts`)

```typescript
export interface ExtractedInvoice {
  vendor: string | null;
  amount: number | null;
  currency: string;
  dueDate: string | null;      // ISO date string
  invoiceNumber: string | null;
  invoiceDate: string | null;
  description: string | null;
  category: string | null;
}

export interface ExtractionResult {
  success: boolean;
  vendor: string | null;
  amount: number | null;
  currency: string;
  dueDate: string | null;
  invoiceNumber: string | null;
  category: string | null;
  confidence: {
    overall: number;
    vendor: number;
    amount: number;
    dueDate: number;
  };
  rawResponse: unknown;
  error?: string;
}

export interface EmailContent {
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  attachments?: Array<{
    filename: string;
    contentType: string;
    content: Buffer;
    url?: string;
  }>;
}
```

### OpenAI Extractor (`lib/email-parser/extraction/openai-extractor.ts`)

```typescript
import OpenAI from 'openai';
import type { ExtractionResult, EmailContent } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EXTRACTION_PROMPT = `You are an expert invoice and bill parser. Analyze the provided email content and/or attached invoice image to extract billing information.

Return a JSON object with these fields:
{
  "vendor": "Company or person name who issued the bill/invoice",
  "amount": 123.45,
  "currency": "USD",
  "dueDate": "2024-01-15",
  "invoiceNumber": "INV-12345",
  "category": "One of: utilities, software, contractor, office, marketing, insurance, rent, supplies, travel, subscriptions, other"
}

Rules:
- For amount, extract the TOTAL amount due (not subtotals)
- For currency, use ISO 4217 codes (USD, EUR, GBP, CAD, AUD, etc.)
- For dates, use ISO format (YYYY-MM-DD)
- If a field cannot be determined, use null
- Be precise with numbers - don't round
- For category, pick the most appropriate option

Return ONLY valid JSON, no additional text.`;

export async function extractInvoiceFromEmail(
  email: EmailContent
): Promise<ExtractionResult> {
  try {
    const messages: OpenAI.ChatCompletionMessageParam[] = [];

    // Build content array
    const content: OpenAI.ChatCompletionContentPart[] = [
      { type: 'text', text: EXTRACTION_PROMPT },
      { type: 'text', text: `\n\nEmail Subject: ${email.subject}` },
    ];

    // Add email body
    if (email.bodyText) {
      content.push({
        type: 'text',
        text: `\n\nEmail Body:\n${email.bodyText.slice(0, 5000)}`, // Limit size
      });
    }

    // Add image attachments for vision analysis
    const imageAttachments = email.attachments?.filter(a =>
      a.contentType.startsWith('image/') || a.contentType === 'application/pdf'
    ) || [];

    for (const attachment of imageAttachments.slice(0, 3)) { // Max 3 attachments
      if (attachment.contentType.startsWith('image/')) {
        const base64 = attachment.content.toString('base64');
        const dataUrl = `data:${attachment.contentType};base64,${base64}`;
        content.push({
          type: 'image_url',
          image_url: { url: dataUrl },
        });
      }
      // Note: For PDFs, you'd need to convert to images first or use a PDF parser
    }

    messages.push({ role: 'user', content });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.1,
    });

    const responseText = response.choices[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        vendor: null,
        amount: null,
        currency: 'USD',
        dueDate: null,
        invoiceNumber: null,
        category: null,
        confidence: { overall: 0, vendor: 0, amount: 0, dueDate: 0 },
        rawResponse: responseText,
        error: 'No JSON found in response',
      };
    }

    const extracted = JSON.parse(jsonMatch[0]);
    const confidence = calculateConfidence(extracted);

    return {
      success: true,
      vendor: extracted.vendor,
      amount: extracted.amount,
      currency: extracted.currency || 'USD',
      dueDate: extracted.dueDate,
      invoiceNumber: extracted.invoiceNumber,
      category: extracted.category,
      confidence,
      rawResponse: response,
    };
  } catch (error) {
    return {
      success: false,
      vendor: null,
      amount: null,
      currency: 'USD',
      dueDate: null,
      invoiceNumber: null,
      category: null,
      confidence: { overall: 0, vendor: 0, amount: 0, dueDate: 0 },
      rawResponse: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function calculateConfidence(data: any): ExtractionResult['confidence'] {
  const vendorConf = data.vendor ? 0.9 : 0;
  const amountConf = data.amount !== null ? 0.95 : 0;
  const dueDateConf = data.dueDate ? 0.85 : 0;

  const overall = (vendorConf * 0.3 + amountConf * 0.5 + dueDateConf * 0.2);

  return {
    overall: Math.round(overall * 100) / 100,
    vendor: vendorConf,
    amount: amountConf,
    dueDate: dueDateConf,
  };
}
```

---

## Server Actions

### Parsed Emails Actions (`lib/actions/parsed-emails.ts`)

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { createBill } from './bills';

export async function getPendingImports() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('parsed_emails')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .order('received_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getImportHistory(limit = 50) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('parsed_emails')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['confirmed', 'rejected'])
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function confirmImport(
  parsedEmailId: string,
  overrides?: {
    name?: string;
    amount?: number;
    due_date?: string;
    category?: string;
    frequency?: string;
  }
) {
  const user = await requireAuth();
  const supabase = await createClient();

  // Get the parsed email
  const { data: parsedEmail, error: fetchError } = await supabase
    .from('parsed_emails')
    .select('*')
    .eq('id', parsedEmailId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !parsedEmail) {
    throw new Error('Import not found');
  }

  // Create the bill
  const billData = {
    name: overrides?.name || parsedEmail.extracted_vendor || 'Unknown Vendor',
    amount: overrides?.amount ?? parsedEmail.extracted_amount ?? 0,
    due_date: overrides?.due_date || parsedEmail.extracted_due_date,
    category: overrides?.category || parsedEmail.extracted_category || 'other',
    frequency: overrides?.frequency || 'one-time',
    notes: `Imported from email: ${parsedEmail.subject}`,
  };

  const bill = await createBill(billData);

  // Update parsed email status
  await supabase
    .from('parsed_emails')
    .update({
      status: 'confirmed',
      confirmed_bill_id: bill.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsedEmailId);

  revalidatePath('/dashboard/import-bills');
  revalidatePath('/dashboard/bills');

  return { success: true, billId: bill.id };
}

export async function rejectImport(parsedEmailId: string, reason?: string) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from('parsed_emails')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsedEmailId)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard/import-bills');
  return { success: true };
}

export async function getPendingCount() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('parsed_emails')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'pending');

  if (error) return 0;
  return count || 0;
}
```

### Verified Emails Actions (`lib/actions/verify-email.ts`)

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function getVerifiedEmails() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_verified_emails')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addVerifiedEmail(email: string) {
  const user = await requireAuth();
  const supabase = await createClient();

  const normalizedEmail = email.toLowerCase().trim();

  // Check if already verified by another user
  const { data: existing } = await supabase
    .from('user_verified_emails')
    .select('user_id')
    .eq('email', normalizedEmail)
    .single();

  if (existing) {
    if (existing.user_id === user.id) {
      throw new Error('Email already verified');
    }
    throw new Error('Email is associated with another account');
  }

  const { error } = await supabase
    .from('user_verified_emails')
    .insert({
      user_id: user.id,
      email: normalizedEmail,
    });

  if (error) throw error;

  // Claim any pending emails from this address
  await supabase
    .from('parsed_emails')
    .update({ user_id: user.id, status: 'pending' })
    .eq('forwarded_by', normalizedEmail)
    .eq('status', 'no_user');

  revalidatePath('/dashboard/import-bills');
  return { success: true };
}

export async function removeVerifiedEmail(emailId: string) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_verified_emails')
    .delete()
    .eq('id', emailId)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard/import-bills');
  return { success: true };
}
```

---

## UI Components

### How It Works Card (`components/import-bills/how-it-works-card.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Mail } from 'lucide-react';

const PARSER_EMAIL = 'bills@cashflowforecaster.io';

export function HowItWorksCard() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(PARSER_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Import Bills via Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Forward any bill or invoice email to our parser and we'll extract the details automatically.
        </p>

        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <code className="flex-1 text-sm font-mono">{PARSER_EMAIL}</code>
          <Button variant="ghost" size="sm" onClick={copyEmail}>
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Forward a bill email to the address above</li>
            <li>We extract vendor, amount, and due date</li>
            <li>Review and confirm the details here</li>
            <li>Bill is added to your calendar</li>
          </ol>
        </div>

        <p className="text-xs text-muted-foreground">
          Privacy: We only see emails you explicitly forward. We never access your inbox.
        </p>
      </CardContent>
    </Card>
  );
}
```

### Import Bills Page (`app/dashboard/import-bills/page.tsx`)

```typescript
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth/session';
import { canUseEmailParser } from '@/lib/stripe/feature-gate';
import { getPendingImports } from '@/lib/actions/parsed-emails';
import { UpgradePrompt } from '@/components/subscription/upgrade-prompt';
import { HowItWorksCard } from '@/components/import-bills/how-it-works-card';
import { ImportBillsContent } from '@/components/import-bills/import-bills-content';

export default async function ImportBillsPage() {
  const user = await requireAuth();
  const gateResult = await canUseEmailParser(user.id);

  if (!gateResult.allowed) {
    return <UpgradePrompt feature="email_parser" />;
  }

  const pendingImports = await getPendingImports();

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Import Bills</h1>
          <p className="text-muted-foreground">
            Review bills extracted from forwarded emails
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ImportBillsContent imports={pendingImports} />
        </div>
        <div>
          <HowItWorksCard />
        </div>
      </div>
    </div>
  );
}
```

---

## Pro Feature Gating

### Update `lib/stripe/config.ts`

```typescript
limits: {
  // existing limits...
  emailParserEnabled: boolean;
}

// Free tier
emailParserEnabled: false,

// Pro tier
emailParserEnabled: true,
```

### Add to `lib/stripe/feature-gate.ts`

```typescript
export async function canUseEmailParser(userId: string): Promise<FeatureGateResult> {
  const tier = await getUserTier(userId);
  const limits = PRICING_TIERS[tier].limits;

  if (!limits.emailParserEnabled) {
    return { allowed: false, reason: 'feature_disabled', tier };
  }

  return { allowed: true, tier };
}
```

### Update `components/subscription/upgrade-prompt.tsx`

Add copy for email_parser feature:

```typescript
email_parser: {
  title: "Email Bill Import is a Pro feature",
  description: "Forward bills to our email parser for automatic extraction. Review and confirm with one click.",
},
```

---

## Required Dependencies

```json
{
  "dependencies": {
    "openai": "^4.28.0"
  }
}
```

**Note:** No new email-related dependencies needed - Resend handles inbound via webhooks.

**Environment Variables to Add:**

```env
# Resend webhook secret (for verifying inbound emails)
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# OpenAI for invoice extraction
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# Parser email address (for display in UI)
BILL_PARSER_EMAIL=bills@cashflowforecaster.io
```

---

## Implementation Sequence

### Phase 1: Database (2 migrations)
1. Create `parsed_emails` table with RLS
2. Create `user_verified_emails` table with RLS

### Phase 2: Resend Configuration (manual)
3. Add MX record for inbound emails
4. Configure webhook in Resend dashboard

### Phase 3: Inbound Processing (4 files)
5. Create `lib/email-parser/extraction/types.ts`
6. Create `lib/email-parser/extraction/openai-extractor.ts`
7. Create `lib/email-parser/services/user-matcher.ts`
8. Create `lib/email-parser/services/process-inbound.ts`

### Phase 4: Webhook Endpoint (1 file)
9. Create `app/api/email/inbound/route.ts`

### Phase 5: Server Actions (2 files)
10. Create `lib/actions/parsed-emails.ts`
11. Create `lib/actions/verify-email.ts`

### Phase 6: Feature Gating (2 files)
12. Update `lib/stripe/config.ts`
13. Update `lib/stripe/feature-gate.ts`

### Phase 7: UI Pages (3 files)
14. Create `app/dashboard/import-bills/page.tsx`
15. Create `app/dashboard/import-bills/history/page.tsx`
16. Create `app/dashboard/import-bills/loading.tsx`

### Phase 8: UI Components (5 files)
17. Create `components/import-bills/import-bills-content.tsx`
18. Create `components/import-bills/how-it-works-card.tsx`
19. Create `components/import-bills/parsed-email-card.tsx`
20. Create `components/import-bills/confirm-import-dialog.tsx`
21. Create `components/import-bills/add-sender-email.tsx`

### Phase 9: Navigation (2 files)
22. Update `components/dashboard/nav.tsx`
23. Update `components/subscription/upgrade-prompt.tsx`

**Total: ~23 files to create/modify** (down from 33 with OAuth approach)

---

## Security Considerations

1. **Webhook Verification**: Always verify Resend webhook signatures
2. **User Matching**: Only process emails from verified sender addresses
3. **Attachment Storage**: Store in Supabase Storage with RLS policies
4. **Rate Limiting**: Limit processing to prevent abuse
5. **Content Sanitization**: Sanitize email content before storing
6. **No Inbox Access**: System never has access to user's email inbox

---

## Verification Checklist

- [ ] MX record configured for bills@cashflowforecaster.io
- [ ] Resend webhook receives forwarded emails
- [ ] User matching works by sender email
- [ ] AI extraction returns structured data
- [ ] Pending imports appear in review queue
- [ ] Quick confirm creates bill correctly
- [ ] Edit dialog allows field modifications
- [ ] Reject removes from queue
- [ ] Duplicate detection (by message_id) works
- [ ] Free users see upgrade prompt
- [ ] Pro users can use email parser
- [ ] Navigation shows Import Bills link
- [ ] How-it-works card displays correctly

---

## Future Enhancements (Not in MVP)

1. **Vendor Recognition**: Learn from confirmed imports to auto-categorize
2. **Recurring Detection**: Identify recurring bills from same vendor
3. **PDF Parsing**: Convert PDF attachments to images for better extraction
4. **Email Templates**: Detect common invoice email formats (PayPal, Stripe, etc.)
5. **Bulk Confirm**: Select multiple and confirm at once
6. **Mobile App**: Forward-to-email works great with mobile mail apps
7. **Slack/Discord Integration**: Forward bills via chat apps
8. **Auto-confirm**: Optionally auto-confirm high-confidence extractions from known vendors

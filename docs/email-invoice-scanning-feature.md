# Email Invoice Scanning Feature - Implementation Plan

## Overview

Enable users to connect their email accounts (Gmail, Outlook) and automatically scan incoming emails for invoices and bills. The app extracts invoice data using AI, presents it for user review, and allows one-click import into the bills system.

**Problem it solves:** Freelancers receive bills via email from various vendors (utilities, software subscriptions, contractors). Manually entering each bill is tedious and error-prone. This feature automates bill capture while keeping the user in control through a confirmation workflow.

**Target Users:** Pro subscribers

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. CONNECT EMAIL                                                        │
│  ┌──────────────────┐    ┌──────────────────┐                           │
│  │   Connect Gmail  │    │  Connect Outlook │                           │
│  │   (OAuth 2.0)    │    │  (OAuth 2.0)     │                           │
│  └────────┬─────────┘    └────────┬─────────┘                           │
│           └──────────┬───────────┘                                      │
│                      ▼                                                   │
│  2. SCAN EMAILS (Manual trigger or scheduled)                           │
│  ┌──────────────────────────────────────────┐                           │
│  │  Fetch unread emails with attachments    │                           │
│  │  Filter: PDF, images, invoice keywords   │                           │
│  └────────────────────┬─────────────────────┘                           │
│                       ▼                                                  │
│  3. AI EXTRACTION                                                        │
│  ┌──────────────────────────────────────────┐                           │
│  │  OpenAI GPT-4 Vision / Google Doc AI     │                           │
│  │  Extract: vendor, amount, due date, etc  │                           │
│  │  Confidence score per field              │                           │
│  └────────────────────┬─────────────────────┘                           │
│                       ▼                                                  │
│  4. REVIEW QUEUE                                                         │
│  ┌──────────────────────────────────────────┐                           │
│  │  User sees extracted bills in table      │                           │
│  │  Can edit any field before confirming    │                           │
│  │  Actions: Confirm | Edit | Reject        │                           │
│  └────────────────────┬─────────────────────┘                           │
│                       ▼                                                  │
│  5. IMPORT TO BILLS                                                      │
│  ┌──────────────────────────────────────────┐                           │
│  │  Confirmed items → bills table           │                           │
│  │  Appears on calendar & forecasts         │                           │
│  └──────────────────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## UI Location

**New dedicated page:** `/dashboard/import-bills`

- Located in navigation after "Bills"
- Sub-pages:
  - `/dashboard/import-bills` - Review queue (pending imports)
  - `/dashboard/import-bills/connect` - Email connection management
  - `/dashboard/import-bills/history` - Import history

**Navigation Label:** "Import Bills" with badge showing pending count

---

## Database Changes

### 1. New Table: `email_connections`

Stores OAuth tokens for connected email providers.

**Migration:** `supabase/migrations/[timestamp]_add_email_connections.sql`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| provider | VARCHAR(20) | 'gmail' or 'outlook' |
| email_address | VARCHAR(255) | Connected email address |
| access_token | TEXT | Encrypted OAuth access token |
| refresh_token | TEXT | Encrypted OAuth refresh token |
| token_expires_at | TIMESTAMPTZ | Token expiration time |
| scopes | TEXT[] | Granted OAuth scopes |
| last_sync_at | TIMESTAMPTZ | Last successful email scan |
| sync_from_date | DATE | Only scan emails after this date |
| is_active | BOOLEAN | Connection enabled/disabled |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Updated timestamp |

```sql
CREATE TABLE email_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL CHECK (provider IN ('gmail', 'outlook')),
  email_address VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  sync_from_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider, email_address)
);

-- RLS policies
ALTER TABLE email_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email connections"
  ON email_connections FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email connections"
  ON email_connections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email connections"
  ON email_connections FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own email connections"
  ON email_connections FOR DELETE USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_email_connections_user_provider
  ON email_connections(user_id, provider);
```

### 2. New Table: `pending_bill_imports`

Staging table for extracted bills awaiting user confirmation.

**Migration:** `supabase/migrations/[timestamp]_add_pending_bill_imports.sql`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| email_connection_id | UUID | Source email connection |
| email_id | VARCHAR(255) | Provider's email message ID |
| email_subject | VARCHAR(500) | Email subject line |
| email_from | VARCHAR(255) | Sender email address |
| email_date | TIMESTAMPTZ | Email received date |
| attachment_name | VARCHAR(255) | Invoice file name |
| attachment_type | VARCHAR(50) | MIME type (application/pdf, image/png) |
| attachment_url | TEXT | Supabase storage URL |
| extracted_vendor | VARCHAR(255) | AI-extracted vendor name |
| extracted_amount | DECIMAL(12,2) | AI-extracted amount |
| extracted_currency | VARCHAR(3) | AI-extracted currency (USD, EUR, etc) |
| extracted_due_date | DATE | AI-extracted due date |
| extracted_invoice_number | VARCHAR(100) | AI-extracted invoice number |
| extracted_category | VARCHAR(50) | AI-suggested category |
| extraction_confidence | DECIMAL(3,2) | Overall confidence (0.00-1.00) |
| field_confidences | JSONB | Per-field confidence scores |
| raw_extraction | JSONB | Full AI response for debugging |
| status | VARCHAR(20) | pending, confirmed, rejected, duplicate |
| confirmed_bill_id | UUID | Link to created bill (after confirm) |
| rejection_reason | VARCHAR(255) | Why user rejected (optional) |
| created_at | TIMESTAMPTZ | When imported |
| updated_at | TIMESTAMPTZ | Last modified |

```sql
CREATE TABLE pending_bill_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_connection_id UUID NOT NULL REFERENCES email_connections(id) ON DELETE CASCADE,
  email_id VARCHAR(255) NOT NULL,
  email_subject VARCHAR(500),
  email_from VARCHAR(255),
  email_date TIMESTAMPTZ,
  attachment_name VARCHAR(255),
  attachment_type VARCHAR(50),
  attachment_url TEXT,
  extracted_vendor VARCHAR(255),
  extracted_amount DECIMAL(12, 2),
  extracted_currency VARCHAR(3) DEFAULT 'USD',
  extracted_due_date DATE,
  extracted_invoice_number VARCHAR(100),
  extracted_category VARCHAR(50),
  extraction_confidence DECIMAL(3, 2),
  field_confidences JSONB DEFAULT '{}',
  raw_extraction JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'rejected', 'duplicate')),
  confirmed_bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
  rejection_reason VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email_id)
);

-- RLS policies
ALTER TABLE pending_bill_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pending imports"
  ON pending_bill_imports FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pending imports"
  ON pending_bill_imports FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending imports"
  ON pending_bill_imports FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending imports"
  ON pending_bill_imports FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_pending_imports_user_status
  ON pending_bill_imports(user_id, status);
CREATE INDEX idx_pending_imports_email_id
  ON pending_bill_imports(email_id);
```

### 3. New Table: `email_scan_logs`

Audit trail for email scanning operations.

```sql
CREATE TABLE email_scan_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_connection_id UUID NOT NULL REFERENCES email_connections(id) ON DELETE CASCADE,
  scan_started_at TIMESTAMPTZ NOT NULL,
  scan_completed_at TIMESTAMPTZ,
  emails_scanned INT DEFAULT 0,
  invoices_found INT DEFAULT 0,
  errors JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'running'
    CHECK (status IN ('running', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE email_scan_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scan logs"
  ON email_scan_logs FOR SELECT USING (auth.uid() = user_id);
```

---

## OAuth Integration

### Gmail (Google)

**Prerequisites:**
1. Google Cloud Console project
2. Enable Gmail API
3. OAuth 2.0 credentials (Web application)
4. Authorized redirect URI: `https://cashflowforecaster.io/api/auth/callback/google`

**Required Scopes:**
```
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/userinfo.email
```

**Environment Variables:**
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://cashflowforecaster.io/api/auth/callback/google
```

### Outlook (Microsoft)

**Prerequisites:**
1. Azure AD app registration
2. Microsoft Graph API permissions
3. OAuth 2.0 credentials
4. Redirect URI: `https://cashflowforecaster.io/api/auth/callback/microsoft`

**Required Permissions (Delegated):**
```
Mail.Read
User.Read
offline_access
```

**Environment Variables:**
```env
MICROSOFT_CLIENT_ID=your-azure-app-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_TENANT_ID=common
MICROSOFT_REDIRECT_URI=https://cashflowforecaster.io/api/auth/callback/microsoft
```

---

## File Structure

```
lib/email-import/
├── providers/
│   ├── types.ts                 # Shared types for all providers
│   ├── base-provider.ts         # Abstract base class
│   ├── gmail-provider.ts        # Gmail implementation
│   └── outlook-provider.ts      # Outlook implementation
├── extraction/
│   ├── invoice-extractor.ts     # AI extraction orchestration
│   ├── openai-extractor.ts      # OpenAI GPT-4 Vision implementation
│   └── extraction-types.ts      # Extraction result types
├── services/
│   ├── email-scanner.ts         # Main scanning service
│   ├── token-manager.ts         # OAuth token refresh logic
│   └── duplicate-detector.ts    # Prevent duplicate imports
└── index.ts                     # Public exports

lib/actions/
├── email-connections.ts         # CRUD for email connections
├── pending-imports.ts           # CRUD for pending imports
└── scan-emails.ts               # Trigger email scanning

app/api/
├── auth/callback/
│   ├── google/route.ts          # Gmail OAuth callback
│   └── microsoft/route.ts       # Outlook OAuth callback
├── email-import/
│   ├── scan/route.ts            # Trigger scan endpoint
│   └── webhook/route.ts         # Gmail push notifications (future)
└── cron/
    └── email-scan/route.ts      # Scheduled scanning (optional)

app/dashboard/import-bills/
├── page.tsx                     # Review queue (main page)
├── connect/page.tsx             # Email connection management
├── history/page.tsx             # Import history
└── loading.tsx                  # Loading state

components/import-bills/
├── import-bills-content.tsx     # Main content wrapper
├── pending-import-card.tsx      # Individual import card
├── pending-import-table.tsx     # Table view of imports
├── confirm-import-dialog.tsx    # Edit & confirm modal
├── email-connection-card.tsx    # Connected account card
├── connect-email-button.tsx     # OAuth trigger button
├── scan-progress.tsx            # Scanning progress indicator
└── import-stats.tsx             # Summary statistics
```

---

## Provider Abstraction Layer

### Base Types (`lib/email-import/providers/types.ts`)

```typescript
export interface EmailMessage {
  id: string;
  subject: string;
  from: string;
  date: Date;
  snippet: string;
  hasAttachments: boolean;
}

export interface EmailAttachment {
  id: string;
  messageId: string;
  filename: string;
  mimeType: string;
  size: number;
  data?: Buffer;
}

export interface EmailProvider {
  name: 'gmail' | 'outlook';

  // OAuth
  getAuthUrl(state: string): string;
  exchangeCodeForTokens(code: string): Promise<OAuthTokens>;
  refreshAccessToken(refreshToken: string): Promise<OAuthTokens>;

  // Email operations
  listMessages(options: ListMessagesOptions): Promise<EmailMessage[]>;
  getMessage(messageId: string): Promise<EmailMessage>;
  getAttachment(messageId: string, attachmentId: string): Promise<EmailAttachment>;
  markAsProcessed(messageId: string): Promise<void>;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scopes: string[];
}

export interface ListMessagesOptions {
  after?: Date;
  maxResults?: number;
  query?: string;
  hasAttachment?: boolean;
}
```

### Gmail Provider (`lib/email-import/providers/gmail-provider.ts`)

```typescript
import { google } from 'googleapis';
import type { EmailProvider, EmailMessage, OAuthTokens } from './types';

export class GmailProvider implements EmailProvider {
  name = 'gmail' as const;

  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  getAuthUrl(state: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      state,
      prompt: 'consent', // Force refresh token
    });
  }

  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiresAt: new Date(tokens.expiry_date!),
      scopes: tokens.scope?.split(' ') || [],
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await this.oauth2Client.refreshAccessToken();
    return {
      accessToken: credentials.access_token!,
      refreshToken: credentials.refresh_token || refreshToken,
      expiresAt: new Date(credentials.expiry_date!),
      scopes: credentials.scope?.split(' ') || [],
    };
  }

  async listMessages(options: ListMessagesOptions): Promise<EmailMessage[]> {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    // Build search query for invoice-like emails
    let query = 'has:attachment';
    if (options.after) {
      query += ` after:${Math.floor(options.after.getTime() / 1000)}`;
    }
    // Look for invoice-related keywords
    query += ' (invoice OR bill OR receipt OR statement OR payment due)';

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: options.maxResults || 50,
    });

    const messages: EmailMessage[] = [];
    for (const msg of response.data.messages || []) {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id!,
      });

      const headers = full.data.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

      messages.push({
        id: msg.id!,
        subject: getHeader('subject'),
        from: getHeader('from'),
        date: new Date(parseInt(full.data.internalDate || '0')),
        snippet: full.data.snippet || '',
        hasAttachments: (full.data.payload?.parts?.length || 0) > 0,
      });
    }

    return messages;
  }

  async getAttachment(messageId: string, attachmentId: string): Promise<EmailAttachment> {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const attachment = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId,
      id: attachmentId,
    });

    return {
      id: attachmentId,
      messageId,
      filename: '', // Retrieved from message parts
      mimeType: '', // Retrieved from message parts
      size: attachment.data.size || 0,
      data: Buffer.from(attachment.data.data || '', 'base64'),
    };
  }

  setCredentials(tokens: OAuthTokens): void {
    this.oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    });
  }
}
```

### Outlook Provider (`lib/email-import/providers/outlook-provider.ts`)

```typescript
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication } from '@azure/msal-node';
import type { EmailProvider, EmailMessage, OAuthTokens } from './types';

export class OutlookProvider implements EmailProvider {
  name = 'outlook' as const;

  private msalClient = new ConfidentialClientApplication({
    auth: {
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
    },
  });

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      response_type: 'code',
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI!,
      scope: 'Mail.Read User.Read offline_access',
      state,
      prompt: 'consent',
    });

    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
  }

  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    const result = await this.msalClient.acquireTokenByCode({
      code,
      redirectUri: process.env.MICROSOFT_REDIRECT_URI!,
      scopes: ['Mail.Read', 'User.Read', 'offline_access'],
    });

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken || '', // Store securely
      expiresAt: result.expiresOn!,
      scopes: result.scopes,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const result = await this.msalClient.acquireTokenByRefreshToken({
      refreshToken,
      scopes: ['Mail.Read', 'User.Read', 'offline_access'],
    });

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken || refreshToken,
      expiresAt: result.expiresOn!,
      scopes: result.scopes,
    };
  }

  async listMessages(options: ListMessagesOptions): Promise<EmailMessage[]> {
    const client = Client.init({
      authProvider: (done) => done(null, this.accessToken),
    });

    // Build filter for invoice-like emails with attachments
    let filter = 'hasAttachments eq true';
    if (options.after) {
      filter += ` and receivedDateTime ge ${options.after.toISOString()}`;
    }

    const response = await client
      .api('/me/messages')
      .filter(filter)
      .search('invoice OR bill OR receipt OR statement OR "payment due"')
      .top(options.maxResults || 50)
      .select('id,subject,from,receivedDateTime,bodyPreview,hasAttachments')
      .get();

    return response.value.map((msg: any) => ({
      id: msg.id,
      subject: msg.subject || '',
      from: msg.from?.emailAddress?.address || '',
      date: new Date(msg.receivedDateTime),
      snippet: msg.bodyPreview || '',
      hasAttachments: msg.hasAttachments,
    }));
  }

  async getAttachment(messageId: string, attachmentId: string): Promise<EmailAttachment> {
    const client = Client.init({
      authProvider: (done) => done(null, this.accessToken),
    });

    const attachment = await client
      .api(`/me/messages/${messageId}/attachments/${attachmentId}`)
      .get();

    return {
      id: attachmentId,
      messageId,
      filename: attachment.name,
      mimeType: attachment.contentType,
      size: attachment.size,
      data: Buffer.from(attachment.contentBytes, 'base64'),
    };
  }

  private accessToken: string = '';

  setCredentials(tokens: OAuthTokens): void {
    this.accessToken = tokens.accessToken;
  }
}
```

### Provider Factory (`lib/email-import/providers/index.ts`)

```typescript
import { GmailProvider } from './gmail-provider';
import { OutlookProvider } from './outlook-provider';
import type { EmailProvider } from './types';

export function getEmailProvider(provider: 'gmail' | 'outlook'): EmailProvider {
  switch (provider) {
    case 'gmail':
      return new GmailProvider();
    case 'outlook':
      return new OutlookProvider();
    default:
      throw new Error(`Unknown email provider: ${provider}`);
  }
}

export * from './types';
export { GmailProvider } from './gmail-provider';
export { OutlookProvider } from './outlook-provider';
```

---

## AI Invoice Extraction

### Extraction Types (`lib/email-import/extraction/extraction-types.ts`)

```typescript
export interface ExtractedInvoice {
  vendor: string | null;
  amount: number | null;
  currency: string;
  dueDate: string | null;      // ISO date string
  invoiceNumber: string | null;
  invoiceDate: string | null;
  description: string | null;
  suggestedCategory: string | null;
  lineItems: LineItem[];
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ExtractionResult {
  success: boolean;
  data: ExtractedInvoice | null;
  confidence: {
    overall: number;
    vendor: number;
    amount: number;
    dueDate: number;
  };
  rawResponse: unknown;
  error?: string;
}

export interface ExtractorOptions {
  maxRetries?: number;
  language?: string;
}
```

### OpenAI Extractor (`lib/email-import/extraction/openai-extractor.ts`)

```typescript
import OpenAI from 'openai';
import type { ExtractionResult, ExtractedInvoice } from './extraction-types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EXTRACTION_PROMPT = `You are an expert invoice parser. Analyze the provided invoice image or PDF and extract the following information in JSON format:

{
  "vendor": "Company or person name who issued the invoice",
  "amount": 123.45,
  "currency": "USD",
  "dueDate": "2024-01-15",
  "invoiceNumber": "INV-12345",
  "invoiceDate": "2024-01-01",
  "description": "Brief description of what this invoice is for",
  "suggestedCategory": "One of: utilities, software, contractor, office, marketing, insurance, rent, supplies, travel, other",
  "lineItems": [
    {
      "description": "Item description",
      "quantity": 1,
      "unitPrice": 100.00,
      "total": 100.00
    }
  ]
}

Rules:
- For amount, extract the TOTAL amount due (not subtotals)
- For currency, use ISO 4217 codes (USD, EUR, GBP, etc.)
- For dates, use ISO format (YYYY-MM-DD)
- If a field cannot be determined, use null
- Be precise with numbers - don't round

Return ONLY valid JSON, no additional text.`;

export async function extractInvoiceWithOpenAI(
  fileBuffer: Buffer,
  mimeType: string
): Promise<ExtractionResult> {
  try {
    const base64 = fileBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // GPT-4 with vision
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: EXTRACTION_PROMPT },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.1, // Low temperature for consistent extraction
    });

    const content = response.choices[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        data: null,
        confidence: { overall: 0, vendor: 0, amount: 0, dueDate: 0 },
        rawResponse: content,
        error: 'No JSON found in response',
      };
    }

    const extracted: ExtractedInvoice = JSON.parse(jsonMatch[0]);

    // Calculate confidence scores based on field completeness
    const confidence = calculateConfidence(extracted);

    return {
      success: true,
      data: extracted,
      confidence,
      rawResponse: response,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      confidence: { overall: 0, vendor: 0, amount: 0, dueDate: 0 },
      rawResponse: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function calculateConfidence(data: ExtractedInvoice): ExtractionResult['confidence'] {
  const vendorConf = data.vendor ? 0.9 : 0;
  const amountConf = data.amount !== null ? 0.95 : 0;
  const dueDateConf = data.dueDate ? 0.85 : 0;

  // Overall confidence is weighted average
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

## Email Scanning Service

### Main Scanner (`lib/email-import/services/email-scanner.ts`)

```typescript
import { createClient } from '@/lib/supabase/server';
import { getEmailProvider } from '../providers';
import { extractInvoiceWithOpenAI } from '../extraction/openai-extractor';
import type { EmailConnection, PendingBillImport } from '../types';

interface ScanResult {
  scanned: number;
  imported: number;
  errors: string[];
}

export async function scanEmailsForInvoices(
  connectionId: string
): Promise<ScanResult> {
  const supabase = await createClient();
  const result: ScanResult = { scanned: 0, imported: 0, errors: [] };

  // Get connection details
  const { data: connection } = await supabase
    .from('email_connections')
    .select('*')
    .eq('id', connectionId)
    .single();

  if (!connection) {
    throw new Error('Email connection not found');
  }

  // Initialize provider with credentials
  const provider = getEmailProvider(connection.provider);

  // Refresh token if needed
  const tokens = await ensureValidToken(connection, provider);
  provider.setCredentials(tokens);

  // Fetch messages since last sync
  const messages = await provider.listMessages({
    after: connection.last_sync_at
      ? new Date(connection.last_sync_at)
      : new Date(connection.sync_from_date),
    maxResults: 50,
  });

  result.scanned = messages.length;

  // Process each message
  for (const message of messages) {
    try {
      // Check for duplicate
      const { data: existing } = await supabase
        .from('pending_bill_imports')
        .select('id')
        .eq('email_id', message.id)
        .eq('user_id', connection.user_id)
        .single();

      if (existing) {
        continue; // Skip duplicate
      }

      // Get attachments (PDFs and images)
      const attachments = await getInvoiceAttachments(provider, message.id);

      for (const attachment of attachments) {
        // Extract invoice data with AI
        const extraction = await extractInvoiceWithOpenAI(
          attachment.data!,
          attachment.mimeType
        );

        if (extraction.success && extraction.data) {
          // Store in Supabase Storage
          const storagePath = `imports/${connection.user_id}/${message.id}/${attachment.filename}`;
          await supabase.storage
            .from('invoice-attachments')
            .upload(storagePath, attachment.data!, {
              contentType: attachment.mimeType,
            });

          const { data: urlData } = supabase.storage
            .from('invoice-attachments')
            .getPublicUrl(storagePath);

          // Insert pending import
          await supabase.from('pending_bill_imports').insert({
            user_id: connection.user_id,
            email_connection_id: connectionId,
            email_id: message.id,
            email_subject: message.subject,
            email_from: message.from,
            email_date: message.date.toISOString(),
            attachment_name: attachment.filename,
            attachment_type: attachment.mimeType,
            attachment_url: urlData.publicUrl,
            extracted_vendor: extraction.data.vendor,
            extracted_amount: extraction.data.amount,
            extracted_currency: extraction.data.currency,
            extracted_due_date: extraction.data.dueDate,
            extracted_invoice_number: extraction.data.invoiceNumber,
            extracted_category: extraction.data.suggestedCategory,
            extraction_confidence: extraction.confidence.overall,
            field_confidences: extraction.confidence,
            raw_extraction: extraction.rawResponse,
            status: 'pending',
          });

          result.imported++;
        }
      }
    } catch (error) {
      result.errors.push(`Error processing ${message.id}: ${error}`);
    }
  }

  // Update last sync timestamp
  await supabase
    .from('email_connections')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', connectionId);

  return result;
}

async function getInvoiceAttachments(provider: any, messageId: string) {
  // Implementation to get PDF/image attachments
  // Filter by MIME types: application/pdf, image/png, image/jpeg
}

async function ensureValidToken(connection: EmailConnection, provider: any) {
  if (new Date(connection.token_expires_at) > new Date()) {
    return {
      accessToken: connection.access_token,
      refreshToken: connection.refresh_token,
      expiresAt: new Date(connection.token_expires_at),
      scopes: connection.scopes,
    };
  }

  // Refresh the token
  const newTokens = await provider.refreshAccessToken(connection.refresh_token);

  // Update in database
  const supabase = await createClient();
  await supabase
    .from('email_connections')
    .update({
      access_token: newTokens.accessToken,
      refresh_token: newTokens.refreshToken,
      token_expires_at: newTokens.expiresAt.toISOString(),
    })
    .eq('id', connection.id);

  return newTokens;
}
```

---

## Server Actions

### Email Connections (`lib/actions/email-connections.ts`)

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function getEmailConnections() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('email_connections')
    .select('id, provider, email_address, is_active, last_sync_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function disconnectEmail(connectionId: string) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from('email_connections')
    .delete()
    .eq('id', connectionId)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard/import-bills');
  return { success: true };
}

export async function toggleEmailConnection(connectionId: string, isActive: boolean) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from('email_connections')
    .update({ is_active: isActive })
    .eq('id', connectionId)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard/import-bills');
  return { success: true };
}
```

### Pending Imports (`lib/actions/pending-imports.ts`)

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
    .from('pending_bill_imports')
    .select(`
      *,
      email_connections (provider, email_address)
    `)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function confirmImport(
  importId: string,
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

  // Get the pending import
  const { data: pendingImport, error: fetchError } = await supabase
    .from('pending_bill_imports')
    .select('*')
    .eq('id', importId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !pendingImport) {
    throw new Error('Import not found');
  }

  // Create the bill
  const billData = {
    name: overrides?.name || pendingImport.extracted_vendor || 'Unknown Vendor',
    amount: overrides?.amount || pendingImport.extracted_amount || 0,
    due_date: overrides?.due_date || pendingImport.extracted_due_date,
    category: overrides?.category || pendingImport.extracted_category || 'other',
    frequency: overrides?.frequency || 'one-time',
    notes: `Imported from email: ${pendingImport.email_subject}`,
  };

  const bill = await createBill(billData);

  // Update pending import status
  await supabase
    .from('pending_bill_imports')
    .update({
      status: 'confirmed',
      confirmed_bill_id: bill.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', importId);

  revalidatePath('/dashboard/import-bills');
  revalidatePath('/dashboard/bills');

  return { success: true, billId: bill.id };
}

export async function rejectImport(importId: string, reason?: string) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from('pending_bill_imports')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', importId)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard/import-bills');
  return { success: true };
}

export async function bulkConfirmImports(importIds: string[]) {
  const results = await Promise.allSettled(
    importIds.map(id => confirmImport(id))
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return { successful, failed };
}
```

---

## API Routes

### OAuth Callbacks

**Gmail (`app/api/auth/callback/google/route.ts`):**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GmailProvider } from '@/lib/email-import/providers/gmail-provider';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL('/dashboard/import-bills/connect?error=access_denied', request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/dashboard/import-bills/connect?error=missing_params', request.url)
    );
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Validate state (should match stored CSRF token)
    // ... state validation logic ...

    const provider = new GmailProvider();
    const tokens = await provider.exchangeCodeForTokens(code);

    // Get user's email address
    provider.setCredentials(tokens);
    const emailAddress = await provider.getUserEmail();

    // Store connection
    const supabase = await createClient();
    await supabase.from('email_connections').upsert({
      user_id: user.id,
      provider: 'gmail',
      email_address: emailAddress,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      token_expires_at: tokens.expiresAt.toISOString(),
      scopes: tokens.scopes,
      is_active: true,
    }, {
      onConflict: 'user_id,provider,email_address',
    });

    return NextResponse.redirect(
      new URL('/dashboard/import-bills/connect?success=true', request.url)
    );
  } catch (error) {
    console.error('Gmail OAuth error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/import-bills/connect?error=oauth_failed', request.url)
    );
  }
}
```

**Outlook (`app/api/auth/callback/microsoft/route.ts`):**

```typescript
// Similar structure to Gmail, using OutlookProvider
```

### Scan Trigger (`app/api/email-import/scan/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { scanEmailsForInvoices } from '@/lib/email-import/services/email-scanner';
import { canUseEmailImport } from '@/lib/stripe/feature-gate';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    // Check subscription
    const gateResult = await canUseEmailImport(user.id);
    if (!gateResult.allowed) {
      return NextResponse.json(
        { error: 'Email import requires Pro subscription' },
        { status: 403 }
      );
    }

    const { connectionId } = await request.json();

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID required' },
        { status: 400 }
      );
    }

    const result = await scanEmailsForInvoices(connectionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Email scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan emails' },
      { status: 500 }
    );
  }
}
```

---

## UI Components

### Review Queue Page (`app/dashboard/import-bills/page.tsx`)

```typescript
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth/session';
import { canUseEmailImport } from '@/lib/stripe/feature-gate';
import { getPendingImports } from '@/lib/actions/pending-imports';
import { UpgradePrompt } from '@/components/subscription/upgrade-prompt';
import { ImportBillsContent } from '@/components/import-bills/import-bills-content';
import { ImportBillsSkeleton } from '@/components/import-bills/import-bills-skeleton';

export default async function ImportBillsPage() {
  const user = await requireAuth();
  const gateResult = await canUseEmailImport(user.id);

  if (!gateResult.allowed) {
    return <UpgradePrompt feature="email_import" />;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Import Bills</h1>
          <p className="text-muted-foreground">
            Review and confirm bills extracted from your emails
          </p>
        </div>
      </div>

      <Suspense fallback={<ImportBillsSkeleton />}>
        <ImportBillsContent />
      </Suspense>
    </div>
  );
}
```

### Pending Import Card (`components/import-bills/pending-import-card.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { confirmImport, rejectImport } from '@/lib/actions/pending-imports';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfirmImportDialog } from './confirm-import-dialog';
import {
  CheckCircle,
  XCircle,
  Edit,
  Mail,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface PendingImportCardProps {
  import: {
    id: string;
    email_subject: string;
    email_from: string;
    email_date: string;
    extracted_vendor: string | null;
    extracted_amount: number | null;
    extracted_due_date: string | null;
    extracted_category: string | null;
    extraction_confidence: number;
    attachment_url: string | null;
    email_connections: {
      provider: string;
      email_address: string;
    };
  };
}

export function PendingImportCard({ import: item }: PendingImportCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const confidenceColor = item.extraction_confidence >= 0.8
    ? 'text-green-600'
    : item.extraction_confidence >= 0.5
      ? 'text-yellow-600'
      : 'text-red-600';

  async function handleQuickConfirm() {
    setIsConfirming(true);
    try {
      await confirmImport(item.id);
    } finally {
      setIsConfirming(false);
    }
  }

  async function handleReject() {
    await rejectImport(item.id);
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Vendor & Amount */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">
                  {item.extracted_vendor || 'Unknown Vendor'}
                </h3>
                {item.extraction_confidence < 0.7 && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>

              <p className="text-2xl font-semibold">
                {item.extracted_amount
                  ? formatCurrency(item.extracted_amount)
                  : 'Amount unclear'}
              </p>

              {/* Due Date */}
              {item.extracted_due_date && (
                <p className="text-sm text-muted-foreground mt-1">
                  Due: {formatDate(item.extracted_due_date)}
                </p>
              )}

              {/* Email Info */}
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{item.email_subject}</span>
              </div>

              {/* Category Badge */}
              {item.extracted_category && (
                <Badge variant="secondary" className="mt-2">
                  {item.extracted_category}
                </Badge>
              )}

              {/* Confidence Score */}
              <p className={`text-xs mt-2 ${confidenceColor}`}>
                {Math.round(item.extraction_confidence * 100)}% confidence
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                onClick={handleQuickConfirm}
                disabled={isConfirming}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Confirm
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleReject}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>

              {item.attachment_url && (
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                >
                  <a href={item.attachment_url} target="_blank" rel="noopener">
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmImportDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        importData={item}
      />
    </>
  );
}
```

---

## Pro Feature Gating

### Update `lib/stripe/config.ts`

```typescript
limits: {
  // existing limits...
  emailImportEnabled: boolean;
  maxEmailConnections: number;
}

// Free tier
emailImportEnabled: false,
maxEmailConnections: 0,

// Pro tier
emailImportEnabled: true,
maxEmailConnections: 3,
```

### Add `lib/stripe/feature-gate.ts`

```typescript
export async function canUseEmailImport(userId: string): Promise<FeatureGateResult> {
  const tier = await getUserTier(userId);
  const limits = PRICING_TIERS[tier].limits;

  if (!limits.emailImportEnabled) {
    return { allowed: false, reason: 'feature_disabled', tier };
  }

  // Check connection count
  const supabase = await createClient();
  const { count } = await supabase
    .from('email_connections')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if ((count || 0) >= limits.maxEmailConnections) {
    return { allowed: false, reason: 'limit_reached', tier, limit: limits.maxEmailConnections };
  }

  return { allowed: true, tier };
}
```

---

## Required Dependencies

```json
{
  "dependencies": {
    "googleapis": "^140.0.0",
    "@microsoft/microsoft-graph-client": "^3.0.7",
    "@azure/msal-node": "^2.6.0",
    "openai": "^4.28.0"
  }
}
```

**Environment Variables to Add:**

```env
# Gmail OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://cashflowforecaster.io/api/auth/callback/google

# Outlook OAuth
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=common
MICROSOFT_REDIRECT_URI=https://cashflowforecaster.io/api/auth/callback/microsoft

# OpenAI for invoice extraction
OPENAI_API_KEY=
```

---

## Implementation Sequence

### Phase 1: Database (3 migrations)
1. Create `email_connections` table with RLS
2. Create `pending_bill_imports` table with RLS
3. Create `email_scan_logs` table with RLS

### Phase 2: Provider Layer (5 files)
4. Create `lib/email-import/providers/types.ts`
5. Create `lib/email-import/providers/gmail-provider.ts`
6. Create `lib/email-import/providers/outlook-provider.ts`
7. Create `lib/email-import/providers/index.ts`
8. Create `lib/email-import/services/token-manager.ts`

### Phase 3: AI Extraction (3 files)
9. Create `lib/email-import/extraction/extraction-types.ts`
10. Create `lib/email-import/extraction/openai-extractor.ts`
11. Create `lib/email-import/services/email-scanner.ts`

### Phase 4: OAuth Routes (2 files)
12. Create `app/api/auth/callback/google/route.ts`
13. Create `app/api/auth/callback/microsoft/route.ts`

### Phase 5: Server Actions (3 files)
14. Create `lib/actions/email-connections.ts`
15. Create `lib/actions/pending-imports.ts`
16. Create `lib/actions/scan-emails.ts`

### Phase 6: API Routes (2 files)
17. Create `app/api/email-import/scan/route.ts`
18. Create `app/api/email-import/status/route.ts`

### Phase 7: Feature Gating (2 files)
19. Update `lib/stripe/config.ts`
20. Update `lib/stripe/feature-gate.ts`

### Phase 8: UI Pages (4 files)
21. Create `app/dashboard/import-bills/page.tsx`
22. Create `app/dashboard/import-bills/connect/page.tsx`
23. Create `app/dashboard/import-bills/history/page.tsx`
24. Create `app/dashboard/import-bills/loading.tsx`

### Phase 9: UI Components (7 files)
25. Create `components/import-bills/import-bills-content.tsx`
26. Create `components/import-bills/pending-import-card.tsx`
27. Create `components/import-bills/pending-import-table.tsx`
28. Create `components/import-bills/confirm-import-dialog.tsx`
29. Create `components/import-bills/email-connection-card.tsx`
30. Create `components/import-bills/connect-email-button.tsx`
31. Create `components/import-bills/scan-progress.tsx`

### Phase 10: Navigation (2 files)
32. Update `components/dashboard/nav.tsx`
33. Update `components/subscription/upgrade-prompt.tsx`

**Total: ~33 files to create/modify**

---

## Security Considerations

1. **Token Encryption**: OAuth tokens should be encrypted at rest in the database
2. **Token Refresh**: Automatic refresh before expiration to prevent access loss
3. **Scope Limitation**: Request minimum necessary OAuth scopes (read-only)
4. **User Consent**: Clear explanation of what data will be accessed
5. **Data Retention**: Allow users to delete connections and imported data
6. **Rate Limiting**: Limit scan frequency to prevent API abuse
7. **Attachment Storage**: Store in Supabase Storage with RLS policies

---

## Verification Checklist

- [ ] Gmail OAuth flow completes successfully
- [ ] Outlook OAuth flow completes successfully
- [ ] Token refresh works automatically
- [ ] Email scanning finds invoice attachments
- [ ] AI extraction returns structured data
- [ ] Pending imports appear in review queue
- [ ] Quick confirm creates bill correctly
- [ ] Edit dialog allows field modifications
- [ ] Reject removes from queue
- [ ] Duplicate detection prevents re-imports
- [ ] Free users see upgrade prompt
- [ ] Pro users can connect up to 3 email accounts
- [ ] Navigation shows Import Bills link
- [ ] Mobile UI works correctly

---

## Future Enhancements (Not in MVP)

1. **Gmail Push Notifications**: Real-time invoice detection via Gmail webhooks
2. **Vendor Recognition**: Learn from confirmed imports to auto-categorize
3. **Recurring Detection**: Identify recurring bills from history
4. **Multi-currency**: Full support for international invoices
5. **Custom Rules**: User-defined filters (e.g., "ignore emails from noreply@")
6. **Bulk Operations**: Select multiple and confirm/reject at once
7. **OCR Fallback**: Use Tesseract.js for simpler documents
8. **Email Parsing**: Extract invoice data from email body (not just attachments)

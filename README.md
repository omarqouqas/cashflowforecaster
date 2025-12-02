# Cash Flow Forecaster

See your bank balance 60 days into the future.

**Production URL**: [cashflowforecaster.io](https://cashflowforecaster.io) (coming soon)

**Alternative**: [cashflowforecaster.app](https://cashflowforecaster.app) (redirects to .io)

Cash Flow Forecaster is a Progressive Web App that projects your bank balance 60 days into the future using a daily liquidity calendar interface. Perfect for freelancers, gig workers, and anyone who needs to know if they can afford rent before payday arrives.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **Package Manager:** pnpm

## Prerequisites

- Node.js 18.17 or later
- pnpm 8.0 or later

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cash-flow-forecaster
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section below)

4. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

This project uses Supabase as its backend database and authentication provider. Follow these steps to set up your Supabase project and connect it to your application.

### 1. Creating a Supabase Project

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "Start your project" or "Sign up"
   - Sign up with GitHub, Google, or email

2. **Create a New Project**
   - Click "New Project" in your dashboard
   - Fill in the project details:
     - **Name**: Choose a descriptive name (e.g., "cash-flow-forecaster")
     - **Database Password**: Create a strong password (save this securely - you'll need it for direct database access)
     - **Region**: Choose the region closest to your users for best performance
     - **Pricing Plan**: Select "Free" for development (upgrades available later)

3. **Wait for Provisioning**
   - Supabase will provision your project (takes 2-3 minutes)
   - You'll see a progress indicator
   - Once complete, you'll be redirected to your project dashboard

### 2. Getting API Keys

1. **Navigate to API Settings**
   - In your project dashboard, click on the gear icon (⚙️) in the left sidebar
   - Select "Project Settings"
   - Click on "API" in the settings menu

2. **Find Your Project Credentials**
   You'll see several important values:

   - **Project URL**: Your unique Supabase project URL
     - Format: `https://xxxxxxxxxxxxx.supabase.co`
     - Copy this entire URL

   - **anon/public key**: Your public API key (safe to expose in client-side code)
     - This key is used for client-side operations
     - It's restricted by Row Level Security (RLS) policies

   - **service_role key**: Your service role key (⚠️ **KEEP THIS SECRET**)
     - This key bypasses RLS and has full database access
     - **Never commit this to git or expose it in client-side code**
     - Only use it in secure server-side environments

   [Screenshot: Supabase API Settings]

### 3. Environment Configuration

1. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```
   
   If `.env.example` doesn't exist, create `.env.local` manually.

2. **Add Your Supabase Credentials**
   Open `.env.local` and add your keys:

   ```env
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

   **Important Notes:**
   - Replace `your-project-id`, `your-anon-key-here`, and `your-service-role-key-here` with your actual values
   - The `NEXT_PUBLIC_` prefix makes these variables available in the browser (required for client-side Supabase operations)
   - Variables without `NEXT_PUBLIC_` are only available on the server (like `SUPABASE_SERVICE_ROLE_KEY`)
   - Never commit `.env.local` to git (it's already in `.gitignore`)

3. **Restart Development Server**
   After adding environment variables, restart your dev server:
   ```bash
   # Stop the server (Ctrl+C) and restart
   pnpm dev
   ```

### 4. Testing the Connection

1. **Start the Development Server**
   ```bash
   pnpm dev
   ```

2. **Visit the Test Page**
   - Open your browser and navigate to: [http://localhost:3000/test-supabase](http://localhost:3000/test-supabase)
   - This diagnostic page will test your Supabase connection

3. **Verify Success**
   You should see:
   - ✅ **Connection Status**: "Connected ✅" or "Connected ✅ (tables not created yet)"
   - ✅ **Environment Variables**: Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` should show "✅ Set"
   - Your project URL displayed (masked for security)

4. **Common Errors and Fixes**

   **Error: "Missing NEXT_PUBLIC_SUPABASE_URL"**
   - Make sure `.env.local` exists and contains `NEXT_PUBLIC_SUPABASE_URL`
   - Restart the dev server after adding environment variables
   - Check for typos in the variable name

   **Error: "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"**
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is in `.env.local`
   - Make sure you copied the entire key (they're very long)
   - Restart the dev server

   **Error: "Failed to fetch" or Network Error**
   - Check your internet connection
   - Verify the Project URL is correct (should start with `https://`)
   - Make sure your Supabase project is active (not paused)

   **Error: "relation does not exist"**
   - This is actually **expected** if you haven't created database tables yet
   - It means your connection is working! ✅
   - You'll create tables in the next step (Day 3: Database Schema)

   **Error: "Invalid API key"**
   - Double-check you copied the correct key
   - Make sure there are no extra spaces or line breaks
   - Verify you're using the `anon` key, not the `service_role` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Next Steps

Once your connection is verified:

- ✅ **Day 3**: Create your database schema (tables, relationships, RLS policies)
- ✅ **Later**: TypeScript types will be auto-generated from your database schema
- ✅ **Production**: Configure environment variables in your hosting platform (Vercel, etc.)

**Note**: The `/test-supabase` page is for development only. Remember to remove it before deploying to production.

## Database Setup Complete ✅

The database schema has been created and configured:

### Tables Created (9 total)

- ✅ **accounts** - User bank accounts (checking, savings)

- ✅ **income** - Income sources (salary, freelance, gigs)

- ✅ **bills** - Recurring expenses (rent, utilities, subscriptions)

- ✅ **user_settings** - User preferences and configuration

- ✅ **scenarios** - "Can I afford it?" calculations

- ✅ **parsed_emails** - Email parser results (bills@cashflowforecaster.io)

- ✅ **weekly_checkins** - Burn rate accuracy tracking

- ✅ **notifications** - User notification log

- ✅ **users** - Extended user profile data

### Security Configured

- ✅ Row Level Security (RLS) enabled on all tables

- ✅ Users can only access their own data

- ✅ Authentication handled by Supabase Auth

### TypeScript Types

- ✅ Generated from live database schema

- ✅ Full type safety for all database operations

- ✅ Auto-complete in IDE for queries

### Testing

- Test connection: http://localhost:3000/test-supabase

- Test database: http://localhost:3000/test-database

### Regenerating Types

If you modify the database schema, regenerate types:

```bash
npx supabase gen types typescript --project-id pyekssfaqarrpjtblnlx > types/supabase.ts

pnpm type-check  # Verify no errors
```

## Next Steps

- [x] Day 1: Project setup

- [x] Day 2: Supabase connection

- [x] Day 3: Database schema

- [ ] Day 4-5: Authentication (signup/login)

- [ ] Day 6-8: Account management

- [ ] Day 9-12: Income & bills CRUD

- [ ] Day 13-15: Calendar algorithm

## Environment Variables

This project requires the following environment variables:

### Required for Development

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Required for Production

(Add when deploying to production)

### Setup Instructions

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. Never commit `.env.local` to git (it's in `.gitignore`)

4. Restart the dev server after changing environment variables

## Available Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `pnpm dev`        | Start development server     |
| `pnpm build`      | Build for production         |
| `pnpm start`      | Start production server      |
| `pnpm lint`       | Run ESLint                   |
| `pnpm lint:fix`   | Fix ESLint errors            |
| `pnpm format`     | Format code with Prettier    |
| `pnpm type-check` | Run TypeScript type checking |

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── loading.tsx       # Global loading state
│   └── error.tsx         # Global error boundary
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm lint` and `pnpm type-check`
4. Submit a pull request

## License

Private - All rights reserved.

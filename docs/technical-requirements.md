# Technical Requirements Document

## Development Progress

### ✅ Completed (Days 1-3)

- [x] Next.js 14 project setup with TypeScript
- [x] Supabase integration (client, server, route handlers)
- [x] Database schema created (9 tables)
- [x] Row Level Security enabled
- [x] TypeScript types generated from live database
- [x] Git repository initialized
- [x] GitHub remote connected
- [x] Domains secured (cashflowforecaster.io, .app)
- [x] DNS configured for Vercel
- [x] Test pages created and verified

### 🚧 In Progress (Days 4-5)

- [ ] Authentication pages (signup/login)
- [ ] Password reset flow
- [ ] Protected routes
- [ ] User profile creation

### 📋 Upcoming

- [ ] Account management (Days 6-8)
- [ ] Income & bills CRUD (Days 9-12)
- [ ] Calendar algorithm (Days 13-15)
- [ ] Calendar UI (Days 16-20)

---

## Project Status

**Status:** In Development

**Current Phase:** Foundation Complete, Authentication In Progress

**Last Updated:** December 2024

---

## System Overview

**Product Name:** Cash Flow Forecaster

**Description:** A Progressive Web App that projects bank balance 60 days into the future using a daily liquidity calendar interface. Designed for freelancers, gig workers, and anyone who needs to know if they can afford expenses before payday arrives.

**Production Domains:** cashflowforecaster.io (primary), cashflowforecaster.app (redirect)

**Development URL:** http://localhost:3000

**Target Users:**
- Freelancers and gig workers
- Small business owners
- Anyone with irregular income
- Users who need forward-looking cash flow visibility

**Core Value Proposition:**
- See bank balance 60 days into the future
- Daily liquidity calendar interface
- "Can I afford it?" scenario planning
- Automatic bill detection via email parsing

---

## Technology Stack

### Frontend - Implemented ✅

- Next.js 14.2+ with App Router
- TypeScript 5.x (strict mode)
- Tailwind CSS 3.x
- React Hook Form + Zod validation
- date-fns for date handling
- Lucide React for icons

### Backend - Implemented ✅

- Supabase (PostgreSQL 15)
- Supabase Auth
- Row Level Security enabled
- 9 tables created and tested

### Infrastructure - Configured ✅

- Vercel (deployment target)
- Namecheap DNS
- Git + GitHub

### Package Manager

- pnpm 8.0+

---

## Database Schema

**Status:** ✅ Implemented and Verified

All tables created in production Supabase instance.
TypeScript types auto-generated from live schema.

Project ID: pyekssfaqarrpjtblnlx

To regenerate types:
```bash
npx supabase gen types typescript --project-id pyekssfaqarrpjtblnlx > types/supabase.ts
```

### Tables (9 total)

1. **accounts**
   - User bank accounts (checking, savings)
   - Fields: id, user_id, name, type, balance, currency

2. **income**
   - Income sources (salary, freelance, gigs)
   - Fields: id, user_id, name, amount, frequency, start_date, end_date

3. **bills**
   - Recurring expenses (rent, utilities, subscriptions)
   - Fields: id, user_id, name, amount, due_date, frequency, category

4. **user_settings**
   - User preferences and configuration
   - Fields: id, user_id, timezone, currency, notifications_enabled

5. **scenarios**
   - "Can I afford it?" calculations
   - Fields: id, user_id, name, amount, date, result

6. **parsed_emails**
   - Email parser results (bills@cashflowforecaster.io)
   - Fields: id, user_id, email_id, parsed_data, created_at

7. **weekly_checkins**
   - Burn rate accuracy tracking
   - Fields: id, user_id, week_start, actual_balance, projected_balance

8. **notifications**
   - User notification log
   - Fields: id, user_id, type, message, read, created_at

9. **users**
   - Extended user profile data
   - Fields: id (references auth.users), full_name, created_at, updated_at

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authentication handled by Supabase Auth
- Service role key used only in secure server-side contexts

---

## API Endpoints

### Authentication Endpoints

**POST /api/auth/signup**
- Create new user account
- Returns: user object, session token

**POST /api/auth/login**
- Authenticate existing user
- Returns: user object, session token

**POST /api/auth/logout**
- End user session
- Returns: success status

**POST /api/auth/reset-password**
- Request password reset email
- Returns: success status

**POST /api/auth/update-password**
- Update user password with reset token
- Returns: success status

### Account Management Endpoints

**GET /api/accounts**
- List all user accounts
- Returns: array of account objects

**POST /api/accounts**
- Create new account
- Body: { name, type, balance, currency }
- Returns: created account object

**PUT /api/accounts/[id]**
- Update account details
- Body: { name?, type?, balance?, currency? }
- Returns: updated account object

**DELETE /api/accounts/[id]**
- Delete account
- Returns: success status

### Income Endpoints

**GET /api/income**
- List all income sources
- Returns: array of income objects

**POST /api/income**
- Create new income source
- Body: { name, amount, frequency, start_date, end_date? }
- Returns: created income object

**PUT /api/income/[id]**
- Update income source
- Body: { name?, amount?, frequency?, start_date?, end_date? }
- Returns: updated income object

**DELETE /api/income/[id]**
- Delete income source
- Returns: success status

### Bills Endpoints

**GET /api/bills**
- List all bills
- Returns: array of bill objects

**POST /api/bills**
- Create new bill
- Body: { name, amount, due_date, frequency, category }
- Returns: created bill object

**PUT /api/bills/[id]**
- Update bill
- Body: { name?, amount?, due_date?, frequency?, category? }
- Returns: updated bill object

**DELETE /api/bills/[id]**
- Delete bill
- Returns: success status

### Calendar Endpoints

**GET /api/calendar**
- Get 60-day liquidity projection
- Query params: start_date (optional, defaults to today)
- Returns: array of daily balance objects

**GET /api/calendar/scenarios**
- List all scenarios
- Returns: array of scenario objects

**POST /api/calendar/scenarios**
- Create "Can I afford it?" scenario
- Body: { name, amount, date }
- Returns: scenario object with result

### Email Parsing Endpoints

**POST /api/emails/parse**
- Parse incoming email for bill information
- Body: { email_content, from_address }
- Returns: parsed bill data

---

## Calendar Algorithm

### Overview

The calendar algorithm projects bank balance 60 days into the future by:
1. Starting with current account balances
2. Adding income on scheduled dates
3. Subtracting bills on due dates
4. Handling recurring transactions based on frequency

### Algorithm Details

**Input:**
- Current account balances
- Income sources (amount, frequency, start_date, end_date)
- Bills (amount, due_date, frequency)
- One-time transactions (if applicable)

**Processing:**
1. Initialize calendar array (60 days)
2. Set starting balance for day 0
3. For each day (1-60):
   - Copy previous day's balance
   - Add any income scheduled for this day
   - Subtract any bills due on this day
   - Store result in calendar array

**Frequency Handling:**
- **Daily:** Every day
- **Weekly:** Same day of week
- **Bi-weekly:** Every 2 weeks from start date
- **Monthly:** Same day of month (handles month-end edge cases)
- **Quarterly:** Every 3 months
- **Yearly:** Same month and day each year

**Output:**
- Array of 60 daily balance objects
- Each object contains: date, balance, transactions (income/bills for that day)

### Edge Cases

- Month-end dates (e.g., Jan 31 → Feb 28/29)
- Leap years
- Income/bills that end before 60-day window
- Multiple accounts (aggregate balance)
- Currency conversion (future enhancement)

---

## Progressive Web App (PWA)

### Features

- **Offline Support:** Cache calendar data for offline viewing
- **Install Prompt:** "Add to Home Screen" functionality
- **App-like Experience:** Full-screen mode, no browser chrome
- **Fast Loading:** Optimized assets, lazy loading
- **Push Notifications:** (Future) Bill reminders, low balance alerts

### Manifest Configuration

- App name: "Cash Flow Forecaster"
- Short name: "Cash Flow"
- Theme color: (TBD)
- Background color: (TBD)
- Icons: Multiple sizes for different devices
- Display mode: "standalone"

### Service Worker

- Cache static assets
- Cache API responses (with expiration)
- Offline fallback page
- Background sync for data updates

---

## Mobile Strategy

### Phase 1: PWA (Current - Months 1-3)

- Progressive Web App for iOS/Android
- No app store approval needed
- Instant updates
- No 30% Apple tax
- Works on all platforms

### Phase 2: Native Apps (Month 4+, if needed)

**Technology:**
- Expo (React Native)
- NativeWind for styling
- React Navigation
- Zustand for state management

**Backend:** No changes needed
- Same Supabase backend
- Same database queries
- Same authentication
- Same business logic

**Code Reuse:** 60-70%
- TypeScript types: 100% reusable
- Business logic: 100% reusable
- Database queries: 100% reusable
- UI components: Need rewrite

**Triggers for Native Development:**
- 100+ active users requesting native app
- $1k+ MRR to justify costs
- iOS users reporting PWA limitations
- Need for push notifications

**Timeline:** 3-4 weeks when needed

**Cost:** $99/year (Apple) + $25 one-time (Google)

---

## Development Roadmap

### ✅ Phase 1: Foundation (Weeks 1-2) - COMPLETE

**Week 1-2: Foundation**
- [x] Project setup (Next.js + Supabase)
- [x] Database schema implementation
- [x] Authentication infrastructure
- [x] Basic routing
- [x] TypeScript types generated
- [x] Git/GitHub setup

### 🚧 Phase 2: Authentication (Weeks 3-4) - IN PROGRESS

**Week 3-4: User Authentication**
- [ ] Signup page
- [ ] Login page
- [ ] Password reset flow
- [ ] Protected routes middleware
- [ ] User profile creation
- [ ] Session management

### 📋 Phase 3: Account Management (Weeks 5-6)

**Week 5-6: Bank Accounts**
- [ ] Account list page
- [ ] Add account form
- [ ] Edit account form
- [ ] Delete account (with confirmation)
- [ ] Account balance updates
- [ ] Multi-account support

### 📋 Phase 4: Income & Bills (Weeks 7-9)

**Week 7-9: Income and Expenses**
- [ ] Income CRUD interface
- [ ] Bills CRUD interface
- [ ] Recurring transaction setup
- [ ] Frequency selector (daily, weekly, monthly, etc.)
- [ ] Date picker integration
- [ ] Category management

### 📋 Phase 5: Calendar Algorithm (Weeks 10-11)

**Week 10-11: Core Algorithm**
- [ ] Calendar calculation engine
- [ ] 60-day projection logic
- [ ] Frequency handling (daily, weekly, monthly, etc.)
- [ ] Edge case handling (month-end, leap years)
- [ ] Multi-account aggregation
- [ ] Performance optimization

### 📋 Phase 6: Calendar UI (Weeks 12-14)

**Week 12-14: User Interface**
- [ ] Calendar view component
- [ ] Daily balance display
- [ ] Transaction list per day
- [ ] Visual indicators (low balance, bills due)
- [ ] Responsive design (mobile-first)
- [ ] Loading states and error handling

### 📋 Phase 7: Scenarios (Weeks 15-16)

**Week 15-16: "Can I Afford It?" Feature**
- [ ] Scenario creation form
- [ ] Scenario calculation
- [ ] Scenario results display
- [ ] Scenario history
- [ ] Save/delete scenarios

### 📋 Phase 8: Email Parsing (Weeks 17-18)

**Week 17-18: Bill Detection**
- [ ] Email forwarding setup
- [ ] Email parser service
- [ ] Bill extraction logic
- [ ] Auto-create bills from emails
- [ ] Manual review/approval flow

### 📋 Phase 9: Polish & Launch (Weeks 19-20)

**Week 19-20: Final Touches**
- [ ] PWA configuration
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] User onboarding flow
- [ ] Documentation
- [ ] Beta testing
- [ ] Production deployment

---

## Repository Information

**GitHub:** https://github.com/omarqouqas/cashflowforecaster

**Branch Strategy:**
- `main` - Production-ready code
- Feature branches for new development

**Commit Convention:**
- Use descriptive commit messages
- Include "what" and "why"
- Reference day/phase when relevant

**Protected Files:**
- `.env.local` - Never commit (contains secrets)
- `.env.example` - Commit (templates only)
- `node_modules/` - Ignored

---

## Security Requirements

### Authentication
- Supabase Auth for user management
- Secure password hashing (handled by Supabase)
- Session management via HTTP-only cookies
- Password reset via secure email tokens

### Data Protection
- Row Level Security (RLS) on all tables
- User data isolation (users can only access their own data)
- Service role key only used server-side
- Environment variables for sensitive data

### API Security
- Rate limiting (to be implemented)
- Input validation on all endpoints
- SQL injection prevention (Supabase handles this)
- XSS prevention (React escapes by default)

---

## Performance Requirements

### Page Load Times
- Initial page load: < 2 seconds
- Calendar calculation: < 500ms
- API response times: < 200ms (p95)

### Optimization Strategies
- Code splitting (Next.js automatic)
- Image optimization (Next.js Image component)
- Lazy loading for calendar data
- Caching for static assets
- Database query optimization

---

## Testing Strategy

### Unit Tests
- Calendar algorithm logic
- Date calculation functions
- Frequency handling
- Edge cases (month-end, leap years)

### Integration Tests
- API endpoints
- Database queries
- Authentication flows
- Protected routes

### E2E Tests
- User signup/login flow
- Account management flow
- Income/bills CRUD
- Calendar display
- Scenario calculation

### Testing Tools
- Jest (unit tests)
- React Testing Library (component tests)
- Playwright (E2E tests)
- Supabase test database

---

## Deployment

### Production Environment
- **Platform:** Vercel
- **Domain:** cashflowforecaster.io
- **SSL:** Automatic (Vercel)
- **CDN:** Vercel Edge Network

### Environment Variables (Production)
- `NEXT_PUBLIC_APP_URL` - Production URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only)

### CI/CD Pipeline
- Automatic deployments from `main` branch
- Preview deployments for pull requests
- Automated testing before deployment
- Rollback capability

---

## Monitoring & Analytics

### Error Tracking
- Error boundary for React errors
- API error logging
- Database error monitoring

### Analytics
- User engagement metrics
- Feature usage tracking
- Performance monitoring
- Error rates

### Tools (To Be Implemented)
- Sentry (error tracking)
- Vercel Analytics (performance)
- Custom analytics dashboard

---

## Future Enhancements

### Phase 2 Features
- Multi-currency support
- Budget categories
- Spending insights
- Export to CSV/PDF
- Email notifications
- Mobile app (if needed)

### Phase 3 Features
- Bank account integration (Plaid)
- Automatic transaction import
- AI-powered bill categorization
- Predictive analytics
- Team/collaboration features

---

## Appendix

### Project Structure
```
cash-flow-forecaster/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # Reusable UI components
│   └── features/          # Feature-specific components
├── lib/
│   ├── auth/              # Authentication utilities
│   ├── database/          # Database utilities
│   ├── supabase/          # Supabase client setup
│   └── utils/             # General utilities
├── types/                 # TypeScript type definitions
│   └── supabase.ts        # Generated database types
└── public/                # Static assets
```

### Key Dependencies
- `next`: 14.2.33
- `react`: ^18
- `@supabase/ssr`: ^0.8.0
- `date-fns`: ^4.1.0
- `tailwindcss`: ^3.4.1
- `typescript`: ^5

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Maintained By:** Development Team


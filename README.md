# Ugle

Ugle is a local-first video indexing and search application designed specifically for filmmakers, investigative journalists, editors, and podcasters. It aims to eliminate "the deadline tax" of scrubbing through hours of raw footage to find specific audio or visual moments.

### The Brand & Core Values
- **100% Private (Local-First)**: Every frame and audio byte stays on the user's machine. Nothing ever reaches external servers or clouds, respecting the sensitive nature of raw journalistic and editorial source recordings.
- **Zero Metering & Token Fees**: No AI token tracking, per-search limits, or recurring subscription bills. A transparent "pay once, search forever" model.
- **100% Uptime**: No rate limits, API outages, or server crashes. It runs locally when and where the user does.
- **Zero-Configuration Setup**: Connects to existing video libraries and platforms out of the box.

---

## Key Architectures

### 1. Robust Lead Capture (Resend + Google Sheets)
All form submissions run Resend email notifications and Google Sheets integration in parallel using `Promise.allSettled`. 
- **Resilient Fallback**: If either method fails, the action still returns a successful response to the user so long as at least one service succeeds. Individual failures are logged on the server.
- **Timestamps**: All submission timestamps are automatically formatted to Indian Standard Time (IST) before being saved.

### 2. OOP-Based Google Sheets Service
A clean class hierarchy manages the Google Sheets integration:
- [GoogleSheetsService.ts](./app/lib/sheets/GoogleSheetsService.ts): Abstract base class that manages Google JWT authentication and provides a protected `appendRow()` helper.
- **Specific Subclasses**: Subclasses define their target sheet tab name and define the exact data-to-row mapping.
  - [NewsletterSheetService.ts](./app/lib/sheets/NewsletterSheetService.ts) → Sheet name `"Newsletter"`
  - [EarlyAccessSheetService.ts](./app/lib/sheets/EarlyAccessSheetService.ts) → Sheet name `"EarlyAccess"`
  - [DemoSheetService.ts](./app/lib/sheets/DemoSheetService.ts) → Sheet name `"Demo"`
  - [EducationSheetService.ts](./app/lib/sheets/EducationSheetService.ts) → Sheet name `"Education"`
  - [ContactFormSheetService.ts](./app/lib/sheets/ContactFormSheetService.ts) → Sheet name `"Contact"` (or configured sheet name)

### 3. Build-Time Env Validation
Environment variables are strictly validated at build time. [next.config.ts](./next.config.ts) imports [env.ts](./app/lib/env.ts) to force the build process to abort early if any required credentials are missing.

---

## Setup & Configuration

### 1. Environment Variables
Create a `.env.local` file at the root of the project and populate the following keys:

```env
# Resend Email Configuration
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="no-reply@yourdomain.com" # Or onboarding@resend.dev for testing
ADMIN_EMAIL="admin1@domain.com, admin2@domain.com" # Comma-separated list supported

# Google Service Account Credentials
GOOGLE_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC... \n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID="your_google_spreadsheet_id"

# Cloudflare Turnstile Keys
NEXT_PUBLIC_TURNSTILE_SITE_KEY="1x00000000000000000000AA"
TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"
```

### 2. Google Spreadsheet Setup
1. Create a Google Spreadsheet.
2. Share the spreadsheet with your `GOOGLE_CLIENT_EMAIL` address as an **Editor**.
3. Create individual sheets (tabs) with the exact names:
   - **`Newsletter`** with columns: `Email | Subscribed At`
   - **`EarlyAccess`** with columns: `First Name | Last Name | Email | Phone | OS | Submitted At`
   - **`Demo`** with columns: `First Name | Last Name | Email | Company | Team Size | Current Workflow | Submitted At`
   - **`Education`** with columns: `First Name | Last Name | Email | Institution | Role | Proof URL | Submitted At`
   - **`Contact`** with columns: `First Name | Last Name | Email | Company | Seats | Usecase | Submitted At`

---

## Getting Started

First, install dependencies:

```bash
bun install
# or
npm install
```

Run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build
Verify and build the static pages and application bundle:
```bash
bun run build
# or
npm run build
```
The blogs page uses static parameters (`generateStaticParams`) and will generate completely static HTML pages under `/blog/[slug]` during the build.

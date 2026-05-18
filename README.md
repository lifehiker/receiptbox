# ReceiptBox

A simple receipt scanner and organizer for freelancers and self-employed users.
Scan a receipt, label it into a tax-ready category, and export CSV or ZIP at tax time.

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- Prisma ORM + SQLite (zero-config — no external DB needed)
- NextAuth v5 with Credentials provider (email + password, bcrypt-hashed)
- Local filesystem storage for receipt files
- Optional: Google Cloud Vision API for OCR (manual entry works without it)
- Optional: Stripe Billing for subscriptions (pricing page works without keys)

## Local development

```bash
npm install
npx prisma db push
npm run dev
```

Visit http://localhost:3000.

Create a `.env` (or copy `.env.example`) and at minimum set:

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
```

To enable OCR, add `GOOGLE_VISION_API_KEY="..."`. To enable Stripe checkout,
add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY`,
and `STRIPE_WEBHOOK_SECRET`. The app is fully functional without these.

## Production build

```bash
npm run build
npm run start
```

## Docker / Coolify

A production-ready `Dockerfile` is included. The image:

- runs on `node:20-slim` with OpenSSL installed for Prisma
- bakes safe defaults for `AUTH_SECRET`, `DATABASE_URL`, and `UPLOAD_DIR`
- runs `prisma db push` at container start to initialize the SQLite database
  at `/data/app.db`
- stores uploaded receipts under `/data/uploads`
- listens on port 3000

To deploy on Coolify, point it at this repo. No environment variables are
required — but you should override `AUTH_SECRET` and `NEXT_PUBLIC_APP_URL`
for production, and mount `/data` as a persistent volume.

## App routes

- `/` — marketing homepage
- `/pricing` — Free / Pro pricing
- `/for-freelancers`, `/for-self-employed`, `/receipt-scanner-for-taxes`,
  `/export-receipts-csv` — SEO landing pages
- `/compare/expensify-alternative`, `/compare/shoeboxed-alternative`,
  `/compare/smart-receipts-alternative` — comparison pages
- `/sign-in`, `/sign-up` — authentication
- `/dashboard` — recent receipts and plan status (auth-required)
- `/receipts` — list with search, category, and date filters
- `/receipts/[id]` — detail with preview, editable fields, delete
- `/upload` — camera capture / drag-drop with OCR review
- `/exports` — CSV and ZIP exports (filterable by date range)
- `/settings` — account, subscription, delete account

## API

- `POST /api/auth/sign-up` — create a new account
- `GET/POST /api/auth/[...nextauth]` — NextAuth handlers
- `POST /api/receipts/upload` — upload a receipt file
- `GET /api/receipts/files/[...path]` — serve a stored receipt (auth-gated)
- `GET/PATCH/DELETE /api/receipts/[id]` — single receipt CRUD
- `POST /api/receipts/[id]/ocr` — run OCR on an uploaded receipt
- `POST /api/exports/csv` — CSV export (optional `from` / `to` query params)
- `POST /api/exports/zip` — ZIP export with `/YEAR/CATEGORY/filename`
- `POST /api/stripe/checkout`, `POST /api/stripe/portal` — Stripe entry points
- `POST /api/webhooks/stripe` — Stripe webhook
- `POST /api/account/delete` — delete account and all uploads

## Free-tier entitlements

- Free: 15 total receipts, 1 export per month
- Pro: unlimited

See `src/lib/entitlements.ts`.

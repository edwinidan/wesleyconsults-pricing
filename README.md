# WesleyConsults Pricing Calculator

A professional web-based pricing calculator for WesleyConsults website development projects. Built with Next.js, Tailwind CSS, and TypeScript.

## Features

- **Interactive scope checklist** — check features to build the price in real-time
- **PDF export** — generate a branded quote PDF on the spot
- **WhatsApp sharing** — send a formatted breakdown to clients
- **Copy to clipboard** — quick text summary for emails
- **Responsive** — works on phone, tablet, and laptop
- **WesleyConsults branding** — navy & gold theme throughout

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Vercel auto-detects Next.js — just click Deploy
4. Optional: add a custom domain like `pricing.wesleyconsults.com`

## Customizing Prices

Edit `lib/pricing.ts` to adjust:
- **Base rates** per project type
- **Feature costs** in the checklist
- **Timeline multipliers**
- **Hosting tiers**
- **Buffer percentage** (currently 15%)

## Tech Stack

- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS
- jsPDF + jspdf-autotable (PDF generation)
- Google Fonts (DM Sans + Playfair Display)

## File Structure

```
├── app/
│   ├── globals.css      # Global styles + Tailwind + branding
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main calculator page
├── lib/
│   ├── pricing.ts        # Pricing data, logic, and calculations
│   └── pdf.ts            # PDF generation with WesleyConsults branding
├── tailwind.config.js    # Custom colors (navy, gold)
└── package.json
```

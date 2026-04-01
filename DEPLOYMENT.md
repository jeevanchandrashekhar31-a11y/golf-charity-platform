# GreenPrize Platform Deployment Guide

Follow these exact steps to successfully deploy the GreenPrize platform to production.

## STEP 1 — Supabase
- Create a new project at [supabase.com](https://supabase.com)
- Go to **SQL Editor** → Paste the contents of `/lib/database.sql` → Run
- Go to **Authentication > Providers** → Enable **Email**
- Go to **Authentication > URL Configuration** → Add your Vercel URL to *Site URL* and *Redirect URLs*
- Go to **Settings > API** → Copy your Project URL, Anon Key, and Service Role Key

## STEP 2 — Stripe Products
- Go to [stripe.com](https://stripe.com) → Ensure **Test Mode** is ON
- **Products** → Create "GreenPrize Monthly" → Price £19.99/month → Copy Price ID
- **Products** → Create "GreenPrize Yearly" → Price £179.99/year → Copy Price ID
- **Developers > Webhooks** → Add a new endpoint: `https://YOUR_DOMAIN/api/webhooks/stripe`
- **Webhook Events:** Select the following:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Copy your webhook signing secret (`whsec_...`)

## STEP 3 — Vercel
- Push your project to a new GitHub repository
- Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
- Add all environment variables from `.env.example` with the real API keys you collected
- Click **Deploy**

## STEP 4 — Create Admin User
- Sign up on your newly deployed live site
- Go back to Supabase → **Table Editor** → `profiles` table → Find your newly created row
- Set the `role` column to `'admin'`
- Back on your site, log out and log back in. You will be redirected to the `/admin` dashboard.

## STEP 5 — Seed & Test
- From the **Admin Dashboard**, navigate to Charities and add 3+ charities with images and details.
- Create a brand new **test subscriber account** in incognito.
- Subscribe and pay with the Stripe test card:
  - Card Number: `4242 4242 4242 4242`
  - Expiry: Any future date
  - CVC: Any 3 digits
- Navigate to the dashboard and add 5 mock golf scores.
- As the Admin user, go to **Draw Management** → run an algorithmic draw simulation → **Publish**.
- Ensure the newly published draw populates with correct winners properly verified in the user dashboard!

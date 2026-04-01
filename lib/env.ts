export function envCheck() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID',
    'NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID',
    'NEXT_PUBLIC_APP_URL',
  ]

  for (const req of required) {
    if (!process.env[req]) {
      throw new Error(`Missing required environment variable: ${req}`)
    }
  }
}

// execute on module import
if (typeof window === 'undefined') {
  envCheck()
}

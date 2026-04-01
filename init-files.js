const fs = require('fs');
const path = require('path');

const filesToCreate = [
  "/app/page.tsx",
  "/app/layout.tsx",
  "/app/globals.css",
  "/app/auth/login/page.tsx",
  "/app/auth/signup/page.tsx",
  "/app/auth/callback/route.ts",
  "/app/auth/reset-password/page.tsx",
  "/app/dashboard/page.tsx",
  "/app/dashboard/layout.tsx",
  "/app/dashboard/scores/page.tsx",
  "/app/dashboard/charity/page.tsx",
  "/app/dashboard/draws/page.tsx",
  "/app/dashboard/settings/page.tsx",
  "/app/admin/page.tsx",
  "/app/admin/layout.tsx",
  "/app/admin/users/page.tsx",
  "/app/admin/draws/page.tsx",
  "/app/admin/charities/page.tsx",
  "/app/admin/winners/page.tsx",
  "/app/admin/reports/page.tsx",
  "/app/charities/page.tsx",
  "/app/charities/[id]/page.tsx",
  "/app/subscribe/page.tsx",
  "/app/api/webhooks/stripe/route.ts",
  "/app/api/checkout/create/route.ts",
  "/app/api/subscription/cancel/route.ts",
  "/app/api/scores/add/route.ts",
  "/app/api/scores/update/route.ts",
  "/app/api/scores/delete/route.ts",
  "/app/api/draws/run/route.ts",
  "/app/api/draws/simulate/route.ts",
  "/app/api/draws/publish/route.ts",
  "/app/api/charity/select/route.ts",
  "/app/api/admin/charities/route.ts",
  "/components/layout/Navbar.tsx",
  "/components/layout/Footer.tsx",
  "/components/layout/Sidebar.tsx",
  "/components/layout/AdminSidebar.tsx",
  "/components/home/Hero.tsx",
  "/components/home/HowItWorks.tsx",
  "/components/home/CharitySpotlight.tsx",
  "/components/home/DrawMechanic.tsx",
  "/components/home/PricingSection.tsx",
  "/components/dashboard/ScoreEntry.tsx",
  "/components/dashboard/ScoreHistory.tsx",
  "/components/dashboard/CharitySelector.tsx",
  "/components/dashboard/DrawHistory.tsx",
  "/components/dashboard/WinningsCard.tsx",
  "/components/dashboard/SubscriptionStatus.tsx",
  "/components/admin/UserTable.tsx",
  "/components/admin/DrawControl.tsx",
  "/components/admin/CharityManager.tsx",
  "/components/admin/WinnersTable.tsx",
  "/components/admin/ReportsPanel.tsx",
  "/lib/supabase.ts",
  "/lib/stripe.ts",
  "/lib/draw-engine.ts",
  "/lib/auth.ts",
  "/lib/utils.ts",
  "/lib/env.ts",
  "/types/index.ts",
  "/middleware.ts"
];

const basePath = process.cwd();

filesToCreate.forEach(file => {
  const fullPath = path.join(basePath, file);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Next.js actually created /app/page.tsx, layout.tsx, utils.ts, etc.
  // Don't overwrite globals.css or utils.ts or layout.tsx if they exist from setup, except maybe user wants it. 
  // Wait, Next.js created some files. The user said "create this exact folder and file structure with empty placeholder files".
  // If we just overwrite Next.js default page, it's fine.
  if (file === '/app/globals.css' || file === '/lib/utils.ts') {
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, '// ' + file, 'utf8');
    }
    return; // Preserve shadcn/Next.js files for global css and utils
  }

  let content = '';
  const parsed = path.parse(file);
  
  if (file.endsWith('page.tsx') || file.endsWith('layout.tsx')) {
    content = `export default function ${parsed.name.replace(/[^a-zA-Z0-9]/g, '')}Component() { return <div>Placeholder for ${file}</div>; }\n`;
  } else if (file.endsWith('.tsx')) {
    content = `export default function ${parsed.name.replace(/[^a-zA-Z0-9]/g, '')}() { return <div>${parsed.name}</div>; }\n`;
  } else if (file.endsWith('route.ts')) {
    content = `export async function GET() { return new Response('Placeholder for ${file}'); }\n`;
  } else {
    content = `// Placeholder for ${file}\n`;
  }

  // Note: we can overwrite Next.js default app/page.tsx so it's a clean slate.
  fs.writeFileSync(fullPath, content, 'utf8');
});

console.log("Files created successfully!");

const fs = require('fs');
const mustHave = [
  'package.json',
  'netlify.toml',
  'next.config.js',
  'src/app/page.jsx',
  'src/app/layout.jsx',
  'src/pages/index.js',
  'src/pages/_app.js',
  'netlify/functions/health.js',
  'netlify/functions/status.js',
  'netlify/functions/create-checkout.js',
  'netlify/functions/stripe-webhook.js',
  'supabase/migrations/001_kamdridi_foundation.sql',
  'scripts/diagnostics-nasa.js'
];

let ok = true;
for (const f of mustHave) {
  if (!fs.existsSync(f)) { console.error('MISSING:', f); ok = false; }
}
if (!ok) process.exit(1);
console.log('✅ VERIFY FULL: all required files exist');

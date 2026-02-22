#!/bin/bash
set -e

echo "🛰️  KAMDRIDI EMPIRE — ONE CLICK INSTALL (NASA)"
echo ""

if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo "⚠️  Created .env.local — edit it now with your keys."
  exit 1
fi

npm install
npm run db:push
npm run stripe:setup
npm run diagnostics:nasa

echo ""
echo "✅ Ready. Now run:"
echo "   npm run dev"
echo "   npm run deploy:preview"
echo "   npm run deploy"

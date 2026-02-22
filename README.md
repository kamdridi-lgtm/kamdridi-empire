# KAMDRIDI EMPIRE — v2 (NASA)

This zip is **source code** (no node_modules). Install on your machine:

```bash
npm install
```

## One-click install
```bash
chmod +x scripts/one-click-install.sh
./scripts/one-click-install.sh
```

## Commands
- `npm run dev`
- `npm run db:push`
- `npm run stripe:setup`
- `npm run diagnostics:nasa`
- `npm run deploy`


## Netlify build fix
This project uses Next.js App Router (src/app). Do not add src/pages (it conflicts).

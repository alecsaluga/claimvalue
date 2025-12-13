# Quick Command Reference

## Development

### Start Development Server
```bash
npm run dev
```
→ Opens on http://localhost:3000

### Build for Production
```bash
npm run build
```

### Run Production Build Locally
```bash
npm run build
npm start
```

### Run Linting
```bash
npm run lint
```

## Common Tasks

### Clear Cache and Reinstall
```bash
rm -rf node_modules package-lock.json .next
npm install
```

### Update Dependencies
```bash
npm update
```

### Add New Package
```bash
npm install package-name
```

## Testing

### Test Webhook Locally
```bash
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Test Your n8n Webhook
```bash
curl -X POST https://n8n.alecautomations.com/webhook/ecba2499-b22e-466f-8c67-f1ad71d1f748 \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "answers": {
      "issue_type": "Fired / let go",
      "where_state": "California"
    },
    "meta": {
      "userAgent": "Test",
      "referrer": "",
      "path": "/",
      "version": "v1"
    }
  }'
```

## Git (If Using Version Control)

### Initialize Git
```bash
git init
git add .
git commit -m "Initial commit: Workplace Outcomes Estimator MVP"
```

### Push to GitHub
```bash
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables (Vercel)
```bash
vercel env add NEXT_PUBLIC_WEBHOOK_URL
vercel env add NEXT_PUBLIC_CONNECT_WEBHOOK_URL
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found
```bash
npm install
```

### TypeScript Errors
```bash
# Check types
npx tsc --noEmit
```

### Build Errors
```bash
rm -rf .next
npm run build
```

## File Structure Commands

### View All TypeScript Files
```bash
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules
```

### Count Lines of Code
```bash
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs wc -l
```

### Search for Text in Code
```bash
grep -r "search_term" --include="*.ts" --include="*.tsx" .
```

## Useful Development Tools

### Watch File Changes
The dev server automatically watches and hot-reloads changes.

### View Build Output
```bash
npm run build
# Check .next/static/ for built files
```

### Analyze Bundle Size
```bash
npm run build
# Look for "First Load JS" in output
```

## Environment Variables

### View Current Environment
```bash
cat .env.local
```

### Test Without Webhooks
```bash
# Comment out or remove webhook URLs in .env.local
# App will use mock data
```

## Quick Edits

### Change Questions
```bash
# Edit this file:
open lib/questions.ts
```

### Change Styling
```bash
# Edit this file:
open app/globals.css
```

### Change Landing Page Copy
```bash
# Edit this file:
open app/page.tsx
```

## Logs & Debugging

### View Dev Server Logs
Automatically shown in terminal when running `npm run dev`

### View Browser Console
- Open browser DevTools (F12)
- Check Console tab for analytics events and errors

### View Network Requests
- Open browser DevTools (F12)
- Check Network tab to see webhook requests

## Production Checklist

- [ ] Test entire quiz flow
- [ ] Test on mobile device
- [ ] Verify webhook responses
- [ ] Check all links work
- [ ] Test contact form
- [ ] Review all copy for typos
- [ ] Test error states
- [ ] Verify analytics events
- [ ] Check accessibility
- [ ] Test in different browsers

## Need Help?

1. Check `README.md` for full documentation
2. Check `SETUP.md` for setup instructions
3. Check `WEBHOOK_GUIDE.md` for n8n help
4. Check code comments in source files

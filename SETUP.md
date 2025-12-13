# Setup Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**

   The `.env.local` file has been created for you. To connect to your n8n webhooks, edit it:

   ```bash
   # Open .env.local and add your webhook URLs
   NEXT_PUBLIC_WEBHOOK_URL=https://your-n8n-instance.com/webhook/estimate
   NEXT_PUBLIC_CONNECT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/contact
   ```

   **Note:** The app works perfectly without these URLs - it will use realistic mock data.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing the App

### Without Webhooks (Mock Mode)
- Leave the `.env.local` file empty or comment out the URLs
- Complete the quiz - you'll receive a realistic mock estimate
- Contact form submissions will log to console

### With Webhooks
- Add your n8n webhook URLs to `.env.local`
- The app will POST to your webhook on quiz completion
- See README.md for exact payload/response formats

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_WEBHOOK_URL`
   - `NEXT_PUBLIC_CONNECT_WEBHOOK_URL` (optional)
4. Deploy!

### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- AWS Amplify
- Any Node.js hosting

## Customization Quick Start

### Change Questions
Edit `lib/questions.ts` - the questions array at the bottom of the file.

### Change Styling
- Colors: `app/globals.css` (CSS variables)
- Components: `components/ui/*`
- Layout: `app/page.tsx`

### Add Analytics
Replace console.log calls in `lib/analytics.ts` with your analytics provider:
```typescript
// Example: Google Analytics
export function trackEvent(event: AnalyticsEvent, data?: EventData) {
  gtag('event', event, data);
}
```

### Modify Mock Estimate Logic
Edit the `getMockEstimate` function in `lib/api.ts`.

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### TypeScript errors
```bash
# Ensure all dependencies are installed
npm install
```

## Next Steps

1. ✅ Complete the quiz to see the flow
2. ✅ Test on mobile devices
3. ✅ Set up your n8n webhooks (optional)
4. ✅ Customize branding and copy
5. ✅ Deploy to production
6. ✅ Add analytics tracking
7. ✅ Connect to your CRM (via contact webhook)

## Support

For questions or issues:
- Check README.md for detailed documentation
- Review code comments in source files
- Contact your development team

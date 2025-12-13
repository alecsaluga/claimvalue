# Pre-Launch Checklist

## ✅ Setup Complete
- [x] Project created and configured
- [x] Dependencies installed
- [x] Webhooks configured in .env.local
- [x] Build tested successfully
- [x] Dev server runs without errors

## 🧪 Testing (Do Before Launch)

### Local Testing
- [ ] Run `npm run dev` and complete entire quiz
- [ ] Test all question types:
  - [ ] Choice buttons work
  - [ ] Multi-choice selections work
  - [ ] State dropdown works
  - [ ] Text inputs work
  - [ ] Textarea works
- [ ] Test conditional logic (issue_type "Other" shows follow-up)
- [ ] Test Back button works
- [ ] Verify progress bar updates
- [ ] Test localStorage (refresh page mid-quiz, answers should persist)
- [ ] Complete quiz and verify results display
- [ ] Test contact modal (open, fill, submit)
- [ ] Check browser console for errors

### Responsive Testing
- [ ] Test on desktop (1920px, 1440px, 1024px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px, 414px)
- [ ] Test landscape orientation on mobile
- [ ] Verify quiz card is centered
- [ ] Verify buttons are tappable on mobile
- [ ] Test scroll behavior

### Webhook Testing
- [ ] Set up n8n workflow for quiz estimation
- [ ] Test webhook with sample payload
- [ ] Verify webhook returns correct JSON format
- [ ] Test webhook timeout/error handling
- [ ] Set up n8n workflow for contact form
- [ ] Test contact form webhook
- [ ] Verify data reaches your n8n instance

### Content Review
- [ ] Proofread all question text
- [ ] Review landing page copy
- [ ] Check FAQ content
- [ ] Verify "How We're Different" section
- [ ] Review legal disclaimer
- [ ] Check footer text

### Functionality Testing
- [ ] Test with empty webhook URLs (should use mock)
- [ ] Test with invalid webhook URLs (should show error)
- [ ] Test required field validation
- [ ] Test email validation in contact form
- [ ] Verify analytics events in console
- [ ] Test retry button on error

## 🚀 Deployment

### Pre-Deployment
- [ ] Run `npm run build` successfully
- [ ] Review build output for warnings
- [ ] Test production build locally (`npm start`)
- [ ] Verify environment variables are ready
- [ ] Choose hosting platform (Vercel recommended)

### Deploy to Vercel
- [ ] Create Vercel account (if needed)
- [ ] Connect GitHub repository
- [ ] Import project in Vercel
- [ ] Add environment variables in Vercel:
  - [ ] NEXT_PUBLIC_WEBHOOK_URL
  - [ ] NEXT_PUBLIC_CONNECT_WEBHOOK_URL
- [ ] Trigger deployment
- [ ] Wait for build to complete
- [ ] Test live URL

### Post-Deployment
- [ ] Test complete quiz flow on production URL
- [ ] Test on real mobile device
- [ ] Verify webhooks work in production
- [ ] Check analytics events
- [ ] Test contact form submission
- [ ] Share URL with team for review

## 🔍 Quality Assurance

### Accessibility
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify focus states are visible
- [ ] Check color contrast
- [ ] Test with screen reader (optional)

### Performance
- [ ] Check Lighthouse score
- [ ] Verify page load time < 3s
- [ ] Check bundle size in build output
- [ ] Test on slow 3G connection

### SEO (Optional)
- [ ] Add meta description
- [ ] Add Open Graph tags
- [ ] Add favicon
- [ ] Verify page title

### Security
- [ ] Verify HTTPS on production
- [ ] Check no API keys exposed in code
- [ ] Test CORS if applicable
- [ ] Review webhook security

## 📊 Analytics Setup (Optional)

- [ ] Choose analytics platform (Google Analytics, Plausible, etc.)
- [ ] Add tracking code
- [ ] Update `lib/analytics.ts` with real implementation
- [ ] Test events are being tracked
- [ ] Set up conversion goals

## 🎯 n8n Workflows

### Quiz Estimation Workflow
- [ ] Create workflow
- [ ] Add webhook trigger
- [ ] Add estimation logic
- [ ] Test with sample data
- [ ] Verify response format
- [ ] Activate workflow
- [ ] Test from live app

### Contact Form Workflow
- [ ] Create workflow
- [ ] Add webhook trigger
- [ ] Add notification (email/Slack)
- [ ] Add CRM integration (optional)
- [ ] Test with sample data
- [ ] Activate workflow
- [ ] Test from live app

## 🔧 Optional Enhancements

### Week 1 Improvements
- [ ] Add custom domain
- [ ] Set up Google Analytics
- [ ] Add SSL certificate (usually automatic)
- [ ] Set up error monitoring (Sentry, etc.)

### Week 2 Improvements
- [ ] A/B test different question wording
- [ ] Add more detailed analytics
- [ ] Enhance n8n workflows with AI
- [ ] Add database for submission storage

### Future Features
- [ ] Email follow-up sequence
- [ ] PDF report generation
- [ ] Social proof / testimonials
- [ ] Blog/resources section
- [ ] Attorney finder tool

## 📝 Documentation Review

- [ ] Read `README.md`
- [ ] Read `SETUP.md`
- [ ] Read `WEBHOOK_GUIDE.md`
- [ ] Read `PROJECT_SUMMARY.md`
- [ ] Bookmark `COMMANDS.md` for reference

## 🎉 Launch Day

- [ ] Final production test
- [ ] Monitor webhook logs
- [ ] Watch analytics dashboard
- [ ] Prepare support plan
- [ ] Share URL with stakeholders
- [ ] Celebrate! 🎊

## 📞 Support Contacts

**Technical Issues:**
- Check console logs
- Review n8n workflow logs
- Check Vercel deployment logs

**Content Changes:**
- Questions: `lib/questions.ts`
- Landing page: `app/page.tsx`
- Styling: `app/globals.css`

**Webhook Issues:**
- Test payload in WEBHOOK_GUIDE.md
- Check n8n workflow logs
- Verify webhook URLs in .env.local

---

## Quick Start (Reminder)

```bash
npm run dev     # Start development
npm run build   # Build for production
npm start       # Run production build
```

Your app is at: http://localhost:3000

Your webhooks are configured:
- Quiz: https://n8n.alecautomations.com/webhook/ecba2499-b22e-466f-8c67-f1ad71d1f748
- Contact: https://n8n.alecautomations.com/webhook/bbec0056-7245-4dd2-843a-d97e55236776

Good luck! 🚀

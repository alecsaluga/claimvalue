# Workplace Outcomes Estimator

A production-ready MVP web application that helps users estimate potential outcomes for workplace disputes. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Step-by-step quiz flow** - One question at a time with progress tracking
- **Smart conditional logic** - Questions adapt based on previous answers
- **Auto-save to localStorage** - Never lose progress on page refresh
- **Webhook integration** - Submits answers to n8n workflow and receives estimation
- **Mock fallback** - Works without webhook configuration for testing
- **Responsive design** - Beautiful UI on all devices
- **Results visualization** - Clear display of estimate range, likelihood, and next steps
- **Contact modal** - Optional lead capture for specialist connection
- **Analytics tracking** - Console-based event logging (ready for analytics service)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **Zod** for validation
- **Radix UI** primitives
- **Lucide React** icons

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your webhook URLs (optional):

```env
# Main webhook for quiz submission and estimation
NEXT_PUBLIC_WEBHOOK_URL=https://your-n8n-instance.com/webhook/estimate

# Optional: webhook for contact form submissions
NEXT_PUBLIC_CONNECT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/contact
```

**Note:** The app works without webhook URLs configured - it will use realistic mock data instead.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Webhook Integration

### Quiz Submission Webhook

When the user completes the quiz, the app sends a POST request to `NEXT_PUBLIC_WEBHOOK_URL` with this JSON payload:

```json
{
  "sessionId": "uuid-v4-string",
  "submittedAt": "2024-01-15T10:30:00.000Z",
  "answers": {
    "issue_type": "Fired / let go",
    "where_state": "California",
    "timeline_recent": "March 2024",
    "still_employed": "No",
    "tenure": "3–7 years",
    "employer_size": "200–999",
    "pay_rate": "Salary",
    "pay_amount": "$85,000/yr",
    "what_happened": "...",
    "reason_given": "Performance",
    "evidence": ["Emails/texts", "HR paperwork"],
    "reported": "Yes",
    "impact": ["Lost income", "Medical/mental health impact"],
    "desired_outcome": "Compensation"
  },
  "meta": {
    "userAgent": "Mozilla/5.0...",
    "referrer": "",
    "path": "/",
    "version": "v1"
  }
}
```

### Expected Response Format

Your webhook should return JSON matching this schema:

```json
{
  "range": {
    "low": 25000,
    "high": 85000,
    "currency": "USD"
  },
  "likelihood": {
    "label": "Typical",
    "score": 65
  },
  "confidence": {
    "label": "Medium",
    "score": 60
  },
  "drivers": [
    "Employment duration and position level",
    "Available documentation and evidence",
    "State-specific employment protections"
  ],
  "risks": [
    "Statute of limitations may apply",
    "Outcomes depend on specific facts"
  ],
  "nextSteps": [
    "Gather all relevant documentation",
    "Consult with an employment attorney",
    "Understand your state's statute of limitations"
  ],
  "disclaimer": "This estimate is for informational purposes only...",
  "cta": {
    "headline": "Want to discuss your situation?",
    "subheadline": "Connect with a specialist...",
    "buttonText": "Talk to a Specialist"
  }
}
```

### Contact Form Webhook

When a user submits the contact form, the app sends:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "sessionId": "uuid-v4-string"
}
```

## Project Structure

```
workerclaimlaw/
├── app/
│   ├── globals.css          # Global styles and Tailwind
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page with quiz
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── quiz.tsx             # Main quiz component
│   ├── results-display.tsx  # Results visualization
│   └── contact-modal.tsx    # Contact form modal
├── lib/
│   ├── questions.ts         # Quiz questions and logic
│   ├── types.ts             # TypeScript types
│   ├── api.ts               # Webhook submission
│   ├── storage.ts           # localStorage utilities
│   ├── analytics.ts         # Event tracking
│   └── utils.ts             # Utility functions
├── .env.local.example       # Environment variables template
├── package.json
└── README.md
```

## Customization

### Adding/Modifying Questions

Edit `lib/questions.ts` to add or modify quiz questions. The questions array supports:

- **choice** - Single selection from options (rendered as large buttons)
- **choice_multi** - Multiple selections
- **short_text** - Text input field
- **long_text** - Textarea
- **date_or_range** - Date or time period
- **state** - US state dropdown

Conditional logic is supported via `showIf`:

```typescript
{
  id: "follow_up",
  title: "Follow-up question",
  type: "short_text",
  required: true,
  showIf: {
    previous_question_id: ["specific_answer"]
  }
}
```

### Styling

The app uses Tailwind CSS with shadcn/ui's design tokens. Customize colors in:
- `app/globals.css` (CSS variables)
- `tailwind.config.ts` (Tailwind configuration)

### Analytics

Replace the console.log calls in `lib/analytics.ts` with your analytics service:

```typescript
export function trackEvent(event: AnalyticsEvent, data?: EventData) {
  // Replace with your analytics service
  // analytics.track(event, data);
  console.log("[Analytics]", { event, ...data });
}
```

## Error Handling

- **Webhook timeout**: 15-second timeout, falls back to mock estimate
- **Webhook failure**: Shows error screen with retry button
- **Network issues**: Graceful error handling with user feedback
- **Validation**: Inline error messages for required fields

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Uses localStorage (degrades gracefully if unavailable)

## License

Proprietary - All rights reserved

## Support

For issues or questions, please contact your development team.

# n8n Webhook Integration Guide

This guide explains how to set up n8n workflows to receive quiz submissions and generate estimates.

## Quiz Estimation Webhook

### Step 1: Create n8n Workflow

1. Create a new workflow in n8n
2. Add a **Webhook** node as the trigger
3. Configure webhook:
   - **Method**: POST
   - **Path**: `/webhook/estimate` (or your choice)
   - **Response Mode**: "When Last Node Finishes"

### Step 2: Incoming Payload Structure

Your webhook will receive this JSON:

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
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
    "what_happened": "I was terminated without warning...",
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

### Step 3: Processing Logic (Example)

Add nodes to process the data:

1. **Function Node** - Calculate estimate based on answers
2. **Set Node** - Format response
3. **HTTP Response Node** - Return result

Example Function Node code:

```javascript
// Simple estimation logic
const answers = $input.item.json.answers;

let lowEstimate = 10000;
let highEstimate = 50000;

// Adjust based on issue type
if (answers.issue_type.includes('Fired') || answers.issue_type.includes('quit')) {
  lowEstimate = 20000;
  highEstimate = 100000;
}

// Adjust for tenure
const tenure = answers.tenure;
if (tenure === '7+ years') {
  lowEstimate *= 1.5;
  highEstimate *= 1.5;
} else if (tenure === '3–7 years') {
  lowEstimate *= 1.2;
  highEstimate *= 1.2;
}

// Adjust for employer size
if (answers.employer_size === '1000+') {
  highEstimate *= 1.3;
}

// Check evidence
const hasEvidence = Array.isArray(answers.evidence)
  && answers.evidence.some(e => e !== 'Nothing yet' && e !== 'Not sure');

const reported = answers.reported === 'Yes';

return {
  json: {
    range: {
      low: Math.round(lowEstimate / 1000) * 1000,
      high: Math.round(highEstimate / 1000) * 1000,
      currency: "USD"
    },
    likelihood: {
      label: hasEvidence && reported ? "Higher than typical" : "Typical",
      score: hasEvidence && reported ? 75 : 50
    },
    confidence: {
      label: hasEvidence ? "High" : "Medium",
      score: hasEvidence ? 80 : 60
    },
    drivers: [
      "Employment duration and position level",
      hasEvidence ? "Available documentation" : "Limited documentation",
      `State-specific laws (${answers.where_state})`,
      "Type and severity of alleged violations"
    ],
    risks: [
      !hasEvidence ? "Limited documentation may weaken claim" : null,
      !reported ? "Failure to report internally may affect some claims" : null,
      "Statute of limitations varies by state",
      "Outcomes depend on specific facts and evidence"
    ].filter(r => r !== null),
    nextSteps: [
      "Gather all relevant documentation",
      "Document timeline while memory is fresh",
      "Consult with employment attorney in your state",
      "Avoid posting about situation on social media",
      "Understand your state's statute of limitations"
    ],
    disclaimer: "This estimate is for informational purposes only and does not constitute legal advice. Actual outcomes vary significantly based on specific facts, evidence, applicable law, and other factors. Consult with a licensed employment attorney to evaluate your specific situation.",
    cta: {
      headline: "Want to discuss your situation with a professional?",
      subheadline: "Connect with an employment law specialist who can review your case.",
      buttonText: "Talk to a Specialist"
    }
  }
};
```

### Step 4: Advanced Processing Options

You can enhance your workflow with:

- **Database Node** - Store submissions for analysis
- **Google Sheets Node** - Log all submissions
- **OpenAI Node** - Generate AI-powered analysis from `what_happened`
- **Email Node** - Notify your team of high-value leads
- **CRM Node** - Create contact in Salesforce/HubSpot
- **Conditional Logic** - Different responses based on state/issue type

### Step 5: Get Webhook URL

1. Activate your workflow
2. Copy the webhook URL (e.g., `https://your-n8n.app.n8n.cloud/webhook/estimate`)
3. Add it to your `.env.local` file:
   ```
   NEXT_PUBLIC_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/estimate
   ```

## Contact Form Webhook

### Simple Setup

1. Create a new workflow
2. Add **Webhook** node:
   - **Method**: POST
   - **Path**: `/webhook/contact`

3. Receive this payload:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

4. Add processing nodes:
   - **Email Node** - Send notification to your team
   - **CRM Node** - Create lead in your CRM
   - **Google Sheets Node** - Log contact info
   - **Slack Node** - Notify team in Slack

5. Return simple success response:
```javascript
return {
  json: {
    success: true
  }
};
```

## Tips & Best Practices

### Error Handling
Add **Error Trigger** node to handle failures gracefully.

### Rate Limiting
Consider adding rate limiting to prevent abuse.

### Data Validation
Add validation nodes to ensure data quality.

### Analytics
Store submissions in a database for analysis:
- Which states generate most submissions?
- Which issue types are most common?
- Conversion rate from estimate to contact

### AI Enhancement
Use OpenAI to analyze the `what_happened` narrative for:
- Sentiment analysis
- Key facts extraction
- Evidence strength assessment
- Preliminary legal theory identification

### Example: AI-Enhanced Workflow

```
Webhook → Function (basic calc) → OpenAI (analyze narrative)
→ Merge Data → Format Response → Return JSON
```

## Testing Your Webhook

### Use n8n's Test URL
n8n provides a test URL before activating. Use it to test:

```bash
curl -X POST https://your-test-url/webhook/estimate \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```

### Test Payload File
Create `test-payload.json`:

```json
{
  "sessionId": "test-123",
  "submittedAt": "2024-01-15T10:30:00.000Z",
  "answers": {
    "issue_type": "Fired / let go",
    "where_state": "California",
    "timeline_recent": "Last month",
    "still_employed": "No",
    "tenure": "3–7 years",
    "employer_size": "200–999",
    "pay_rate": "Salary",
    "pay_amount": "$85,000",
    "what_happened": "Test narrative",
    "reason_given": "Performance",
    "evidence": ["Emails/texts"],
    "reported": "Yes",
    "impact": ["Lost income"],
    "desired_outcome": "Compensation"
  },
  "meta": {
    "userAgent": "Test",
    "referrer": "",
    "path": "/",
    "version": "v1"
  }
}
```

## Troubleshooting

### Webhook not receiving data
- Check workflow is activated
- Verify URL in `.env.local`
- Check n8n logs for errors

### Response format errors
- Ensure all required fields are present
- Verify data types match schema
- Test with provided example above

### Timeout issues
- Ensure workflow completes within 15 seconds
- Optimize heavy operations
- Consider async processing for complex logic

## Next Steps

1. Set up basic estimation webhook
2. Test with quiz submissions
3. Add database storage
4. Integrate with your CRM
5. Add AI enhancement
6. Monitor and optimize

For more n8n help: https://docs.n8n.io/

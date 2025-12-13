import { EstimateResponse, SubmissionPayload, ContactFormData } from "./types";
import { trackEvent } from "./analytics";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;
const CONNECT_WEBHOOK_URL = process.env.NEXT_PUBLIC_CONNECT_WEBHOOK_URL;

/**
 * Submit quiz answers to webhook and get estimation response
 */
export async function submitToWebhook(
  payload: SubmissionPayload
): Promise<EstimateResponse> {
  trackEvent("submitted", { sessionId: payload.sessionId });

  // If no webhook URL is configured, use mock response
  if (!WEBHOOK_URL) {
    console.log("[API] No webhook URL configured, using mock response");
    return getMockEstimate(payload);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }

    const data = await response.json();

    // Handle OpenAI API response format (array with message.content)
    let parsedData = data;
    if (Array.isArray(data) && data[0]?.message?.content) {
      const messageContent = data[0].message.content;
      // Check if content is already an object or needs parsing
      parsedData = typeof messageContent === 'string' ? JSON.parse(messageContent) : messageContent;
    }

    trackEvent("received_estimate", { sessionId: payload.sessionId });

    return parsedData as EstimateResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("[API] Webhook timeout, falling back to mock");
      trackEvent("error_occurred", {
        error: "webhook_timeout",
        sessionId: payload.sessionId,
      });
      return getMockEstimate(payload);
    }

    trackEvent("error_occurred", {
      error: error instanceof Error ? error.message : "unknown",
      sessionId: payload.sessionId,
    });

    throw error;
  }
}

/**
 * Submit contact form to webhook
 */
export async function submitContact(
  data: ContactFormData
): Promise<{ success: boolean }> {
  trackEvent("contact_submitted", { sessionId: data.sessionId });

  if (!CONNECT_WEBHOOK_URL) {
    console.log("[API] Contact form data:", data);
    return { success: true };
  }

  try {
    const response = await fetch(CONNECT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Contact webhook responded with ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("[API] Contact submission failed:", error);
    throw error;
  }
}

/**
 * Generate a realistic mock estimate based on the submitted answers
 */
function getMockEstimate(payload: SubmissionPayload): EstimateResponse {
  const { answers } = payload;

  // Base estimate on compensation and timing
  let lowEstimate = 10000;
  let highEstimate = 50000;

  // Adjust based on annual compensation
  const compensation = answers.annual_compensation as string;
  if (compensation === "$150k+") {
    lowEstimate = 40000;
    highEstimate = 150000;
  } else if (compensation === "$100k–$150k") {
    lowEstimate = 30000;
    highEstimate = 100000;
  } else if (compensation === "$75k–$100k") {
    lowEstimate = 20000;
    highEstimate = 75000;
  } else if (compensation === "$50k–$75k") {
    lowEstimate = 15000;
    highEstimate = 50000;
  }

  // Adjust based on timing (temporal proximity is key for retaliation)
  const timing = answers.timing_of_change as string;
  if (timing === "Within 30 days") {
    lowEstimate *= 1.3;
    highEstimate *= 1.3;
  } else if (timing === "30–90 days") {
    lowEstimate *= 1.1;
    highEstimate *= 1.1;
  }

  // Adjust based on employer size (larger companies = higher settlements)
  const employerSize = answers.employer_size as string;
  if (employerSize === "1,000+") {
    highEstimate *= 1.4;
  } else if (employerSize === "200–1,000") {
    highEstimate *= 1.2;
  } else if (employerSize === "Under 10") {
    highEstimate *= 0.6;
  }

  // Round to nearest thousand
  lowEstimate = Math.round(lowEstimate / 1000) * 1000;
  highEstimate = Math.round(highEstimate / 1000) * 1000;

  // Determine likelihood and confidence based on evidence and actions
  const evidence = answers.evidence;
  const hasStrongEvidence = Array.isArray(evidence)
    ? evidence.some(e => ["Emails / Slack / texts", "HR complaints or tickets", "Performance reviews"].includes(e))
    : false;

  const actionsTaken = answers.actions_taken;
  const tookProtectedAction = Array.isArray(actionsTaken)
    ? actionsTaken.some(a => a !== "None of the above")
    : false;

  let likelihoodBand: "lower than typical" | "typical" | "higher than typical" = "typical";
  let confidenceLevel: "low" | "medium" | "high" = "medium";

  if (hasStrongEvidence && tookProtectedAction && timing === "Within 30 days") {
    likelihoodBand = "higher than typical";
    confidenceLevel = "high";
  } else if (!hasStrongEvidence || !tookProtectedAction) {
    likelihoodBand = "lower than typical";
    confidenceLevel = "low";
  }

  // Build explanation text
  let explanationText = `Based on the information provided, this situation shows `;

  if (tookProtectedAction && timing === "Within 30 days") {
    explanationText += "strong temporal proximity between protected activity and adverse action, which is a key indicator of potential retaliation. ";
  } else {
    explanationText += "some concerning elements, though the timeline and documentation could affect claim strength. ";
  }

  if (hasStrongEvidence) {
    explanationText += "The documented evidence you mentioned strengthens your position significantly. ";
  } else {
    explanationText += "Additional documentation would help establish a stronger case. ";
  }

  explanationText += `Cases like this in your compensation range typically settle between ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(lowEstimate)} and ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(highEstimate)}, though outcomes vary based on specific facts and jurisdiction.`;

  return {
    caseTier: confidenceLevel === "high" ? "A" : confidenceLevel === "medium" ? "B" : "C",
    settlementRange: {
      low: lowEstimate,
      high: highEstimate,
      currency: "USD",
    },
    confidence: {
      label: confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1),
      score: confidenceLevel === "high" ? 0.8 : confidenceLevel === "medium" ? 0.5 : 0.3,
    },
    clientSummary: explanationText,
    reasons: [
      "Temporal proximity between protected activity and adverse action",
      "Quality and quantity of documentary evidence",
      "Annual compensation and income impact",
      "Employer size and resources",
      "State-specific employment law protections",
    ],
    missingInfo: [
      !hasStrongEvidence ? "Additional documentation would strengthen the case" : null,
      "Detailed timeline of events with specific dates",
      "Copies of relevant emails, HR complaints, and performance reviews",
    ].filter((r): r is string => r !== null),
    nextSteps: [
      "Preserve all evidence immediately (emails, texts, documents)",
      "Create a detailed timeline of events with specific dates",
      "Consult with an employment attorney in your state",
      "Avoid discussing the situation on social media",
      "Research your state's statute of limitations for employment claims",
    ],
    disclaimer: "This is an informational estimate based on common patterns in workplace disputes, not legal advice. Outcomes and values vary widely by facts, documentation, and timing, and this does not determine eligibility or predict results.",
  };
}

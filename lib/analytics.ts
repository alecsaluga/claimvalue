/**
 * Simple analytics tracking for quiz events
 * In production, this could be replaced with actual analytics service
 */

export type AnalyticsEvent =
  | "start_quiz"
  | "completed_step"
  | "submitted"
  | "received_estimate"
  | "error_occurred"
  | "contact_submitted";

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, data?: EventData) {
  const timestamp = new Date().toISOString();
  const eventPayload = {
    event,
    timestamp,
    ...data,
  };

  console.log("[Analytics]", eventPayload);

  // In production, you would send this to your analytics service
  // e.g., analytics.track(event, eventPayload);
}

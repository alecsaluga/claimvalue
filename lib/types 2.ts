import { z } from "zod";

/**
 * Type definitions for the estimation response and submission
 */

export const estimateResponseSchema = z.object({
  caseTier: z.string(),
  settlementRange: z.object({
    low: z.number(),
    high: z.number(),
    currency: z.string().default("USD"),
  }),
  confidence: z.object({
    label: z.string(),
    score: z.number(),
  }),
  clientSummary: z.string(),
  reasons: z.array(z.string()).optional(),
  missingInfo: z.array(z.string()).optional(),
  nextSteps: z.array(z.string()).optional(),
  disclaimer: z.string().optional(),
});

export type EstimateResponse = z.infer<typeof estimateResponseSchema>;

export interface SubmissionPayload {
  sessionId: string;
  submittedAt: string;
  answers: Record<string, string | string[]>;
  meta: {
    userAgent: string;
    referrer: string;
    path: string;
    version: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  sessionId: string;
}

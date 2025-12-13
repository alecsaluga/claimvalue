import { Answers } from "./questions";

const STORAGE_KEY = "workplace_quiz_answers";
const SESSION_KEY = "workplace_quiz_session";

/**
 * LocalStorage utilities for persisting quiz state
 */

export function saveAnswers(answers: Answers): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch (error) {
    console.error("Failed to save answers to localStorage:", error);
  }
}

export function loadAnswers(): Answers {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load answers from localStorage:", error);
    return {};
  }
}

export function clearAnswers(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear answers from localStorage:", error);
  }
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  try {
    let sessionId = localStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      // Generate a simple UUID v4
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
  } catch (error) {
    console.error("Failed to get/create session ID:", error);
    return crypto.randomUUID();
  }
}

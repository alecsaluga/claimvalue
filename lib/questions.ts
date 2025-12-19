import { z } from "zod";

export type QuestionType =
  | "choice"
  | "choice_multi"
  | "short_text"
  | "long_text"
  | "date_or_range"
  | "state"
  | "dynamic_details";

export interface Question {
  id: string;
  title: string;
  help?: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
  required: boolean;
  showIf?: {
    [key: string]: string[];
  };
}

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

export const questions: Question[] = [
  {
    id: "where_state",
    title: "What state did this happen in?",
    help: "State laws can affect outcomes.",
    type: "state",
    required: true
  },
  {
    id: "what_changed",
    title: "How did this situation end?",
    help: "Select the option that best fits",
    type: "choice",
    options: [
      "I was fired or let go",
      "I resigned or felt forced to leave",
      "I was demoted or my pay was reduced",
      "I was written up, disciplined, or placed on a performance plan",
      "I'm still employed, but my job conditions worsened",
      "Nothing has happened yet"
    ],
    required: true
  },
  {
    id: "what_caused",
    title: "What do you believe caused this?",
    type: "choice_multi",
    options: [
      "I was treated unfairly or differently than others",
      "I was punished after speaking up or complaining",
      "I experienced harassment or misconduct at work",
      "I requested medical leave or an accommodation",
      "I was pressured to do something illegal or unethical",
      "I'm not sure — it just didn't feel right"
    ],
    required: true
  },
  {
    id: "cause_details",
    title: "Tell us more about what happened",
    type: "dynamic_details",
    required: true,
    showIf: {
      what_caused: [
        "I was treated unfairly or differently than others",
        "I was punished after speaking up or complaining",
        "I experienced harassment or misconduct at work",
        "I requested medical leave or an accommodation",
        "I was pressured to do something illegal or unethical",
        "I'm not sure — it just didn't feel right"
      ]
    }
  },
  {
    id: "personal_impact",
    title: "What has been the impact on you personally?",
    help: "Select all that apply",
    type: "choice_multi",
    options: [
      "Lost my home or faced foreclosure",
      "Lost my car or other vehicle",
      "Struggled to pay bills or went into debt",
      "Experienced anxiety, depression, or other mental health issues",
      "Had to seek medical or therapeutic treatment",
      "Damaged relationships with family or friends",
      "Lost health insurance or benefits",
      "Had to relocate or move",
      "None of the above"
    ],
    required: true
  },
  {
    id: "financial_losses",
    title: "Did you lose any of these?",
    help: "Select all that apply",
    type: "choice_multi",
    options: [
      "Bonus / commission",
      "Stock options / equity",
      "401k matching or retirement contributions",
      "Medical or therapy costs (out of pocket)",
      "Legal fees or other expenses",
      "None"
    ],
    required: true
  },
  {
    id: "similar_complaints",
    title: "To your knowledge, has your employer had similar complaints before?",
    type: "choice",
    options: ["Yes", "No", "Not sure"],
    required: true
  },
  {
    id: "protected_categories",
    title: "Do any of these apply to you?",
    help: "Select all that apply",
    type: "choice_multi",
    options: [
      "I am over 40 years old",
      "I have a disability or medical condition",
      "I am pregnant or recently gave birth",
      "I practice a specific religion",
      "I am a military veteran",
      "I am a minority",
      "I reported safety violations or illegal activity (whistleblower)",
      "None of the above"
    ],
    required: true
  },
  {
    id: "annual_compensation",
    title: "How much were you making?",
    type: "choice",
    options: [
      "Under $50k",
      "$50k–$75k",
      "$75k–$100k",
      "$100k–$150k",
      "$150k+"
    ],
    required: true
  },
  {
    id: "current_status",
    title: "What's your current employment status?",
    type: "choice",
    options: [
      "Still at current job",
      "Still unemployed",
      "New job, lower pay",
      "New job, similar pay",
      "New job, higher pay"
    ],
    required: true
  },
  {
    id: "employer_size",
    title: "How many employees does the company have?",
    help: "Best guess is fine",
    type: "choice",
    options: [
      "Under 10",
      "10–49",
      "50–199",
      "200–1,000",
      "1,000+"
    ],
    required: true
  }
];

// Validation schemas
export const answerSchema = z.record(z.union([z.string(), z.array(z.string())]));

export type Answers = z.infer<typeof answerSchema>;

// Determine which questions should be shown based on current answers
export function shouldShowQuestion(question: Question, answers: Answers): boolean {
  if (!question.showIf) return true;

  for (const [key, values] of Object.entries(question.showIf)) {
    const answer = answers[key];

    // Handle string answers
    if (typeof answer === "string" && values.includes(answer)) {
      return true;
    }

    // Handle multi-select answers
    if (Array.isArray(answer)) {
      // Check if any of the selected values match the showIf criteria
      const hasMatch = answer.some(selectedValue => values.includes(selectedValue));
      if (hasMatch) {
        return true;
      }
    }
  }

  return false;
}

// Get all visible questions based on current answers
export function getVisibleQuestions(answers: Answers): Question[] {
  return questions.filter(q => shouldShowQuestion(q, answers));
}

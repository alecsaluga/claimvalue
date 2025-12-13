"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2 } from "lucide-react";
import { questions, getVisibleQuestions, US_STATES, type Answers } from "@/lib/questions";
import { saveAnswers, loadAnswers, getOrCreateSessionId } from "@/lib/storage";
import { submitToWebhook } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { EstimateResponse } from "@/lib/types";
import { ResultsDisplay } from "./results-display";

export function Quiz() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentValue, setCurrentValue] = useState<string | string[]>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [submitError, setSubmitError] = useState(false);

  // Load saved answers on mount
  useEffect(() => {
    const saved = loadAnswers();
    if (Object.keys(saved).length > 0) {
      setAnswers(saved);
      trackEvent("start_quiz", { resumed: true });
    } else {
      trackEvent("start_quiz", { resumed: false });
    }
  }, []);

  // Get visible questions based on current answers
  const visibleQuestions = getVisibleQuestions(answers);
  const currentQuestion = visibleQuestions[currentStepIndex];
  const isLastQuestion = currentStepIndex === visibleQuestions.length - 1;
  const progress = ((currentStepIndex + 1) / visibleQuestions.length) * 100;

  // Set current value when navigating between questions
  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = answers[currentQuestion.id];
      setCurrentValue(savedAnswer || (currentQuestion.type === "choice_multi" ? [] : ""));
      setError("");
    }
  }, [currentQuestion, answers]);

  const handleNext = async () => {
    // Validate required field
    if (currentQuestion.required) {
      // Special validation for dynamic_details
      if (currentQuestion.type === "dynamic_details") {
        const detailsValue = typeof currentValue === 'object' && !Array.isArray(currentValue) ? currentValue : {};
        const savedAnswers = loadAnswers();
        const selectedCauses = savedAnswers.what_caused;

        if (Array.isArray(selectedCauses) && selectedCauses.length > 0) {
          // Check if all causes have at least the example field filled
          let hasError = false;
          let missingFields: string[] = [];

          for (const cause of selectedCauses) {
            const causeData = detailsValue[cause] || {};

            if (!causeData.example || (typeof causeData.example === 'string' && !causeData.example.trim())) {
              hasError = true;
              missingFields.push(`"${cause}" needs a description`);
            }
            if (!causeData.when) {
              hasError = true;
              missingFields.push(`"${cause}" needs a timeframe`);
            }
            if (!causeData.evidence || !Array.isArray(causeData.evidence) || causeData.evidence.length === 0) {
              hasError = true;
              missingFields.push(`"${cause}" needs evidence type`);
            }
          }

          if (hasError) {
            console.log("Validation failed:", missingFields);
            setError("Please complete all fields: " + missingFields[0]);
            return;
          }
        }
      } else if (
        !currentValue ||
        (Array.isArray(currentValue) && currentValue.length === 0) ||
        (typeof currentValue === "string" && currentValue.trim() === "")
      ) {
        setError("This field is required");
        return;
      }
    }

    // Save answer
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: currentValue,
    };
    setAnswers(updatedAnswers);
    saveAnswers(updatedAnswers);

    trackEvent("completed_step", {
      questionId: currentQuestion.id,
      step: currentStepIndex + 1,
      total: visibleQuestions.length,
    });

    setError("");

    // If last question, submit
    if (isLastQuestion) {
      await handleSubmit(updatedAnswers);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentValue("");
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setError("");
    }
  };

  const handleSubmit = async (finalAnswers: Answers) => {
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const sessionId = getOrCreateSessionId();

      const payload = {
        sessionId,
        submittedAt: new Date().toISOString(),
        answers: finalAnswers,
        meta: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          path: window.location.pathname,
          version: "v1",
        },
      };

      console.log("Submitting payload:", payload);

      const result = await submitToWebhook(payload);
      console.log("Received result:", result);
      setEstimate(result);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = async () => {
    await handleSubmit(answers);
  };

  // If we have results, show them
  if (estimate) {
    return <ResultsDisplay estimate={estimate} />;
  }

  // Show error state
  if (submitError) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Unable to Generate Estimate</h3>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t generate an estimate right now. Please try again.
          </p>
          <Button onClick={handleRetry} size="lg">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show submitting state
  if (isSubmitting) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Analyzing similar workplace situations…</h3>
          <p className="text-muted-foreground">
            Please wait while we generate your personalized estimate...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <Card className="w-full mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.1)] border-0 rounded-[12px]" id="quiz">
      <div className="px-8 md:px-10 py-12">
        <div className="mb-10">
          <Progress value={progress} className="mb-6" />
          <p className="text-sm font-[600] text-primary tracking-[-0.01em]">
            Question {currentStepIndex + 1} of {visibleQuestions.length}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl md:text-[32px] font-[700] mb-4 text-center leading-tight tracking-[-0.01em]">
            {currentQuestion.title}
          </h3>
          {currentQuestion.help && (
            <p className="text-base text-muted-foreground text-center font-[400] mt-4">
              {currentQuestion.help}
            </p>
          )}
        </div>

        <QuestionInput
          question={currentQuestion}
          value={currentValue}
          onChange={setCurrentValue}
          error={error}
        />

        <div className="flex gap-3 mt-10">
          {currentStepIndex > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="h-12 px-6 rounded-[8px] border border-[#e5e7eb] bg-white text-[#1a202c] font-[500] tracking-[-0.01em] transition-all duration-200 hover:bg-[#f9fafb] hover:-translate-y-[1px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="ml-auto h-12 px-10 rounded-[8px] bg-[#3b82f6] text-white font-[500] tracking-[-0.01em] shadow-[0_2px_4px_rgba(59,130,246,0.2)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
          >
            {isLastQuestion ? "Get My Estimate" : "Continue"}
          </button>
        </div>
      </div>
    </Card>
  );
}

interface QuestionInputProps {
  question: typeof questions[0];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}

function QuestionInput({ question, value, onChange, error }: QuestionInputProps) {
  const stringValue = typeof value === "string" ? value : "";
  const arrayValue = Array.isArray(value) ? value : [];

  if (question.type === "choice" && question.options) {
    // For 2-3 options, show them side by side
    const showSideBySide = question.options.length <= 3;

    return (
      <div className={showSideBySide ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}>
        {question.options.map((option) => {
          const isSelected = stringValue === option;
          return (
            <button
              key={option}
              type="button"
              className={`
                min-h-[56px] py-4 px-6 rounded-[8px] text-[16px] font-[500] tracking-[-0.01em]
                transition-all duration-200 ease-in-out
                ${showSideBySide ? "justify-center text-center" : "w-full text-left"}
                ${isSelected
                  ? "bg-[#3b82f6] text-white border-0 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
                  : "bg-white text-[#1a202c] border border-[#e5e7eb] hover:bg-[#f9fafb] hover:border-[#d1d5db] hover:-translate-y-[1px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                }
              `}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          );
        })}
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>
    );
  }

  if (question.type === "choice_multi" && question.options) {
    const toggleOption = (option: string) => {
      if (arrayValue.includes(option)) {
        onChange(arrayValue.filter((v) => v !== option));
      } else {
        onChange([...arrayValue, option]);
      }
    };

    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
        {question.options.map((option) => {
          const isSelected = arrayValue.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`
                w-full min-h-[56px] py-4 px-6 rounded-[8px] text-[16px] font-[500] tracking-[-0.01em] text-left
                transition-all duration-200 ease-in-out
                ${isSelected
                  ? "bg-[#3b82f6] text-white border-0 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
                  : "bg-white text-[#1a202c] border border-[#e5e7eb] hover:bg-[#f9fafb] hover:border-[#d1d5db] hover:-translate-y-[1px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                }
              `}
              onClick={() => toggleOption(option)}
            >
              {option}
            </button>
          );
        })}
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>
    );
  }

  if (question.type === "state") {
    return (
      <div className="space-y-2">
        <Select value={stringValue} onValueChange={onChange}>
          <SelectTrigger className="h-14 rounded-[8px] border-[#e5e7eb]">
            <SelectValue placeholder="Select a state..." />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>
    );
  }

  if (question.type === "date_or_range") {
    return (
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="e.g., March 2024, or 2-3 months ago"
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 rounded-[8px] border-[#e5e7eb] font-[500] tracking-[-0.01em]"
        />
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>
    );
  }

  if (question.type === "short_text") {
    return (
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Your answer..."
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 rounded-[8px] border-[#e5e7eb] font-[500] tracking-[-0.01em]"
        />
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>
    );
  }

  if (question.type === "long_text") {
    return (
      <div className="space-y-2">
        <Textarea
          placeholder={question.placeholder || "Share the key details here..."}
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] resize-none rounded-[8px] border-[#e5e7eb] font-[500] tracking-[-0.01em]"
        />
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>
    );
  }

  if (question.type === "dynamic_details") {
    return <DynamicDetailsInput question={question} value={value} onChange={onChange} error={error} />;
  }

  return null;
}

interface DynamicDetailsInputProps {
  question: typeof questions[0];
  value: string | string[];
  onChange: (value: any) => void;
  error?: string;
}

function DynamicDetailsInput({ question, value, onChange, error }: DynamicDetailsInputProps) {
  // Get the selected causes from previous question
  const [causes, setCauses] = useState<string[]>([]);

  useEffect(() => {
    const savedAnswers = loadAnswers();
    const selectedCauses = savedAnswers.what_caused;
    if (Array.isArray(selectedCauses)) {
      setCauses(selectedCauses);
    }
  }, []);

  // Initialize value structure if needed
  const detailsValue = typeof value === 'object' && !Array.isArray(value) ? value : {};

  const updateDetail = (cause: string, field: 'example' | 'when' | 'evidence', fieldValue: any) => {
    const updated = {
      ...detailsValue,
      [cause]: {
        ...(detailsValue[cause] || {}),
        [field]: fieldValue
      }
    };
    onChange(updated);
  };

  const timelineOptions = [
    "Last 30 days",
    "Within the last 3 months",
    "Within the last 6 months",
    "Within the last year",
    "More than a year ago",
    "More than 3 years ago"
  ];

  const evidenceOptions = [
    "Emails / Slack / texts",
    "HR complaints or tickets",
    "Performance reviews",
    "Medical or accommodation paperwork",
    "Witnesses",
    "Employer admissions",
    "None yet"
  ];

  return (
    <div className="space-y-8">
      {causes.map((cause, index) => {
        const causeData = detailsValue[cause] || {};
        return (
          <div key={cause} className="border border-[#e5e7eb] rounded-[12px] p-6 bg-white">
            <h3 className="font-[600] text-[18px] mb-2">
              You mentioned: {cause}
            </h3>
            <p className="text-[14px] text-muted-foreground mb-4">
              Can you share a specific example and more context?
            </p>

            {/* Example textarea */}
            <div className="mb-4">
              <Textarea
                placeholder="Describe what happened..."
                value={causeData.example || ''}
                onChange={(e) => updateDetail(cause, 'example', e.target.value)}
                className="min-h-[100px] resize-none rounded-[8px] border-[#e5e7eb] font-[500] tracking-[-0.01em]"
              />
            </div>

            {/* When dropdown */}
            <div className="mb-4">
              <label className="text-[14px] font-[600] mb-2 block">When did this happen?</label>
              <Select
                value={causeData.when || ''}
                onValueChange={(val) => updateDetail(cause, 'when', val)}
              >
                <SelectTrigger className="h-12 rounded-[8px] border-[#e5e7eb]">
                  <SelectValue placeholder="Select timeframe..." />
                </SelectTrigger>
                <SelectContent>
                  {timelineOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Evidence multi-select */}
            <div>
              <label className="text-[14px] font-[600] mb-2 block">What kind of evidence do you have?</label>
              <div className="space-y-2">
                {evidenceOptions.map((evidenceOption) => {
                  const selectedEvidence = causeData.evidence || [];
                  const isSelected = Array.isArray(selectedEvidence) && selectedEvidence.includes(evidenceOption);

                  return (
                    <button
                      key={evidenceOption}
                      type="button"
                      className={`
                        w-full min-h-[44px] py-3 px-4 rounded-[8px] text-[15px] font-[500] tracking-[-0.01em] text-left
                        transition-all duration-200 ease-in-out
                        ${isSelected
                          ? "bg-[#3b82f6] text-white border-0 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
                          : "bg-white text-[#1a202c] border border-[#e5e7eb] hover:bg-[#f9fafb] hover:border-[#d1d5db]"
                        }
                      `}
                      onClick={() => {
                        const currentEvidence = Array.isArray(causeData.evidence) ? causeData.evidence : [];
                        const newEvidence = isSelected
                          ? currentEvidence.filter(e => e !== evidenceOption)
                          : [...currentEvidence, evidenceOption];
                        updateDetail(cause, 'evidence', newEvidence);
                      }}
                    >
                      {evidenceOption}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      {error && <p className="text-sm text-destructive mt-3">{error}</p>}
    </div>
  );
}

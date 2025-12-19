"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";
import { submitContact } from "@/lib/api";
import { getOrCreateSessionId } from "@/lib/storage";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Name, email, and phone number are required");
      return;
    }

    // Simple email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return;
    }

    // Terms validation
    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        sessionId: getOrCreateSessionId(),
      });

      setIsSuccess(true);

      // Redirect to confirmation page after brief delay
      setTimeout(() => {
        onOpenChange(false);
        router.push("/confirmation");
      }, 1000);
    } catch (err) {
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect with a Specialist</DialogTitle>
          <DialogDescription>
            Share your contact info and we&apos;ll have someone reach out to discuss your situation.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
            <p className="text-muted-foreground">
              We&apos;ll be in touch shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone *
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300"
                disabled={isSubmitting}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-primary underline hover:no-underline"
                >
                  terms and conditions
                </button>
                {" "}and consent to an attorney reviewing my case and reaching out to me.
              </label>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        )}
      </DialogContent>

      {/* Terms and Conditions Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <h3 className="font-semibold text-base mb-2">1. Attorney Review and Contact</h3>
            <p className="text-sm text-muted-foreground mb-4">
              By submitting your information, you consent to have an attorney or legal professional review your case details and contact you via phone, email, or text message to discuss your potential claim.
            </p>

            <h3 className="font-semibold text-base mb-2">2. No Attorney-Client Relationship</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Submitting this form does not create an attorney-client relationship. An attorney-client relationship will only be established if you and the attorney enter into a written agreement.
            </p>

            <h3 className="font-semibold text-base mb-2">3. Case Evaluation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The estimate provided is for informational purposes only and does not guarantee any specific outcome or settlement amount. Each case is unique and results may vary.
            </p>

            <h3 className="font-semibold text-base mb-2">4. Privacy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your information will be kept confidential and used solely for the purpose of evaluating and discussing your potential legal claim.
            </p>

            <h3 className="font-semibold text-base mb-2">5. No Obligation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You are under no obligation to hire an attorney as a result of this consultation. You have the right to consult with other attorneys before making a decision.
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowTerms(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

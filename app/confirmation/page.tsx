"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    // Track conversion event for analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your actual conversion ID
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-12 text-center">
          <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-6" />

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Thank You!
          </h1>

          <p className="text-xl text-muted-foreground mb-6">
            Your information has been submitted successfully.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-lg mb-2">What happens next?</h2>
            <ul className="text-left space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <span>An attorney will review your case details within 24-48 hours</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>You&apos;ll receive a confirmation email with next steps</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💼</span>
                <span>A legal specialist will reach out to discuss your options</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Please check your email (including spam folder) for our confirmation message.
          </p>

          <Button
            size="lg"
            onClick={() => router.push("/")}
            className="min-w-[200px]"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

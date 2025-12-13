"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { EstimateResponse } from "@/lib/types";
import { ContactModal } from "./contact-modal";

interface ResultsDisplayProps {
  estimate: EstimateResponse;
}

export function ResultsDisplay({ estimate }: ResultsDisplayProps) {
  const [showContactModal, setShowContactModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: estimate.settlementRange.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Main Results Card with CTA */}
        <Card className="shadow-lg border-2 border-primary">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl md:text-4xl mb-2">
              Your Estimated Settlement Range
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Range Display */}
            <div className="text-center py-8 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-baseline gap-2">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    {formatCurrency(estimate.settlementRange.low)}
                  </span>
                </div>
                <span className="text-2xl text-muted-foreground">to</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    {formatCurrency(estimate.settlementRange.high)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* CTA Section */}
            <div className="text-center space-y-4 py-4">
              <h2 className="text-2xl md:text-3xl font-bold">
                Want to have it reviewed by a real attorney?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                No obligation — We have a network of highly qualified attorneys in your area who have collected millions in settlements for their clients.
              </p>
              <Button
                size="lg"
                className="gap-2 px-8"
                onClick={() => setShowContactModal(true)}
              >
                Click for a no-obligation review
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <Separator />

            {/* Client Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Summary</h3>
              <p className="text-muted-foreground leading-relaxed">
                {estimate.clientSummary}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              <strong>Important:</strong> {estimate.disclaimer || "This is not legal advice. This estimate is for educational purposes only and based on aggregated data from similar cases. Every situation is unique, and actual outcomes depend on specific facts, evidence, legal representation, and other factors."}
            </p>
          </CardContent>
        </Card>
      </div>

      <ContactModal
        open={showContactModal}
        onOpenChange={setShowContactModal}
      />
    </>
  );
}

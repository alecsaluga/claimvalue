"use client";

import Image from "next/image";
import { Quiz } from "@/components/quiz";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const scrollToQuiz = () => {
    const quizElement = document.getElementById("quiz");
    if (quizElement) {
      quizElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="ClaimValue"
              width={200}
              height={48}
              priority
              className="h-10 md:h-12 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Hero Section with Quiz */}
      <section className="container mx-auto px-4 pt-8 pb-12 md:pt-10 md:pb-16 max-w-[900px]">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-3xl md:text-[46px] font-[800] mb-2 md:mb-3 text-foreground leading-[1.2] tracking-tight">
            Understand What Your Workplace Situation Could Be Worth
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-[400]">
            Our estimator analyzes your case details and provides a personalized estimate based on thousands of similar cases.
          </p>

          {/* Attorney Review Badge */}
          <div className="mt-6 mb-4 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="text-3xl">⚖️</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Get Your Case Reviewed by an Attorney
                </h3>
              </div>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                After receiving your estimate, you can <span className="font-semibold text-blue-700">optionally</span> connect with a qualified attorney who can take your case—completely free to explore, with no obligation.
              </p>
              <p className="text-sm text-gray-600 italic">
                Note: Your contact info is not required to receive your settlement estimate.
              </p>
            </div>
          </div>
        </div>

        <Quiz />

        {/* Trust Badges */}
        <div className="mt-6 text-center">
          <p className="text-[15px] text-muted-foreground font-[400]">
            Take the quiz for free - it has only 13 questions. Phone/email and other personal info <span className="font-[700] text-foreground">IS NOT</span> required.
          </p>
        </div>
      </section>

      {/* How We're Different Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-[900px]">
          <div className="text-center mb-8">
            <h2 className="text-[28px] md:text-[32px] font-[700] mb-2">
              How We&apos;re Different
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#f8f9fb] rounded-[16px] p-6 text-left">
              <div className="text-[40px] mb-4">🛡️</div>
              <h3 className="font-[700] text-[18px] mb-3 text-[#2563eb]">No Pressure</h3>
              <p className="text-[15px] text-[#64748b] font-[400] leading-relaxed">
                Get information without obligation or spam.
              </p>
            </div>

            <div className="bg-[#f8f9fb] rounded-[16px] p-6 text-left">
              <div className="text-[40px] mb-4">🔒</div>
              <h3 className="font-[700] text-[18px] mb-3 text-[#2563eb]">No Personal Information Required</h3>
              <p className="text-[15px] text-[#64748b] font-[400] leading-relaxed">
                Get quotes instantly without sharing personal details.
              </p>
            </div>

            <div className="bg-[#f8f9fb] rounded-[16px] p-6 text-left">
              <div className="text-[40px] mb-4">⚖️</div>
              <h3 className="font-[700] text-[18px] mb-3 text-[#2563eb]">Simple, Honest, and Unbiased</h3>
              <p className="text-[15px] text-[#64748b] font-[400] leading-relaxed">
                Just a few quick questions that make sense for your situation.
              </p>
            </div>

            <div className="bg-[#f8f9fb] rounded-[16px] p-6 text-left">
              <div className="text-[40px] mb-4">⚡</div>
              <h3 className="font-[700] text-[18px] mb-3 text-[#2563eb]">Fast, Easy and Reliable Process</h3>
              <p className="text-[15px] text-[#64748b] font-[400] leading-relaxed">
                With just a few clicks, you can find the right answer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-[900px]">
          <div className="text-center mb-8">
            <h2 className="text-[28px] md:text-[32px] font-[700] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-muted-foreground font-[400]">
              Find answers to the most common questions about workplace claims
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="border border-border rounded-xl px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5 font-[600] text-[16px]">
                How accurate is this estimate?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-[15px] font-[400] leading-relaxed">
                Our estimates are based on historical case data, state-specific employment laws,
                and factors like evidence strength and employer size. However, every case is unique.
                The actual outcome depends on specific facts, evidence quality, legal representation,
                and other factors. This is an informational tool, not a guarantee.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-xl px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5 font-[600] text-[16px]">
                Is my information confidential?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-[15px] font-[400] leading-relaxed">
                Yes. We take privacy seriously. Your responses are used only to generate your
                estimate and are not shared with third parties without your explicit consent.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-xl px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5 font-[600] text-[16px]">
                Do I have to hire someone after getting my estimate?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-[15px] font-[400] leading-relaxed">
                Absolutely not. This tool is designed to help you understand your situation
                and options. There&apos;s no obligation whatsoever.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-xl px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5 font-[600] text-[16px]">
                How long do I have to take action?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-[15px] font-[400] leading-relaxed">
                Most workplace claims have statutes of limitations that vary by state and claim type.
                Some deadlines are as short as 180 days, while others may be several years.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border rounded-xl px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5 font-[600] text-[16px]">
                What types of workplace issues does this cover?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-[15px] font-[400] leading-relaxed">
                Our estimator covers wrongful termination, wage and hour violations, harassment,
                discrimination, retaliation, and denial of accommodations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6 text-center">
            <Button size="lg" onClick={scrollToQuiz} className="px-12">
              Start Comparing Quotes
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e4d7b] text-white py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center text-sm">
            <p className="mb-4 text-white/90">
              © {new Date().getFullYear()} Workplace Outcomes Estimator. For informational purposes only.
            </p>
            <p className="text-white/70 text-xs max-w-3xl mx-auto">
              This tool does not create an attorney-client relationship and should not be
              considered legal advice. Consult with a licensed attorney for your specific situation.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

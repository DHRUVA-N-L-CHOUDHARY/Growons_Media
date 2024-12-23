"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const RefundPolicyDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-medium hover:text-primary transition-colors underline cursor-pointer">
        Refund Policy
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Refund Policy
          </DialogTitle>
        </DialogHeader>
        <section className="mt-4 space-y-4">
          <p className="text-muted-foreground">
            <strong>Hassle-Free Refunds, Simplified</strong>
          </p>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Introduction:
            </h2>
            <DialogDescription>
              We aim to ensure our clients are completely satisfied with our
              services. If you&apos;re not entirely happy, we&apos;re here to make things
              right.
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Eligibility for Refunds:
            </h2>
            <DialogDescription>
              <ul className="list-disc pl-6 space-y-1">
                <li>Services not delivered as promised.</li>
                <li>Requests submitted within 24 hours.</li>
              </ul>
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Refund Process:
            </h2>
            <DialogDescription>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Submit your refund request to our WhatsApp support.</li>
                <li>
                  Include your service details and the reason for the refund.
                </li>
                <li>Refunds will be processed within 24 hours.</li>
              </ol>
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Exceptions:</h2>
            <DialogDescription>
              Please note that customized or completed projects may not qualify
              for refunds.
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Contact Details:
            </h2>
            <DialogDescription>
              For refund-related questions, contact us at
              growonsmedia@gmail.com.
            </DialogDescription>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default RefundPolicyDialog;

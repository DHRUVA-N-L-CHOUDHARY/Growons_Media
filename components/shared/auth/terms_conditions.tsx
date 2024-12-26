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

const TermsAndConditionsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-medium hover:text-primary transition-colors underline cursor-pointer">
        Terms & Conditions
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>
        <section className="mt-4 space-y-4">
          <p className="text-muted-foreground">
            <strong>Terms and Conditions of Service</strong>
          </p>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Introduction:</h2>
            <DialogDescription>
              Welcome to GrowOns Media! By using our website and services, you agree to the following terms and conditions.
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Scope of Services:</h2>
            <DialogDescription>
              GrowOns Media provides Meta services and lead generation to help businesses grow.
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">User Responsibilities:</h2>
            <DialogDescription>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the website ethically and legally.</li>
                <li>Provide accurate information for service delivery.</li>
              </ul>
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Limitations of Liability:</h2>
            <DialogDescription>
              <ul className="list-disc pl-6 space-y-1">
                <li>GrowOns Media is not liable for any indirect, incidental, or consequential damages.</li>
                <li>Delays or failures caused by external factors.</li>
              </ul>
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Payment Terms:</h2>
            <DialogDescription>
              All payments are due upon receipt of invoice unless otherwise agreed upon.
            </DialogDescription>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionsDialog;

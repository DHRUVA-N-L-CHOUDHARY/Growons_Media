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

const PrivacyPolicyDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-medium hover:text-primary transition-colors underline cursor-pointer">
        Privacy Policy
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Privacy Policy
          </DialogTitle>
        </DialogHeader>
        <section className="mt-4 space-y-4">
          <p className="text-muted-foreground">
            <strong>Your Privacy, Our Priority</strong>
          </p>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Introduction:</h2>
            <DialogDescription>
              At GrowOns Media, protecting your personal information is our top priority. This privacy policy outlines how we collect, use, and safeguard your data.
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Information We Collect:</h2>
            <DialogDescription>
              <ul className="list-disc pl-6 space-y-1">
                <li>Personal details such as name, email, and phone number.</li>
                <li>Usage data, including browsing behavior on our website.</li>
              </ul>
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">How We Use Data:</h2>
            <DialogDescription>
              <ul className="list-disc pl-6 space-y-1">
                <li>Improve our services and website.</li>
                <li>Communicate effectively with you regarding inquiries or updates.</li>
              </ul>
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Data Security:</h2>
            <DialogDescription>
              We implement robust security measures to keep your information safe and prevent unauthorized access.
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">User Rights:</h2>
            <DialogDescription>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access the information we hold about you.</li>
                <li>Request corrections or deletion of your data.</li>
              </ul>
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Contact Info:</h2>
            <DialogDescription>
              If you have questions about this privacy policy, please contact us. support@growonsmedia.com
            </DialogDescription>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyDialog;

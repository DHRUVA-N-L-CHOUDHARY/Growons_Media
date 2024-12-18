import React from "react";
import TopBar from "@/app/(protected)/_components/Topbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const generateMetadata = () => {
  return {
    title: "Refund Policy | GrowOns Media",
    description:
      "Learn about GrowOns Media's hassle-free and client-centric refund policy.",
  };
};

const RefundPolicyPage = () => {
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Refund Policy" />
      </div>
      <section className="mt-6 mx-4">
        <div className="container bg-card text-card-foreground rounded-lg shadow-md p-6 space-y-4">
          <h1 className="text-2xl font-bold text-primary">Refund Policy</h1>
          <p className="text-muted-foreground">
            <strong>Hassle-Free Refunds, Simplified</strong>
          </p>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Introduction:
            </h2>
            <p>
              We aim to ensure our clients are completely satisfied with our
              services. If youre not entirely happy, were here to make things
              right.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Eligibility for Refunds:
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Services not delivered as promised.</li>
              <li>Requests submitted within 24 hours.</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Refund Process:
            </h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Submit your refund request to our WhatsApp support.</li>
              <li>
                Include your service details and the reason for the refund.
              </li>
              <li>Refunds will be processed within 24 hours.</li>
            </ol>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Exceptions:</h2>
            <p>
              Please note that customized or completed projects may not qualify
              for refunds.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Contact Details:
            </h2>
            <p>
              For refund-related questions, contact us using the button below.
            </p>
            <Button className="font-medium" asChild>
              <Link href={`/support_policies/contact_us`}>Contact Us</Link>
            </Button>
          </section>
        </div>
      </section>
    </>
  );
};

export default RefundPolicyPage;

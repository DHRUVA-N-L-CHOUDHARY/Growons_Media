import React from "react";
import TopBar from "@/app/(protected)/_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Terms and Conditions | GrowOns Media",
    description: "Review the terms and conditions of GrowOns Media's services.",
  };
};

const TermsAndConditionsPage = () => {
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Terms and Conditions" />
      </div>
      <section className="mt-6 mx-4">
        <div className="container bg-card text-card-foreground rounded-lg shadow-md p-6 space-y-4">
          <h1 className="text-2xl font-bold text-primary">Terms and Conditions</h1>
          <p className="text-muted-foreground">
            <strong>Terms and Conditions of Service</strong>
          </p>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Introduction:</h2>
            <p>
              Welcome to GrowOns Media! By using our website and services, you agree to the following terms and conditions.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Scope of Services:</h2>
            <p>
              GrowOns Media provides Meta services and lead generation to help businesses grow.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">User Responsibilities:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the website ethically and legally.</li>
              <li>Provide accurate information for service delivery.</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Limitations of Liability:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>GrowOns Media is not liable for any indirect, incidental, or consequential damages.</li>
              <li>Delays or failures caused by external factors.</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Payment Terms:</h2>
            <p>
              All payments are due upon receipt of invoice unless otherwise agreed upon.
            </p>
          </section>
        </div>
      </section>
    </>
  );
};

export default TermsAndConditionsPage;

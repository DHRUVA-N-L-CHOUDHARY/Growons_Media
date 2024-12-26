import React from "react";
import TopBar from "@/app/(protected)/_components/Topbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const generateMetadata = () => {
  return {
    title: "Privacy Policy | GrowOns Media",
    description: "Learn how GrowOns Media collects, uses, and safeguards your data.",
  };
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Privacy Policy" />
      </div>
      <section className="mt-6 mx-4">
        <div className="container bg-card text-card-foreground rounded-lg shadow-md p-6 space-y-4">
          <h1 className="text-2xl font-bold text-primary">Privacy Policy</h1>
          <p className="text-muted-foreground">
            <strong>Your Privacy, Our Priority</strong>
          </p>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Introduction:</h2>
            <p>
              At GrowOns Media, protecting your personal information is our top priority. This privacy policy outlines how we collect, use, and safeguard your data.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Information We Collect:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Personal details such as name, email, and phone number.</li>
              <li>Usage data, including browsing behavior on our website.</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">How We Use Data:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Improve our services and website.</li>
              <li>Communicate effectively with you regarding inquiries or updates.</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Data Security:</h2>
            <p>
              We implement robust security measures to keep your information safe and prevent unauthorized access.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">User Rights:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the information we hold about you.</li>
              <li>Request corrections or deletion of your data.</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Contact Info:</h2>
            <p>
              If you have questions about this privacy policy, contact us using the button below.
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

export default PrivacyPolicyPage;

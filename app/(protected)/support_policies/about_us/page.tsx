import React from "react";
import TopBar from "@/app/(protected)/_components/Topbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";

export const generateMetadata = () => {
  return {
    title: "About Us | GrowOns Media",
    description:
      "Learn more about GrowOns Media and how we help businesses grow through innovative marketing solutions.",
  };
};

const AboutUsPage = async () => {
  const session = await auth();

  return (
    <>
      <div className="hidden md:block">
        <TopBar title="About Us" />
      </div>
      <section className="mt-6 mx-4">
        <div className="container bg-card text-card-foreground rounded-lg shadow-md p-6 space-y-4">
          <h1 className="text-2xl font-bold text-primary">About Us</h1>
          <p className="text-muted-foreground">
            <strong>Your Growth is Our Mission</strong>
          </p>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Introduction:
            </h2>
            <p>
              Welcome to GrowOns Media, a dynamic marketing agency dedicated to
              helping businesses grow through innovative solutions. We
              specialize in Meta services, lead generation, and many other
              services to ensure our clients achieve outstanding results.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">History:</h2>
            <p>
              Founded with a vision to redefine marketing, GrowOns Media has
              quickly become a trusted partner for businesses seeking scalable
              and impactful solutions.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Core Values:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Innovation:</strong> We embrace cutting-edge
                technologies and strategies.
              </li>
              <li>
                <strong>Customer Success:</strong> Your growth is at the heart
                of everything we do.
              </li>
              <li>
                <strong>Integrity:</strong> We believe in ethical, transparent,
                and results-driven practices.
              </li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">What We Do:</h2>
            <p>Our services focus on providing:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Meta services to enhance your online presence.</li>
              <li>Lead generation strategies to boost your business growth.</li>
            </ul>
          </section>
          <section className="mt-6 text-center">
            <Button className="font-medium" asChild>
              <Link href={`/orders/products/${session?.user?.id}`}>Discover our Services</Link>
            </Button>
          </section>
        </div>
      </section>
    </>
  );
};

export default AboutUsPage;

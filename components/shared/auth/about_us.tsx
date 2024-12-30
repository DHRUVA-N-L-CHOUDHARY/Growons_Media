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

const AboutUsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-medium hover:text-primary transition-colors underline cursor-pointer">
        About Us
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            About Us
          </DialogTitle>
        </DialogHeader>
        <section className="mt-4 space-y-4">
          <p className="text-muted-foreground">
            <strong>Your Growth is Our Mission</strong>
          </p>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Introduction:</h2>
            <DialogDescription>
              Welcome to GrowOns Media, a dynamic marketing agency dedicated to helping businesses grow through innovative solutions. We specialize in Meta services, lead generation, and many other services to ensure our clients achieve outstanding results.
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">History:</h2>
            <DialogDescription>
              Founded with a vision to redefine marketing, GrowOns Media has quickly become a trusted partner for businesses seeking scalable and impactful solutions.
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Core Values:</h2>
            <DialogDescription>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Innovation:</strong> We embrace cutting-edge technologies and strategies.
                </li>
                <li>
                  <strong>Customer Success:</strong> Your growth is at the heart of everything we do.
                </li>
                <li>
                  <strong>Integrity:</strong> We believe in ethical, transparent, and results-driven practices.
                </li>
              </ul>
            </DialogDescription>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">What We Do:</h2>
            <DialogDescription>
              <ul className="list-disc pl-6 space-y-1">
                <li>Meta services to enhance your online presence.</li>
                <li>Lead generation strategies to boost your business growth.</li>
              </ul>
            </DialogDescription>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default AboutUsDialog;

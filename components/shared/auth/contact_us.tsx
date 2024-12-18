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

const ContactUsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-medium hover:text-primary transition-colors underline cursor-pointer">
        Contact Us
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Contact Us
          </DialogTitle>
          <DialogDescription>
            <strong>Let&apos;s Connect and Grow Together!</strong>
          </DialogDescription>
        </DialogHeader>
        <section className="space-y-6 mt-4">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Introduction:</h2>
            <p>
              At GrowOns Media, we&apos;re always here to help your business thrive.
              Whether you have questions, need more details about our services,
              or are ready to get started, we&apos;d love to hear from you.
            </p>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Contact Details:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:growonsmedia@gmail.com"
                  className="text-primary underline"
                >
                  growonsmedia@gmail.com
                </a>
              </li>
              <li>
                <strong>Address:</strong> Gandhi Nagar, Delhi, India
              </li>
              <li>
                <strong>Instagram:</strong>{" "}
                <a
                  href="https://www.instagram.com/growonsmedia"
                  target="_blank"
                  className="text-primary underline"
                >
                  @growonsmedia
                </a>
              </li>
            </ul>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Support Hours:</h2>
            <p>
              Our team is available <strong>10am to 8pm</strong> to provide the support and guidance you need.
              Expect a response within 30 minutes.
            </p>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUsDialog;

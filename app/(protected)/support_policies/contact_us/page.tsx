import React from "react";
import TopBar from "@/app/(protected)/_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Contact Us | GrowOns Media",
    description:
      "Get in touch with GrowOns Media for any inquiries or to learn more about our services. Let's connect and grow together!",
  };
};

const ContactUsPage = () => {
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Contact Us" />
      </div>
      <section className="h-auto min-h-screen mt-6 mx-4">
        <div className="container bg-card text-card-foreground rounded-lg shadow-md p-6 space-y-6 min-h-[1200px] h-auto overflow-y-auto">
          <h1 className="text-2xl font-bold text-primary">Contact Us</h1>
          <p className="text-muted-foreground">
            <strong>Let’s Connect and Grow Together!</strong>
          </p>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              Introduction:
            </h2>
            <p>
              At GrowOns Media, we’re always here to help your business thrive.
              Whether you have questions, need more details about our services,
              or are ready to get started, we’d love to hear from you.
            </p>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              Contact Details:
            </h2>
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
            <h2 className="text-xl font-semibold text-primary">
              Contact Form:
            </h2>
            <p>
              Fill out the form below, and a member of our team will get back to
              you promptly.
            </p>
            <form className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full p-3 rounded-lg bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full p-3 rounded-lg bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <textarea
                name="message"
                rows={4}
                placeholder="Your Message"
                required
                className="w-full p-3 rounded-lg bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary/90"
              >
                Submit
              </button>
            </form>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              Support Hours:
            </h2>
            <p>
              Our team is available <strong>10am to 8pm</strong> to provide the
              support and guidance you need. Expect a response within 30
              minutes.
            </p>
          </section>
        </div>
      </section>
    </>
  );
};

export default ContactUsPage;

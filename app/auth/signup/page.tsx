import RegisterForm from "@/components/shared/auth/register-form";
import React from "react";
import Footer from "@/components/shared/footer";

export const generateMetadata = () => {
  return {
    title: "Signup | GrowonsMedia",
    description: "Signup to GrowonsMedia",
  };
};

const page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container flex flex-col items-center justify-center">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
};

export default page;

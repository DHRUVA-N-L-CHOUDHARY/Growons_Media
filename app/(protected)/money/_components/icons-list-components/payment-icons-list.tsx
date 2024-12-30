// components/PaymentIconsList.jsx
import React from "react";
import PaymentIcon from "./payment-icon";

const paymentOptions = [
  {
    src: "/svgs/icons/payment-icons/phonepe.svg",
    alt: "PhonePe",
    label: "PhonePe",
  },
  {
    src: "/svgs/icons/payment-icons/paytm.svg",
    alt: "Paytm",
    label: "Paytm",
  },
  {
    src: "/svgs/icons/payment-icons/googlepay.svg",
    alt: "Google Pay",
    label: "Google Pay",
  },
  {
    src: "/svgs/icons/payment-icons/bhim-upi.svg",
    alt: "BHIM UPI",
    label: "BHIM UPI",
  },
];

const PaymentIconsList = () => {
  return (
    <div className="m-6 flex gap-6 justify-center items-center">
      {paymentOptions.map((option, index) => (
        <PaymentIcon
          key={index}
          src={option.src}
          alt={option.alt}
          label={option.label}
          width={35}
          height={35}
        />
      ))}
    </div>
  );
};

export default PaymentIconsList;

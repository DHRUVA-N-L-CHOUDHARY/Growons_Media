import React, { useState } from "react";
import PaymentIcon from "./payment-icon";

const paymentOptions = [
  {
    src: "/svgs/icons/payment-icons/phonepe.svg",
    alt: "PhonePe",
    label: "PhonePe",
    extensions: ["@ybl", "@axl", "@phn"],
  },
  {
    src: "/svgs/icons/payment-icons/paytm.svg",
    alt: "Paytm",
    label: "Paytm",
    extensions: ["@paytm", "@ptm", "@payu"],
  },
  {
    src: "/svgs/icons/payment-icons/googlepay.svg",
    alt: "Google Pay",
    label: "Google Pay",
    extensions: ["@oksbi", "@okhdfc", "@gpay"],
  },
  {
    src: "/svgs/icons/payment-icons/bhim-upi.svg",
    alt: "BHIM UPI",
    label: "BHIM UPI",
    extensions: ["@upi", "@bhim", "@bharat"],
  },
];

interface UPIIconsListProps {
    onSelect: (extensions: string[]) => void; 
};   

const UPIIconsList : React.FC<UPIIconsListProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (option: {
    src?: string;
    alt?: string;
    label: any;
    extensions: any;
  }) => {
    setSelected(option.label);
    onSelect(option.extensions); // Pass the extensions of the selected option
  };

  return (
    <div className="m-6 flex gap-6 justify-center items-center">
      {paymentOptions.map((option, index) => (
        <div
          key={index}
          className={`cursor-pointer p-2 rounded-lg  ${
            selected === option.label ? "bg-primary text-white" : "bg-muted"
          }`}
          onClick={() => handleClick(option)}
        >
          <PaymentIcon
            src={option.src}
            alt={option.alt}
            label={option.label}
            width={40}
            height={35}
          />
        </div>
      ))}
    </div>
  );
};

export default UPIIconsList;

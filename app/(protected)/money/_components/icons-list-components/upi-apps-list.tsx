import React, { useState } from "react";
import PaymentIcon from "./payment-icon";

interface PaymentOption {
  src: string;
  alt: string;
  label: string;
  upiLink: string; // UPI link passed as a prop
}

interface UPIAppsListProps {
  paymentOptions: PaymentOption[]; // Accept an array of payment options with UPI links
  onSelect: (upiLink: string) => void;
}

const UPIAppsList: React.FC<UPIAppsListProps> = ({ paymentOptions, onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (option: PaymentOption) => {
    setSelected(option.label);
    onSelect(option.upiLink); // Pass the UPI link of the selected option
    window.location.href = option.upiLink; // Redirect to the UPI link
  };

  return (
    <div className="p-6 bg-card text-card-foreground">
      <div className="grid grid-cols-2 gap-6"> {/* Create a grid layout with 2 columns */}
        {paymentOptions.map((option, index) => (
          <div
            key={index}
            className={`cursor-pointer p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg ${
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
    </div>
  );
};

export default UPIAppsList;

import React from "react";
import { useQRCode } from "next-qrcode";
import PaymentIconsList from "./icons-list-components/payment-icons-list";

const DynamicQRCode = ({ intentLink }: { intentLink: string }) => {
  const { Canvas } = useQRCode();

  return (
    <div className="text-center flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold mb-4">Scan QR Code</h3>
      <div className="flex items-center justify-center">
        <Canvas
          text={intentLink}
          options={{
            errorCorrectionLevel: "M", // Error correction level
            width: 200,
            margin: 3,
          }}
        />
      </div>
      <PaymentIconsList />
    </div>
  );
};

export default DynamicQRCode;

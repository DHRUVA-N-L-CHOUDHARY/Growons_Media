import React from "react";
import Image from "next/image";

const PaymentIcon = ({
  src,
  alt,
  label,
  width = 40,
  height = 40,
}: {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}) => {
  return (
    <div className="text-center items-center">
      <Image src={src} alt={alt} width={width} height={height} />
      <p className="mt-2 text-sm">{label}</p>
    </div>
  );
};

export default PaymentIcon;

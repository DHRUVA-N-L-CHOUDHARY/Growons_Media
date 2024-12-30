import React from "react";
import Image from "next/image";
import AddMoneyForm from "../../_components/add-money";
import DownloadButton from "@/components/shared/download";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import TopBar from "@/app/(protected)/_components/Topbar";
import CopyButton from "@/components/shared/copy-button";
import PaymentGateway from "../../_components/payment-options";

export const generateMetadata = () => ({
  title: "Add Money | GrowonsMedia",
  description: "Add money to your account",
});

const ManualPaymentTopBar = () => <TopBar title="Add Money (Manual Method)" />;
const PaymentGatewayTopBar = () => <TopBar title="Add Money (Payment Gateway)" />;

const ManualPaymentSection = ({
  bankDetails,
  userId,
}: {
  bankDetails: any;
  userId: string;
}) => (
  <section className="mt-4 mx-2">
    <div className="flex flex-col-reverse md:flex-row">
      <div className="md:w-[50%]">
        <p>Scan the QR below:</p>
        {bankDetails && (
          <div className="flex flex-row items-center">
            <Image
              key={bankDetails.public_id}
              src={bankDetails.secure_url ?? ""}
              alt="QR-CODE"
              width={150}
              height={150}
              className="w-40 h-40 m-2"
            />
            <div className="flex flex-col">
              <div>
                <span className="block">UPI ID:</span>
                <span className="font-semibold border-2 border-black p-1 rounded-lg flex items-center gap-x-2 justify-between">
                  {bankDetails?.upiid}
                  <CopyButton text={bankDetails.upiid} />
                </span>
              </div>
              <div>
                <span className="block">UPI Number:</span>
                <span className="font-semibold border-2 border-black p-1 rounded-lg flex items-center gap-x-2 justify-between">
                  {bankDetails?.upinumber}
                  <CopyButton text={bankDetails.upinumber} />
                </span>
              </div>
            </div>
          </div>
        )}
        <DownloadButton imageLink={bankDetails?.secure_url ?? ""} />
        <AddMoneyForm userId={userId} bankDetails={bankDetails} />
      </div>
      <div className="md:w-[50%]">
        <p className="font-bold font-2xl mb-2">Bank Details :</p>
        <div className="flex items-center flex-wrap">
          <span>Name:</span>
          <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
            {bankDetails?.name}
            {bankDetails && <CopyButton text={bankDetails.name} />}
          </span>
        </div>
        <div className="flex items-center">
          <span>IFSC Code:</span>
          <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
            {bankDetails?.ifsccode}
            {bankDetails && <CopyButton text={bankDetails.ifsccode} />}
          </span>
        </div>
        <div className="flex items-center">
          <span>Account type:</span>
          <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
            {bankDetails?.accountType}
            {bankDetails && <CopyButton text={bankDetails.accountType} />}
          </span>
        </div>
        <div className="flex items-center">
          <span>Bank Name:</span>
          <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
            {bankDetails?.bankName}
            {bankDetails && <CopyButton text={bankDetails.bankName} />}
          </span>
        </div>
        <div className="flex items-center">
          <span>Account Number:</span>
          <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
            {bankDetails?.accountDetails}
            {bankDetails && <CopyButton text={bankDetails.accountDetails} />}
          </span>
        </div>
      </div>
    </div>
  </section>
);

const PaymentGatewaySection = ({
  isMobile,
  userId,
  bankDetails,
}: {
  isMobile: boolean;
  userId: string;
  bankDetails: any;
}) => (
  <>
    <PaymentGateway
      isMobile={isMobile}
      userId={userId}
      bankDetails={bankDetails}
    />
  </>
);

const page = async ({ params }: { params: { id: string } }) => {
  const headersInstance = headers();
  const userAgent = headersInstance.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

  const userDetails = await db.user.findUnique({
    where: { id: params.id.toString() },
    select: { paymentType: true },
  });

  const bankDetails = await db.bankDetails.findFirst({
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  const paymentType = userDetails?.paymentType;

  return (
    <>
      {paymentType === "MANUAL" ? (
        <>
          <div className="hidden md:block">
            <ManualPaymentTopBar />
          </div>
          <ManualPaymentSection
            bankDetails={bankDetails}
            userId={params.id.toString()}
          />
        </>
      ) : (
        <>
          <div className="hidden md:block">
            <PaymentGatewayTopBar />
          </div>
          <PaymentGatewaySection
            isMobile={isMobile}
            userId={params.id.toString()}
            bankDetails={bankDetails}
          />
        </>
      )}
    </>
  );
};

export default page;

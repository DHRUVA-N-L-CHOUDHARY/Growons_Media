"use client";
import React, { useState } from "react";
import { FaQrcode, FaAt } from "react-icons/fa";
import DynamicQRCode from "./dynamic-qr";
import EnterUpiId from "./upi-id-form";
import UPIAppsList from "./icons-list-components/upi-apps-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { PaymentSchema } from "@/schemas";
import {
  createPaymentRequest,
  checkPaymentStatus,
} from "@/actions/make-payment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type BankDetailsProps = {
  upiid: string;
  upinumber: string;
  accountDetails: string;
  ifsccode: string;
  name: string;
  bankName: string;
  accountType: string;
  userId: string;
} | null;

type PaymentGatewayProps = {
  isMobile: boolean;
  userId: string;
  bankDetails: BankDetailsProps;
};

const PaymentGateway = ({
  isMobile,
  userId,
  bankDetails,
}: PaymentGatewayProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [paymentLinks, setPaymentLinks] = useState({
    intent: "",
    gpay: "",
    paytm: "",
    dynamicQR: "",
  });
  const [merchantReferenceId, setMerchantReferenceId] = useState<string | null>(
    null
  );
  const [isCheckStatusEnabled, setIsCheckStatusEnabled] = useState(false);

  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof PaymentSchema>) => {
    setIsPending(true);
    try {
      const paymentRequestData = new FormData();
      paymentRequestData.set("amount", values.amount.toString());
      paymentRequestData.set("userId", userId);
      paymentRequestData.set("upiid", bankDetails?.upiid ?? "");
      paymentRequestData.set(
        "accountNumber",
        bankDetails?.accountDetails ?? ""
      );
      await createPaymentRequest(paymentRequestData).then((data) => {
        if (data?.success) {
          const paymentLinks = data.paymentLinks;
          const merchantReferenceId = data.merchantReferenceId;
          setMerchantReferenceId(merchantReferenceId);
          setPaymentLinks({
            intent: paymentLinks?.intent,
            gpay: paymentLinks?.gpay,
            paytm: paymentLinks?.paytm,
            dynamicQR: paymentLinks?.dynamicQR,
          });
          setIsCheckStatusEnabled(true);
          toast.success(data?.success);
        }
        if (data?.error) {
          toast.error(data?.error);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const checPaymentStatus = async () => {
    if (!merchantReferenceId) {
      toast.error("No reference ID available to check the status.");
      return;
    }

    try {
      setIsPending(true);
      console.log(merchantReferenceId);
      await checkPaymentStatus(merchantReferenceId, userId).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          window.location.reload();
        }
        if (data?.error) {
          toast.error(data?.error);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while checking the status.");
    } finally {
      setIsPending(false);
    }
  };

  const paymentOptions = [
    {
      src: "/svgs/icons/payment-icons/googlepay.svg",
      alt: "Google Pay",
      label: "Google Pay",
      upiLink:
        paymentLinks?.gpay ||
        "upi://pay?pa=example@gpay&pn=MerchantName&am=100&cu=INR",
    },
    {
      src: "/svgs/icons/payment-icons/paytm.svg",
      alt: "Paytm",
      label: "Paytm",
      upiLink:
        paymentLinks?.paytm ||
        "upi://pay?pa=example@paytm&pn=MerchantName&am=100&cu=INR",
    },
    {
      src: "/svgs/icons/payment-icons/bhim-upi.svg",
      alt: "BHIM UPI",
      label: "BHIM UPI",
      upiLink:
        paymentLinks?.intent ||
        "upi://pay?pa=example@bhim&pn=MerchantName&am=100&cu=INR",
    },
  ];
  return (
    <div>
      {isMobile === false ? (
        <section className="mt-4 mx-2">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-[50%]">
              <section className="md:overflow-auto md:max-h-[55vh] w-full p-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3 my-2 md:mt-10"
                  >
                    <div className="space-y-2 p-2">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enter the amount</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                disabled={isPending || isCheckStatusEnabled}
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      disabled={isPending || isCheckStatusEnabled}
                      type="submit"
                      className="w-full md:mb-0"
                    >
                      Proceed to Pay
                    </Button>
                  </form>
                </Form>
              </section>
            </div>
            {isCheckStatusEnabled && (
              <div className="md:w-[50%]">
                <DesktopPaymentGateway
                  dynamicQRLink={paymentLinks.dynamicQR}
                  userId={userId}
                />

                <div className="mt-4 max-w-lg mx-10">
                  <Button
                    onClick={checPaymentStatus}
                    disabled={isPending}
                    className="w-full"
                  >
                    Check Payment Status
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="mt-4 mx-2">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-[50%]">
              <section className="md:overflow-auto md:max-h-[55vh] w-full p-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3 my-2 md:mt-10"
                  >
                    <div className="space-y-2 p-2">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enter the amount</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                disabled={isPending || isCheckStatusEnabled}
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      disabled={isPending || isCheckStatusEnabled}
                      type="submit"
                      className="w-full md:mb-0"
                    >
                      Proceed to Pay
                    </Button>
                  </form>
                </Form>
              </section>
            </div>
            {isCheckStatusEnabled  && (
              <div className="md:w-[50%]">
                <MobilePaymentGateway
                  paymentOptions={paymentOptions}
                  userId={userId}
                />
                <div className="mt-4 max-w-lg md:mx-10">
                  <Button
                    onClick={checPaymentStatus}
                    disabled={isPending}
                    className="w-full"
                  >
                    Check Payment Status
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

const MobilePaymentGateway = ({
  paymentOptions,
  userId,
}: {
  paymentOptions: any;
  userId: string;
}) => {
  const [selectedOption, setSelectedOption] = useState<"qr" | "upi" | null>(
    null
  );
  const handleUPISelect = (upiLink: string) => {
    console.log("Selected UPI Link:", upiLink);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-center mb-4">
        Select Your Payment Option
      </h2>
      <div className="flex flex-col gap-4">
        <div className="w-full border border-border rounded-lg overflow-hidden">
          <div
            className={`bg-secondary text-secondary-foreground p-4 cursor-pointer font-semibold hover:bg-secondary-foreground hover:text-secondary transition flex items-center gap-2"`}
            onClick={() =>
              setSelectedOption(selectedOption === "qr" ? null : "qr")
            }
          >
            <FaQrcode className="text-xl" />
            <span>UPI Apps</span>
          </div>
          {selectedOption === "qr" && (
            <div className="mt-2">
              <UPIAppsList
                paymentOptions={paymentOptions}
                onSelect={handleUPISelect}
              />
            </div>
          )}
        </div>
        {/* <div className="w-full border border-border rounded-lg overflow-hidden">
          <div
            className={`bg-secondary text-secondary-foreground p-4 cursor-pointer font-semibold hover:bg-secondary-foreground hover:text-secondary transition flex items-center gap-2"`}
            onClick={() =>
              setSelectedOption(selectedOption === "upi" ? null : "upi")
            }
          >
            <FaAt className="text-xl" />
            <span>Enter UPI ID</span>
          </div>
          {selectedOption === "upi" && (
            <div className="mt-2">
              <EnterUpiId userId={userId} />
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

const DesktopPaymentGateway = ({
  dynamicQRLink,
  userId,
}: {
  dynamicQRLink: string;
  userId: string;
}) => {
  const [expandedSection, setExpandedSection] = useState<"qr" | "upi" | null>(
    null
  );
  const [upiId, setUpiId] = useState("");

  const intentLink = dynamicQRLink;

  return (
    <div className="w-full items-center">
      <p className="text-xl mb-10">Select your preferred payment option:</p>
      <div className="space-y-6 flex flex-col">
        <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden mx-10">
          <div
            className="bg-secondary text-secondary-foreground p-4 cursor-pointer font-semibold hover:bg-secondary-foreground hover:text-secondary transition flex items-center gap-2"
            onClick={() =>
              setExpandedSection(expandedSection === "qr" ? null : "qr")
            }
          >
            <FaQrcode className="text-2xl" />
            Dynamic QR Code
          </div>
          {expandedSection === "qr" && (
            <DynamicQRCode intentLink={intentLink} />
          )}
        </div>

        {/* <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden mx-10">
          <div
            className="bg-secondary text-secondary-foreground p-4 cursor-pointer font-semibold hover:bg-secondary-foreground hover:text-secondary transition flex items-center gap-2"
            onClick={() =>
              setExpandedSection(expandedSection === "upi" ? null : "upi")
            }
          >
            <FaAt className="text-2xl" />
            Enter UPI ID
          </div>
          {expandedSection === "upi" && <EnterUpiId userId={userId} />}
        </div> */}
      </div>
    </div>
  );
};

export default PaymentGateway;

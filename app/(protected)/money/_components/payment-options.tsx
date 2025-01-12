"use client";
import React, { useCallback, useEffect, useState } from "react";
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

  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const calculateTimeLimit = (expiry: string) => new Date(expiry);

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
      await createPaymentRequest(paymentRequestData).then((data) => {
        if (data?.success) {
          const paymentLinks = data.paymentLinks;
          const merchantReferenceId = data.merchantReferenceId;
          const expiry = data.expiry;
          setMerchantReferenceId(merchantReferenceId);
          setPaymentLinks({
            intent: paymentLinks?.intent,
            gpay: paymentLinks?.gpay,
            paytm: paymentLinks?.paytm,
            dynamicQR: paymentLinks?.dynamicQR,
          });
          setExpiryTime(calculateTimeLimit(expiry));
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

  const checPaymentStatus = useCallback(async () => {
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
        else if(data?.error){
          console.error(data?.error);
          toast.error(data?.error);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while checking the status.");
    } finally {
      setIsPending(false);
    }
  }, [merchantReferenceId, userId]);

  const startPeriodicCheck = useCallback(async () => {
    const endTime = expiryTime || new Date(Date.now() + 4 * 60 * 1000);
    while (isCheckStatusEnabled && new Date() < endTime) {
      try {
        await checPaymentStatus();
      } catch (error) {
        console.error("Error in periodic check:", error);
      }
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }
  }, [isCheckStatusEnabled, expiryTime, checPaymentStatus]);

  useEffect(() => {
    if (isCheckStatusEnabled) {
      startPeriodicCheck();
    }
  }, [isCheckStatusEnabled, startPeriodicCheck]);

  useEffect(() => {
    if (!expiryTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = expiryTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("Time Expired");
        setIsCheckStatusEnabled(false);
        toast.error("Payment Request Timed Out!");
        window.location.reload();
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

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
                      {isCheckStatusEnabled && (
                        <div className="p-3 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500 rounded-md shadow">
                          <p className="text-sm font-semibold">
                          Please stay on this page for 40 seconds after completing the payment to allow for processing. If you happen to leave the page, don’t worry! Your payment will be processed, and the amount will be credited to your wallet within 20 minutes upon confirmation. Thank you!
                          </p>
                        </div>
                      )}
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
                {expiryTime && (
                  <div className="mx-6 mb-6 mt-4 flex justify-end items-center">
                    <div className="p-3 bg-secondary text-secondary-foreground rounded-lg shadow-lg border border-primary flex items-center space-x-2">
                      <p className="text-sm font-bold">Time Remaining:</p>
                      <p className="text-lg font-semibold">{timeLeft}</p>
                    </div>
                  </div>
                )}

                <DesktopPaymentGateway
                  dynamicQRLink={paymentLinks.dynamicQR}
                  userId={userId}
                />

                {/* <div className="mt-4 max-w-lg mx-10">
                  <Button
                    onClick={checPaymentStatus}
                    disabled={isPending}
                    className="w-full"
                  >
                    Check Payment Status
                  </Button>
                </div> */}
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
                    {isCheckStatusEnabled && (
                        <div className="p-3 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500 rounded-md shadow">
                          <p className="text-sm font-semibold">
                          Please stay on this page for 40 seconds after completing the payment to allow for processing. If you happen to leave the page, don’t worry! Your payment will be processed, and the amount will be credited to your wallet within 20 minutes upon confirmation. Thank you!
                          </p>
                        </div>
                      )}
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
                {expiryTime && (
                  <div className="mx-6 my-6 flex justify-center items-center">
                    <div className="p-3 bg-secondary text-secondary-foreground rounded-lg shadow-lg border border-primary flex items-center space-x-2">
                      <p className="text-sm font-bold">Time Remaining:</p>
                      <p className="text-lg font-semibold">{timeLeft}</p>
                    </div>
                  </div>
                )}

                <MobilePaymentGateway
                  paymentOptions={paymentOptions}
                  userId={userId}
                />
                {/* <div className="mt-4 max-w-lg md:mx-10">
                  <Button
                    onClick={checPaymentStatus}
                    disabled={isPending}
                    className="w-full"
                  >
                    Check Payment Status
                  </Button>
                </div> */}
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

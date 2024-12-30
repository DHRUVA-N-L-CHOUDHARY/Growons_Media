"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { MoneySchema, PaymentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  createPaymentRequest,
  checkPaymentStatus,
  AddMoney,
} from "@/actions/make-payment";

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

type MakePaymentFormProps = {
  userId: string;
  bankDetails: BankDetailsProps;
};

const MakePaymentForm = ({ userId, bankDetails }: MakePaymentFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async () => {
    setIsPending(true);

    try {
      const paymentRequestData = new FormData();
      paymentRequestData.set("amount", "10");
      paymentRequestData.set("userId", userId);
      const paymentResponse = await createPaymentRequest(paymentRequestData);
      if (paymentResponse.error) {
        toast.error(paymentResponse.error);
        setIsPending(false);
        return;
      }

      const { merchantReferenceId, paymentLinks } = paymentResponse;

      toast.info("Redirecting to payment gateway...");
      console.log(paymentLinks?.intent);
      console.log(paymentLinks?.gpay);
      console.log(paymentLinks?.paytm);
      console.log(paymentLinks?.dynamicQR);

      
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
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
                      disabled={isPending}
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} type="submit" className="w-full md:mb-0">
            Proceed to Pay
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default MakePaymentForm;

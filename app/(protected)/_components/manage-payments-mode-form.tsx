"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { ManagePaymentModeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormError } from "@/components/shared/form-error";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  modifyPaymentMode,
  refereshMerchantToken,
} from "@/actions/admin-manage-payment-mode";

const ManagePaymentModeForm = ({ userId }: { userId: string }) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const form = useForm<z.infer<typeof ManagePaymentModeSchema>>({
    resolver: zodResolver(ManagePaymentModeSchema),
    defaultValues: {
      paymentType: "",
      userId: userId,
    },
  });

  function onSubmit(values: z.infer<typeof ManagePaymentModeSchema>) {
    setError("");
    startTransition(() => {
      modifyPaymentMode(values).then((data) => {
        console.log(values.userId);
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    });
  }

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const result = await refereshMerchantToken();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "Token refreshed successfully.");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"link"}>Edit Mode</Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
        <SheetTitle>
          <p className="text-2xl font-bold">Edit Payment Mode</p>
        </SheetTitle>
        <Separator className="border border-gray-500" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isPending}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Type" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {[
                        {
                          key: "PAYMENT_GATEWAY",
                          value: "Payment Gateway",
                        },
                        {
                          key: "MANUAL",
                          value: "Manual",
                        },
                      ].map((product) => {
                        return (
                          <SelectItem
                            value={product.value}
                            key={product.key}
                            className="capitalize"
                          >
                            {product.value}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormError message={error} />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full md:mb-0"
            >
              Modify Payment Mode
            </Button>
          </form>
        </Form>
        <Button
          disabled={isRefreshing}
          onClick={handleRefreshToken}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {isRefreshing ? "Refreshing..." : "Refresh Token"}
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default ManagePaymentModeForm;

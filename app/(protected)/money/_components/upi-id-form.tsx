"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import UPIIconsList from "./icons-list-components/upi-icons-list";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCollectRequest } from "@/actions/make-payment";
import { UpiFormSchema } from "@/schemas";

const EnterUpiId = ({ userId }: { userId: string }) => {
  const [isPending, setIsPending] = useState(false);
  const [upiExtensions, setUpiExtensions] = useState<string[]>(["@ybl"]);
  const form = useForm<z.infer<typeof UpiFormSchema>>({
    resolver: zodResolver(UpiFormSchema),
    defaultValues: {
      upiId: "",
    },
  });

  const handleIconSelect = (extensions: string[]) => {
    setUpiExtensions(extensions);
  };

  const onSubmit = async (values: z.infer<typeof UpiFormSchema>) => {
    setIsPending(true);
    const fullUpiId = `${values.upiId}${upiExtensions[0]}`;
    const formData = new FormData();
    console.log(userId);
    console.log(fullUpiId);
    formData.append("userId", userId);
    formData.append("amount", "10");
    formData.append("vpa", fullUpiId);

    try {
      const response = await createCollectRequest(formData);

      if (response?.success) {
        toast.success(response.success);
        form.reset();
      } else {
        toast.error(response?.error || "Failed to create collect request");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-6 bg-card text-card-foreground">
      <h3 className="text-lg font-bold mb-4">Enter UPI ID</h3>
      <UPIIconsList onSelect={handleIconSelect} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="upiId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPI ID</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="Enter UPI ID"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <select
                    value={upiExtensions[0]}
                    onChange={(e) => setUpiExtensions([e.target.value])}
                    className="px-4 py-2 bg-muted text-muted-foreground rounded-lg"
                  >
                    {upiExtensions.map((extension) => (
                      <option key={extension} value={extension}>
                        {extension}
                      </option>
                    ))}
                  </select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit" className="w-full md:mb-0">
            Submit Request
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EnterUpiId;

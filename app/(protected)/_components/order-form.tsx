"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OrderSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/shared/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const OrderForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      product: "",
      quantity: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof OrderSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      console.log(values);
    });
  };

  const handleAddMore = () => {
    form.setValue("quantity", form.getValues("quantity") + 10);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-[100%] md:w-[50%]"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fresh Leads">Fresh leads</SelectItem>
                      <SelectItem value="old Leads">Old leads</SelectItem>
                      <SelectItem value="fresh Female Leads">
                        Fresh female leads
                      </SelectItem>
                      <SelectItem value="apna app leads">
                        App apna leads
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button onClick={handleAddMore} className="flex items-center gap-1">
              <Image src={"/svgs/plus.svg"} alt="plus" width={20} height={20} />
              Add More
            </Button>
          </div>
          <FormError message={error} />
          <Button type="submit" disabled={isPending} className="w-full">
            Request Order
          </Button>
        </form>
      </Form>
    </>
  );
};

export default OrderForm;

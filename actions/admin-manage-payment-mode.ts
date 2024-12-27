"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { ManagePaymentModeSchema } from "@/schemas";
import { z } from "zod";
import axios from "axios";

export const modifyPaymentMode = async (
  values: z.infer<typeof ManagePaymentModeSchema>
) => {
  const validatedFields = ManagePaymentModeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { userId, paymentType } = validatedFields.data;

  console.log(userId);

  const user = await getUserById(userId);

  console.log(user);

  if (!user) {
    return { error: "User not found!" };
  }

  if (user.role !== "ADMIN") {
    return { error: "User is not an admin!" };
  }

  try {
    await db.user.updateMany({
      data: {
        paymentType:
          paymentType === "PAYMENT GATEWAY" ? "PAYMENT_GATEWAY" : "MANUAL",
      },
    });

    return { success: "Payment type updated for all users successfully" };
  } catch (error) {
    console.error("Error updating payment type:", error);
    return { error: "Failed to update payment type for all users" };
  }
};

export const refereshMerchantToken = async () => {
  const requestPayload = {
    mid: "GROWONSMED",
    password: "G^%65fg^&fh3",
  };

  try {
    const response = await axios.post(
      "https://server.paygic.in/api/v2/createMerchantToken",
      requestPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const tokenResponse = response.data;

    if (!tokenResponse.status) {
      return {
        error: tokenResponse.msg || "Failed to create token. Please try again.",
      };
    }

    const { token, expires } = tokenResponse.data;

    const expiryDays = parseInt(expires.split(" ")[0], 10); // Extract "30" from "30 Days"
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const existingToken = await db.paymentMetaData.findFirst({
      where: { usersTypeTag: "USER" },
    });

    if (existingToken) {
      await db.paymentMetaData.update({
        where: { id: existingToken.id },
        data: {
          authToken: token,
          expiry: expiryDate,
          updatedAt: new Date(),
        },
      });
    } else {
      await db.paymentMetaData.create({
        data: {
          authToken: token,
          usersTypeTag: "USER",
          expiry: expiryDate,
        },
      });
    }

    return {
      success: tokenResponse.msg || "Token generated and stored successfully.",
      token,
      expires: expiryDate,
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    if (error.response && error.response.data) {
      return {
        error:
          error.response.data.msg || "An error occurred during the request.",
      };
    }
    return { error: "An internal error occurred. Please try again later." };
  }
};

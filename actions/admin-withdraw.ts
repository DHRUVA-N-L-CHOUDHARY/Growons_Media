"use server";

import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { AcceptWithdrawalSchema, RejectWithdrawalSchema } from "@/schemas";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadPhotosToLocal = async (formData: any) => {
  const image = formData.get("image");
  return image
    .arrayBuffer()
    .then((data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
      const buffer = Buffer.from(data).toString("base64");
      return buffer;
    });
};

async function uploadPhotosToCloudinary(buffer: string) {
  return cloudinary.uploader.upload(
    `data:image/png;base64,${buffer}`,
    {
      folder: "GrowonsMedia",
      resource_type: "raw",
      type: "authenticated",
    },
    (err) => {
      return { error: err?.message };
    }
  );
}

export const acceptWithdrawal = async (formData: FormData) => {
  const transactionId = formData.get("transactionId")?.toString() || "";
  const requestId = formData.get("requestId")?.toString() || "";
  const userId = formData.get("userId")?.toString() || "";

  try {
    const file = await uploadPhotosToLocal(formData);
    const photos = await uploadPhotosToCloudinary(file);

    if (photos?.error) {
      return { error: "Failed to upload screenshot to Cloudinary." };
    }

    const withdrawal_updation = await db.withdrawalRequest.update({
      where: { id: requestId },
      data: {
        status: "SUCCESS",
        transactionId,
        secure_url: photos.secure_url,
        public_id: photos.public_id,
      },
    });

    const withdrawalRequest = await db.withdrawalRequest.findUnique({
      where: { id: requestId },
    });

    const walletFlow_creation = await db.walletFlow.create({
      data: {
        amount: Number(withdrawalRequest?.withdrawAmount),
        moneyId: transactionId,
        purpose: "Withdraw Request",
        userId: userId,
        status: "SUCCESS",
      },
    });

    if (withdrawalRequest?.withdrawAmount) {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user) {
        await db.user.update({
          where: { id: userId },
          data: {
            totalMoney:
              user.totalMoney - parseFloat(withdrawalRequest.withdrawAmount),
          },
        });
      }
    }

    await Promise.all([
      withdrawalRequest,
      walletFlow_creation,
      withdrawal_updation,
    ]);
  } catch (error) {
    console.error("Error in acceptWithdrawal:", error);
    return { error: "Error while accepting the withdrawal request!" };
  }

  revalidatePath("/admin/withdrawals");
  revalidatePath("/admin/user/");
  return { success: "Withdrawal request accepted!" };
};

export const rejectWithdrawal = async (formData: FormData) => {
  const requestId = formData.get("id")?.toString() || "";
  const reason = formData.get("reason")?.toString() || "";
  try {
    await db.withdrawalRequest.update({
      where: { id: requestId },
      data: { status: "FAILED", reason: reason },
    });
  } catch (error) {
    console.error("Error in rejectWithdrawal:", error);
    return { error: "Error while rejecting the withdrawal request!" };
  }

  revalidatePath("/admin/withdrawals");
  revalidatePath("/admin/user/");
  return { success: "Withdrawal request rejected!" };
};

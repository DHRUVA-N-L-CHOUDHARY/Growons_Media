"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { AddSupportLinkForm } from "@/schemas";
import * as z from "zod";

export const addLink = async (values: z.infer<typeof AddSupportLinkForm>) => {
  const validatedFields = AddSupportLinkForm.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { userId, link } = validatedFields.data;

  const user = await getUserById(userId);

  if (!user) {
    return { error: "User not found!" };
  }

  if (user.role !== "ADMIN") {
    return { error: "User is not an admin!" };
  }

  try {
    const supportLinkDetails = await db.support.findFirst({
      where: {
        userId,
      },
    });

    if (supportLinkDetails === null) {
      await db.support.create({
        data: {
          link,
          userId,
        },
      });
    } else {
      await db.support.update({
        where: {
          userId: userId,
        },
        data: {
          link,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }

  return { success: "added link" };
};

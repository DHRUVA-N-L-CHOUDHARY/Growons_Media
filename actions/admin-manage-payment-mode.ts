"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { ManagePaymentModeSchema } from "@/schemas";
import { z } from "zod";
import admin from "firebase-admin"; // Import Firestore
import axios from "axios";

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS!);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const firebasedb = admin.firestore();

interface GlobalToken {
  authToken: string;
  expiry: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

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

export const refreshMerchantToken = async () => {
  try {
    const localToken = await db.paymentMetaData.findFirst({
      where: { usersTypeTag: "USER" },
    });

    const now = new Date();

    const globalDoc = await firebasedb
      .collection("authTokens")
      .doc("USER")
      .get();
    const globalToken = globalDoc.exists
      ? (globalDoc.data() as GlobalToken)
      : null;

    if (globalToken) {
      console.log("Global token found. Comparing with local token...");

      if (globalToken.authToken === localToken?.authToken) {
        if (globalToken.expiry.toDate() >= now) {
          await regenerateToken(localToken);
          return {
            success: "Local token updated with global value.",
          };
        }
      } else {
        console.log("Updating local token with global value...");
        if (localToken) {
          await db.paymentMetaData.update({
            where: { id: localToken.id }, // Ensure this references the correct ID field in your DB
            data: {
              authToken: globalToken.authToken,
              expiry: globalToken.expiry.toDate(),
              updatedAt: new Date(),
            },
          });
        } else {
          console.log("No local token found. Creating a new one...");
          await db.paymentMetaData.create({
            data: {
              authToken: globalToken.authToken,
              usersTypeTag: "USER",
              expiry: globalToken.expiry.toDate(),
              updatedAt: new Date(),
            },
          });
        }
        return {
          success: "Local token updated with global value.",
        };
      }
    }

    console.log("No valid global or local token. Regenerating...");
    await regenerateToken(localToken);
    return {
      success: "No valid global or local token. Regenerating..",
    };
  } catch (error: any) {
    console.error("Error in refreshMerchantToken:", error.message);
    return { error: "An error occurred. Please try again later." };
  }
};

export const regenerateToken = async (
  localToken: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    authToken: string;
    usersTypeTag: any;
    expiry: Date;
  } | null
) => {
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

    const expiryDays = parseInt(expires.split(" ")[0], 10);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    // Store the token in the Firestore database
    const globalTokenDocRef = firebasedb.collection("authTokens").doc("USER"); 
    await globalTokenDocRef.set(
      {
        authToken: token,
        expiry: admin.firestore.Timestamp.fromDate(expiryDate),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      { merge: true } // Merge to retain other fields if they exist
    );

    if (localToken) {
      await db.paymentMetaData.update({
        where: { id: localToken.id }, // Ensure this references the correct ID field in your DB
        data: {
          authToken: token,
          expiry: expiryDate,
          updatedAt: new Date(),
        },
      });
    } else {
      console.log("No local token found. Creating a new one...");
      await db.paymentMetaData.create({
        data: {
          authToken: token,
          usersTypeTag: "USER",
          expiry: expiryDate,
          updatedAt: new Date(),
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
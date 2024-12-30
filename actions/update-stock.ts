"use server";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { db } from "@/lib/db";

export async function updateProductStocks() {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        sheetLink: true,
        sheetName: true,
      },
    });

    if (!products || products.length === 0) {
      throw new Error("No products found in the database");
    }


    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS!),
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });

    const authClient = (await auth.getClient()) as OAuth2Client;
    const sheets = google.sheets({ version: "v4", auth: authClient });

    for (const singleProduct of products) {
        console.log(singleProduct);
      const { sheetLink, sheetName, id } = singleProduct;
      if (!sheetLink || !sheetName) {
        console.warn(
          `Skipping product with ID ${id}: Missing sheetLink or sheetName.`
        );
        continue;
      }

      const spreadsheetId = sheetLink.match(
        /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
      )?.[1];

      if (!spreadsheetId) {
        console.warn(
          `Invalid sheet link format for product ID ${id}. Skipping.`
        );
        continue;
      }

      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: sheetName,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
          console.warn(
            `No data found in sheet "${sheetName}" for product ID ${id}. Skipping.`
          );
          continue;
        }

        const stock = rows.length - 1;

        await db.product.update({
          where: { id },
          data: { stock },
        });

        console.log(`Updated stock for product ID ${id} to ${stock}.`);
      } catch (sheetError) {
        console.error(
          `Failed to update stock for product ID ${id}:`,
          sheetError
        );
      }
    }

    return { success: true, message: "Product stocks updated successfully." };
  } catch (error) {
    console.error("Failed to update product stocks:", error);
    throw new Error("Failed to update product stocks.");
  }
}

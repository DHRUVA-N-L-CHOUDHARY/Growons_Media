"use server";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { parse } from "json2csv";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function downloadLeads(productName: string, numOfLines: number) {
  try {
    const product = await db.product.findUnique({
      where: {
        productName: productName,
      },
      select: {
        id: true,
        productName: true,
        stock: true,
        sheetLink: true,
        sheetName: true,
      },
    });

    console.log(product?.stock);

    if (!product) {
      throw new Error("Product not found");
    }

    console.log("Product found : ", product);

    if (numOfLines > product.stock) {
      throw new Error(
        `Requested ${numOfLines} leads but only ${product.stock} available`
      );
    }

    const spreadsheetId = product.sheetLink.match(
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
    )?.[1];

    console.log("SpreadsheetId : ", spreadsheetId);

    if (!spreadsheetId) {
      throw new Error("Invalid sheet link format");
    }

    const range = product.sheetName;

    console.log("--------------");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS!),
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });

    const authClient = (await auth.getClient()) as OAuth2Client;

    const sheets = google.sheets({
      version: "v4",
      auth: authClient,
    });

    const spreadsheetInfo = await sheets.spreadsheets.get({ spreadsheetId });

    console.log(spreadsheetInfo);
    const sheet = spreadsheetInfo.data.sheets?.find(
      (sheet) => sheet.properties?.title === range
    );

    console.log("Sheet ", sheet);

    if (!sheet) {
      throw new Error(`Sheet with name "${range}" not found`);
    }

    const sheetId = sheet.properties?.sheetId;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 1) {
      throw new Error("No data found in the sheet");
    }

    const csvColumns = rows[0] as string[];
    const requiredLeads = rows.slice(1, numOfLines + 1);

    const data = requiredLeads.map((row) => {
      const obj: { [key: string]: string } = {};
      csvColumns.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    // Delete the used rows from the sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: 1,
                endIndex: numOfLines + 1,
              },
            },
          },
        ],
      },
    });

    await db.$transaction(async (tx) => {
      await db.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: rows.length - 1 - numOfLines,
        },
      });
    });

    const csv = parse(data);

    revalidatePath("/products");

    console.log(csv);
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "text/csv");
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename=${productName}_leads.csv`
    );

    return {
      ok: true,
      data: csv,
      filename: `${productName}_leads.csv`,
      contentType: "text/csv",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(`Failed to download leads: ${error.message}`);
    }
    throw new Error("An unknown error occurred while downloading leads");
  }
}

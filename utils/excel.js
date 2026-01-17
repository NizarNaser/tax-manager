export const runtime = "nodejs";

import * as XLSX from "xlsx";
import Invoice from "../models/Invoice";
import dbConnect from "../lib/db";

export async function generateMonthlyExcel(userId, year, month) {
  await dbConnect();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const invoices = await Invoice.find({
    userId,
    date: { $gte: start, $lte: end },
  }).lean();

  const rows = invoices.map(inv => ({
    invoiceNumber: inv.invoiceNumber,
    supplier: inv.supplier,
    date: inv.date.toISOString().split("T")[0],
    totalAmount: inv.totalAmount,
    taxRate: inv.taxRate,
    taxAmount: inv.taxAmount,
    netAmount: inv.netAmount,
    image: inv.invoiceImage || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return buffer;
}

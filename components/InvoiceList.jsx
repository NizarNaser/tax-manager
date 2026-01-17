"use client";

import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function InvoiceList({ invoices = [] }) {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    console.log("Invoices in component:", invoices);
    setList(invoices);
  }, [invoices]);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoices");

    worksheet.columns = [
      { header: "Type", key: "type", width: 10 },
      { header: "Title", key: "title", width: 30 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
      { header: "Description", key: "description", width: 30 },
      { header: "Image URL", key: "imageUrl", width: 40 },
    ];

    list.forEach(inv =>
      worksheet.addRow({
        type: inv.type,
        title: inv.title,
        amount: inv.amount,
        date: inv.date ? new Date(inv.date).toLocaleDateString() : "",
        description: inv.description,
        imageUrl: inv.imageUrl || "",
      })
    );

    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.xlsx";
    a.click();
  };

  const handleOpenImage = (url) => {
    setCurrentImage(url);
    setOpen(true);
  };

  return (
    <div className="mt-4">
      <button
        onClick={downloadExcel}
        className="bg-green-500 text-white px-4 py-2 rounded mb-2"
      >
        Download Excel
      </button>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Type</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Image</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((inv) => (
              <tr key={inv._id}>
                <td className="border p-2">{inv.type}</td>
                <td className="border p-2">{inv.title}</td>
                <td className="border p-2">{inv.amount}</td>
                <td className="border p-2">
                  {inv.date ? new Date(inv.date).toLocaleDateString() : ""}
                </td>
                <td className="border p-2">{inv.description}</td>
                <td className="border p-2 flex flex-col items-center gap-1">
                  {inv.imageUrl ? (
                    <>
                      <img
                        src={inv.imageUrl}
                        alt="Invoice"
                        className="w-16 h-16 object-contain cursor-pointer mb-1"
                        onClick={() => handleOpenImage(inv.imageUrl)}
                      />
                     <button
  className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
  onClick={async () => {
    try {
      const res = await fetch(inv.imageUrl, { mode: "cors" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${inv.title}_${new Date(inv.date)
        .toISOString()
        .slice(0, 10)}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  }}
>
  Download
</button>

                    </>
                  ) : (
                    "No Image"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border p-2 text-center">
                No invoices found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={[{ src: currentImage }]}
        />
      )}
    </div>
  );
}

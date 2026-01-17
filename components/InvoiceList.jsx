"use client";

import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function InvoiceList({ invoices = [], onEdit, onDelete }) {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    // Ensure invoices is an array before setting state
    if (Array.isArray(invoices)) {
      setList(invoices);
    } else {
      setList([]);
    }
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

  const downloadImageHelper = async (inv) => {
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
      alert("Error downloading image");
    }
  }

  // --- Render Functions ---

  const ActionButtons = ({ inv }) => (
    <div className="flex gap-2 justify-center mt-2">
      {onEdit && (
        <button
          onClick={() => onEdit(inv)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 text-xs rounded transition-colors"
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete this invoice?")) {
              onDelete(inv._id);
            }
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded transition-colors"
        >
          Delete
        </button>
      )}
    </div>
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Invoices List</h2>
        <button
          onClick={downloadExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          Download Excel
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-center p-8 bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
          No invoices found. Add your first invoice above.
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-4">
            {list.map((inv) => (
              <div key={inv._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{inv.title}</h3>
                    <p className="text-xs text-slate-500">{inv.date ? new Date(inv.date).toLocaleDateString() : ""}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${inv.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {inv.type}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-700">Amount:</p>
                  <p className="font-bold text-slate-900">{inv.amount} €</p>
                </div>

                {inv.description && (
                  <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">{inv.description}</p>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  {inv.imageUrl ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={inv.imageUrl}
                        alt="Invoice"
                        className="w-10 h-10 object-cover rounded cursor-pointer border border-slate-200"
                        onClick={() => handleOpenImage(inv.imageUrl)}
                      />
                      <button
                        onClick={() => downloadImageHelper(inv)}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        Download Img
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">No Image</span>
                  )}

                  <div className="flex gap-2">
                    <ActionButtons inv={inv} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-4 border-b">Type</th>
                  <th className="p-4 border-b">Title</th>
                  <th className="p-4 border-b">Amount</th>
                  <th className="p-4 border-b">Date</th>
                  <th className="p-4 border-b">Description</th>
                  <th className="p-4 border-b text-center">Image</th>
                  <th className="p-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${inv.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {inv.type}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{inv.title}</td>
                    <td className="p-4 font-bold">{inv.amount} €</td>
                    <td className="p-4">
                      {inv.date ? new Date(inv.date).toLocaleDateString() : ""}
                    </td>
                    <td className="p-4 max-w-xs truncate" title={inv.description}>{inv.description}</td>
                    <td className="p-4 text-center">
                      {inv.imageUrl ? (
                        <div className="flex flex-col items-center gap-1">
                          <img
                            src={inv.imageUrl}
                            alt="Invoice"
                            className="w-10 h-10 object-cover rounded cursor-pointer border border-slate-200 hover:scale-110 transition-transform"
                            onClick={() => handleOpenImage(inv.imageUrl)}
                          />
                          <button
                            className="text-blue-600 text-xs hover:underline mt-1"
                            onClick={() => downloadImageHelper(inv)}
                          >
                            Download
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">No Image</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <ActionButtons inv={inv} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

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

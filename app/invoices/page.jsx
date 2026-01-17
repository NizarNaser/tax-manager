"use client";

import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import Link from "next/link";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (Array.isArray(data)) {
        setInvoices(data);
        setFilteredInvoices(data);
      } else {
        console.error("Failed to fetch invoices:", data);
        setInvoices([]);
        setFilteredInvoices([]);
      }
    };
    fetchInvoices();
  }, []);

  const filterByDate = () => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const filtered = invoices.filter(inv => {
      const invDate = new Date(inv.date);
      if (from && invDate < from) return false;
      if (to && invDate > to) return false;
      return true;
    });

    setFilteredInvoices(filtered);
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rechnungen"); // قائمة الفواتير

    worksheet.columns = [
      { header: "Typ", key: "type", width: 10 }, // Type
      { header: "Titel", key: "title", width: 30 }, // Title
      { header: "Betrag", key: "amount", width: 15 }, // Amount
      { header: "Datum", key: "date", width: 20 }, // Date
      { header: "Beschreibung", key: "description", width: 30 }, // Description
    ];

    filteredInvoices.forEach(inv =>
      worksheet.addRow({
        type: inv.type,
        title: inv.title,
        amount: inv.amount,
        date: inv.date ? new Date(inv.date).toLocaleDateString() : "",
        description: inv.description,
      })
    );

    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gefilterte_rechnungen.xlsx"; // filtered_invoices.xlsx
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rechnungsliste</h1> {/* قائمة الفواتير */}

      <div className="flex gap-2 mb-4 flex-wrap">
        <div>
          <label>Von:</label> {/* من */}
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border rounded p-1 ml-1"
          />
        </div>
        <div>
          <label>Bis:</label> {/* إلى */}
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border rounded p-1 ml-1"
          />
        </div>
        <button
          onClick={filterByDate}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Filtern {/* فلترة */}
        </button>
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Excel herunterladen {/* تنزيل Excel */}
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Typ</th>
            <th className="border p-2">Titel</th>
            <th className="border p-2">Betrag</th>
            <th className="border p-2">Datum</th>
            <th className="border p-2">Beschreibung</th>
            <th className="border p-2">Ansehen</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map(inv => (
              <tr key={inv._id}>
                <td className="border p-2">{inv.type}</td>
                <td className="border p-2">{inv.title}</td>
                <td className="border p-2">{inv.amount}</td>
                <td className="border p-2">
                  {inv.date ? new Date(inv.date).toLocaleDateString() : ""}
                </td>
                <td className="border p-2">{inv.description}</td>
                <td className="border p-2">
                  <Link
                    href={`/invoices/${inv._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Anzeigen {/* عرض */}
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center border p-2">
                Keine Rechnungen vorhanden {/* لا توجد فواتير */}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

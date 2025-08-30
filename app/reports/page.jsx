"use client";

import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ReportsPage() {
  const [invoices, setInvoices] = useState([]);

  const [settings, setSettings] = useState({ vatRate: 19, corporateTaxRate: 15 });
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const filteredInvoices = Array.isArray(invoices)
  ? invoices.filter(
      inv => new Date(inv.date).getMonth() + 1 === parseInt(month) &&
             new Date(inv.date).getFullYear() === parseInt(year)
    )
  : [];

  useEffect(() => {
    const fetchData = async () => {
      const resInv = await fetch("/api/invoices");
      const dataInv = await resInv.json();
      setInvoices(dataInv.invoices || dataInv);

      const resSet = await fetch("/api/settings");
      const dataSet = await resSet.json();
      if (dataSet) setSettings(dataSet);
    };
    fetchData();
  }, []);

 
  const totals = filteredInvoices.reduce(
    (acc, inv) => {
      if (inv.type === "income") acc.income += inv.amount;
      else if (inv.type === "expense") acc.expense += inv.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const netProfit = totals.income - totals.expense;
  const vat = totals.income * (settings.vatRate / 100);
  const corporateTax = netProfit * (settings.corporateTaxRate / 100);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Monthly Report");

    ws.addRow(["Tax Report", `Month: ${month}, Year: ${year}`]);
    ws.addRow([]);
    ws.addRow(["Total Income", totals.income]);
    ws.addRow(["Total Expenses", totals.expense]);
    ws.addRow(["Net Profit", netProfit]);
    ws.addRow(["VAT", vat]);
    ws.addRow(["Corporate Tax", corporateTax]);
    ws.addRow([]);
    ws.addRow(["Detailed Invoices"]);
    ws.addRow(["Type", "Title", "Amount", "Date", "Description", "Image URL"]);

    filteredInvoices.forEach(inv => {
      ws.addRow([
        inv.type,
        inv.title,
        inv.amount,
        new Date(inv.date).toLocaleDateString(),
        inv.description,
        inv.imageUrl || ""
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Tax_Report_${year}_${month}.xlsx`;
    a.click();
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Monthly Tax Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Month: ${month}, Year: ${year}`, 14, 28);
    doc.text(`Company VAT Rate: ${settings.vatRate}%`, 14, 36);
    doc.text(`Corporate Tax Rate: ${settings.corporateTaxRate}%`, 14, 44);
    doc.text(`Total Income: €${totals.income.toFixed(2)}`, 14, 52);
    doc.text(`Total Expenses: €${totals.expense.toFixed(2)}`, 14, 60);
    doc.text(`Net Profit: €${netProfit.toFixed(2)}`, 14, 68);
    doc.text(`VAT: €${vat.toFixed(2)}`, 14, 76);
    doc.text(`Corporate Tax: €${corporateTax.toFixed(2)}`, 14, 84);

    let y = 100;
    doc.setFontSize(14);
    doc.text("Detailed Invoices", 14, y);
    y += 6;
    doc.setFontSize(10);
    filteredInvoices.forEach(inv => {
      doc.text(`${inv.type} | ${inv.title} | €${inv.amount} | ${new Date(inv.date).toLocaleDateString()} | ${inv.description}`, 14, y);
      y += 6;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    doc.save(`Tax_Report_${year}_${month}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Monthly Tax Report</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="number"
          min="1"
          max="12"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="p-2 border rounded w-24"
        />
        <input
          type="number"
          min="2000"
          max="2100"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-2 border rounded w-32"
        />
        <button onClick={downloadExcel} className="bg-green-500 text-white px-4 py-2 rounded">
          Download Excel
        </button>
        <button onClick={printPDF} className="bg-red-500 text-white px-4 py-2 rounded">
          Print PDF
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow space-y-2 mb-4">
        <p><strong>Total Income:</strong> €{totals.income.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong> €{totals.expense.toFixed(2)}</p>
        <p><strong>Net Profit:</strong> €{netProfit.toFixed(2)}</p>
        <p><strong>VAT ({settings.vatRate}%):</strong> €{vat.toFixed(2)}</p>
        <p><strong>Corporate Tax ({settings.corporateTaxRate}%):</strong> €{corporateTax.toFixed(2)}</p>
      </div>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Type</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((inv, i) => (
            <tr key={inv._id}>
              <td className="border p-2">{inv.type}</td>
              <td className="border p-2">{inv.title}</td>
              <td className="border p-2">{inv.amount}</td>
              <td className="border p-2">{new Date(inv.date).toLocaleDateString()}</td>
              <td className="border p-2">{inv.description}</td>
             <td className="border p-2 flex flex-col items-center gap-1">
  {inv.imageUrl ? (
    <>
      <img
        src={inv.imageUrl}
        alt="Invoice"
        className="w-16 h-16 object-contain cursor-pointer"
        onClick={() => { setLightboxIndex(i); setOpenLightbox(true); }}
      />
      <button
        className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
        onClick={() => {
          const a = document.createElement("a");
          a.href = inv.imageUrl;
          a.download = `Invoice_${inv.title}_${new Date(inv.date).toISOString().slice(0,10)}.jpg`;
          a.click();
        }}
      >
        Download
      </button>
    </>
  ) : "No Image"}
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {openLightbox && (
        <Lightbox
          slides={filteredInvoices.map(inv => ({ src: inv.imageUrl }))}
          open={openLightbox}
          index={lightboxIndex}
          close={() => setOpenLightbox(false)}
        />
      )}
    </div>
  );
}

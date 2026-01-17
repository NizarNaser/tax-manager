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
  const corporateTax = netProfit > 0 ? netProfit * (settings.corporateTaxRate / 100) : 0;

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Monatsbericht");
    ws.addRow(["Steuerbericht", `Monat: ${month}, Jahr: ${year}`]);
    ws.addRow([]);
    ws.addRow(["Gesamteinnahmen", totals.income]);
    ws.addRow(["Gesamtausgaben", totals.expense]);
    ws.addRow(["Nettogewinn", netProfit]);
    ws.addRow(["Umsatzsteuer (VAT)", vat]);
    ws.addRow(["Körperschaftssteuer", corporateTax]);
    ws.addRow([]);
    ws.addRow(["Typ", "Titel", "Betrag", "Datum", "Beschreibung"]);
    filteredInvoices.forEach(inv => ws.addRow([inv.type === 'income' ? 'Einnahme' : 'Ausgabe', inv.title, inv.amount, new Date(inv.date).toLocaleDateString('de-DE'), inv.description]));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Steuerbericht_${year}_${month}.xlsx`;
    a.click();
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.text(`Steuerbericht - ${year}/${month}`, 14, 20);
    doc.text(`Einnahmen: ${totals.income.toFixed(2)}`, 14, 30);
    doc.text(`Ausgaben: ${totals.expense.toFixed(2)}`, 14, 40);
    doc.text(`Netto: ${netProfit.toFixed(2)}`, 14, 50);
    doc.save(`Steuerbericht_${year}_${month}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left w-full">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Finanzberichte</h1>
          <p className="text-slate-400 text-lg mt-2 font-medium">Zusammenfassung von Gewinn, Steuern und Cashflow</p>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="block text-sm font-bold text-slate-400 ml-2 uppercase tracking-widest text-left">Monat (Zahl)</label>
          <input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all appearance-none text-left font-bold text-xl" />
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="block text-sm font-bold text-slate-400 ml-2 uppercase tracking-widest text-left">Jahr</label>
          <input type="number" min="2000" max="2100" value={year} onChange={(e) => setYear(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all appearance-none text-left font-bold text-xl" />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={downloadExcel} className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Excel
          </button>
          <button onClick={printPDF} className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportStatCard title="Gesamteinnahmen" value={totals.income} color="green" icon="income" />
        <ReportStatCard title="Gesamtausgaben" value={totals.expense} color="red" icon="expense" />
        <ReportStatCard title="Nettogewinn" value={netProfit} color="blue" icon="profit" />
        <ReportStatCard title={`Umsatzsteuer (VAT - ${settings.vatRate}%)`} value={vat} color="yellow" icon="tax" />
        <ReportStatCard title={`Körperschaftssteuer (${settings.corporateTaxRate}%)`} value={corporateTax} color="purple" icon="settings" />
      </div>

      <div className="glass rounded-[2.5rem] border border-white/5 overflow-x-auto overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-300 font-bold uppercase">
            <tr>
              <th className="p-6">Typ</th>
              <th className="p-6">Titel</th>
              <th className="p-6">Betrag</th>
              <th className="p-6">Datum</th>
              <th className="p-6 text-center">Bild</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredInvoices.map((inv, i) => (
              <tr key={inv._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${inv.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {inv.type === 'income' ? 'Einnahme' : 'Ausgabe'}
                  </span>
                </td>
                <td className="p-6 font-bold text-white">{inv.title}</td>
                <td className="p-6 font-black text-white">{inv.amount} €</td>
                <td className="p-6 text-slate-400">{new Date(inv.date).toLocaleDateString('de-DE')}</td>
                <td className="p-6">
                  <div className="flex justify-center">
                    {inv.imageUrl && (
                      <img
                        src={inv.imageUrl}
                        alt="Rechnung"
                        className="w-12 h-12 object-cover rounded-xl cursor-pointer border border-white/10 hover:border-yellow-500 transition-all"
                        onClick={() => { setLightboxIndex(i); setOpenLightbox(true); }}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

function ReportStatCard({ title, value, color, icon }) {
  const colors = {
    green: "from-green-500/10 border-green-500/20 text-green-500",
    red: "from-red-500/10 border-red-500/20 text-red-500",
    blue: "from-blue-500/10 border-blue-500/20 text-blue-500",
    yellow: "from-yellow-500/10 border-yellow-500/20 text-yellow-500",
    purple: "from-purple-500/10 border-purple-500/20 text-purple-500"
  };

  return (
    <div className={`glass p-8 rounded-[2rem] border bg-gradient-to-br transition-all hover:-translate-y-1 text-left ${colors[color]}`}>
      <p className="text-slate-400 font-bold mb-2">{title}</p>
      <p className="text-4xl font-black text-white">{value.toFixed(2)} €</p>
    </div>
  )
}

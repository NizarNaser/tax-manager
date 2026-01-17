"use client";

import { useEffect, useState } from "react";
import InvoiceList from "../../components/InvoiceList";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (Array.isArray(data)) {
        setInvoices(data);
        setFilteredInvoices(data);
      } else {
        setInvoices([]);
        setFilteredInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
      setFilteredInvoices([]);
    }
  };

  useEffect(() => {
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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        const newInvoices = invoices.filter(inv => inv._id !== id);
        setInvoices(newInvoices);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        setFilteredInvoices(newInvoices.filter(inv => {
          const invDate = new Date(inv.date);
          if (from && invDate < from) return false;
          if (to && invDate > to) return false;
          return true;
        }));
      } else {
        alert("Fehler beim Löschen der Rechnung");
      }
    } catch (err) {
      console.error(err);
      alert("Fehler beim Löschen der Rechnung");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2 text-left w-full md:w-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Rechnungsverwaltung</h1>
          <p className="text-slate-400 text-lg font-medium">Alle Finanztransaktionen anzeigen und filtern</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="glass px-6 py-4 rounded-3xl border border-white/5 flex-1 md:flex-none min-w-[140px] text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Gesamt</p>
            <p className="text-2xl font-black text-white">{filteredInvoices.length}</p>
          </div>
          <div className="glass px-6 py-4 rounded-3xl border border-green-500/20 bg-green-500/5 flex-1 md:flex-none min-w-[140px] text-center">
            <p className="text-[10px] text-green-500/60 font-bold uppercase tracking-wider mb-1">Einnahmen</p>
            <p className="text-2xl font-black text-green-500">{filteredInvoices.filter(i => i.type === 'income').length}</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10"></div>

        <div className="flex flex-col lg:flex-row gap-8 items-end">
          <div className="flex-1 w-full grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 ml-2">Von Datum</label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all placeholder-slate-600 appearance-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 ml-2">Bis Datum</label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all appearance-none"
              />
            </div>
          </div>

          <button
            onClick={filterByDate}
            className="w-full lg:w-48 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-white/10 hover:border-white/20 active:scale-95 flex items-center justify-center gap-3 shadow-xl"
          >
            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-6.414-6.414A1 1 0 013 6.586V4z" />
            </svg>
            Filtern
          </button>
        </div>
      </div>

      {/* List Section */}
      <InvoiceList invoices={filteredInvoices} onDelete={handleDelete} />
    </div>
  );
}

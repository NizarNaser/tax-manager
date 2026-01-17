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
        // Re-apply filter
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        setFilteredInvoices(newInvoices.filter(inv => {
          const invDate = new Date(inv.date);
          if (from && invDate < from) return false;
          if (to && invDate > to) return false;
          return true;
        }));
      } else {
        alert("Failed to delete invoice");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting invoice");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Invoices List</h1>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={filterByDate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors mb-[1px]"
          >
            Filter
          </button>
        </div>
      </div>

      <InvoiceList invoices={filteredInvoices} onDelete={handleDelete} />
    </div>
  );
}

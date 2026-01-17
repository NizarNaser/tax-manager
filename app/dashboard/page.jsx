"use client";

import { useEffect, useState } from "react";
import InvoiceForm from "../../components/InvoiceForm";
import InvoiceList from "../../components/InvoiceList";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      if (Array.isArray(data)) {
        setInvoices(data);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleAdd = (newInv) => {
    setInvoices([newInv, ...invoices]);
  };

  const handleUpdate = (updatedInv) => {
    setInvoices(invoices.map(inv => inv._id === updatedInv._id ? updatedInv : inv));
    setEditingInvoice(null);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInvoices(invoices.filter(inv => inv._id !== id));
      } else {
        alert("Fehler beim Löschen der Rechnung");
      }
    } catch (err) {
      console.error(err);
      alert("Fehler beim Löschen der Rechnung");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left w-full">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center justify-start gap-4">
            Dashboard
            <span className="text-yellow-500">Zentrale Verwaltung</span>
          </h1>
          <p className="text-slate-400 text-lg mt-2 font-medium">Erfassen Sie Ihre Rechnungen und verfolgen Sie Ihre Ausgaben und Einnahmen präzise.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Form Section */}
        <section className="relative">
          <div className="absolute -top-6 left-8 bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest z-20 shadow-lg">
            {editingInvoice ? 'Rechnung bearbeiten' : 'Neu hinzufügen'}
          </div>
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -z-10"></div>
            <InvoiceForm
              onAdd={handleAdd}
              initialData={editingInvoice}
              onUpdate={handleUpdate}
              onCancel={() => setEditingInvoice(null)}
            />
          </div>
        </section>

        {/* List Section */}
        <section>
          <InvoiceList
            invoices={invoices}
            onEdit={(inv) => {
              setEditingInvoice(inv);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </div>
  );
}

// app/dashboard/page.jsx
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
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
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
        alert("Failed to delete invoice");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting invoice");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Dashboard</h1>
        <p className="text-slate-500">Manage your income and expenses.</p>
      </div>

      <InvoiceForm
        onAdd={handleAdd}
        initialData={editingInvoice}
        onUpdate={handleUpdate}
        onCancel={() => setEditingInvoice(null)}
      />

      <InvoiceList
        invoices={invoices}
        onEdit={(inv) => {
          setEditingInvoice(inv);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}

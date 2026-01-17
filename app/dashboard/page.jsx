// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import InvoiceForm from "../../components/InvoiceForm";
import InvoiceList from "../../components/InvoiceList";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {
    const res = await fetch("/api/invoices");
    const data = await res.json();
    if (Array.isArray(data)) {
      setInvoices(data);
    } else {
      console.error("Failed to fetch invoices:", data);
      setInvoices([]);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleAdd = (newInv) => { setInvoices([newInv, ...invoices]); };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <InvoiceForm onAdd={handleAdd} />
      <InvoiceList invoices={invoices} />
    </div>
  );
}

"use client";

import { useState } from "react";

export default function InvoiceForm({ onAdd }) {
  const [type, setType] = useState("income");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Upload image first");

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, amount, date, description, image: reader.result }),
      });
      const data = await res.json();
      onAdd(data);
      setTitle(""); setAmount(""); setDate(""); setDescription(""); setImage(null);
    };
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow space-y-2">
      <select value={type} onChange={e => setType(e.target.value)} className="border p-2 w-full">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 border rounded" required/>
      <input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full p-2 border rounded" required/>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full p-2 border rounded" required/>
      <input type="text" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-2 border rounded"/>
      <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} className="w-full" required/>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Invoice</button>
    </form>
  );
}

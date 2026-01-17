"use client";

import { useState, useEffect } from "react";

export default function InvoiceForm({ onAdd, initialData = null, onUpdate, onCancel }) {
  const [type, setType] = useState("income");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form when initialData changes (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || "income");
      setTitle(initialData.title || "");
      setAmount(initialData.amount || "");
      setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "");
      setDescription(initialData.description || "");
      // Note: We don't pre-fill the file input for security reasons, user must re-upload if they want to change image
      // But we can keep the existing image if no new one is uploaded (logic needs to be handled in submit)
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setType("income");
    setTitle("");
    setAmount("");
    setDate("");
    setDescription("");
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Helper to send request
      const sendRequest = async (imageData) => {
        const payload = {
          type,
          title,
          amount,
          date,
          description,
        };

        if (imageData) payload.image = imageData;

        // Decide method and URL based on mode
        const url = initialData ? `/api/invoices/${initialData._id}` : "/api/invoices";
        const method = initialData ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to save invoice");

        const data = await res.json();

        if (initialData && onUpdate) {
          onUpdate(data);
        } else if (onAdd) {
          onAdd(data);
        }

        alert(initialData ? "Invoice updated successfully" : "Invoice added successfully");
        if (!initialData) resetForm(); // Only reset if adding new
      };

      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () => sendRequest(reader.result);
      } else {
        // If editing and no new image, proceed without image (backend should handle partial updates? or keep old)
        // The current backend PUT implementation replaces the whole doc or updates fields sent.
        // BUT the current POST backend REQUIRES image. 
        // Let's assume for update we can skip image if we want to keep old one.
        if (initialData) {
          sendRequest(null);
        } else {
          alert("Upload image first");
          setLoading(false);
        }
      }

    } catch (err) {
      console.error(err);
      alert("Error saving invoice: " + err.message);
    } finally {
      if (!initialData) setLoading(false); // keep loading state if updating until parent handles it? Nah.
      else setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      <h2 className="text-lg font-bold text-slate-800 mb-2">
        {initialData ? "Edit Invoice" : "Add New Invoice"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input type="text" placeholder="e.g. Website Design" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount (€)</label>
          <input type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea placeholder="Details about the invoice..." value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Image {initialData && "(Leave empty to keep existing)"}</label>
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" required={!initialData} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 text-white py-2 px-4 rounded-lg font-medium transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
        >
          {loading ? "Saving..." : (initialData ? "Update Invoice" : "Add Invoice")}
        </button>

        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

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

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || "income");
      setTitle(initialData.title || "");
      setAmount(initialData.amount || "");
      setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "");
      setDescription(initialData.description || "");
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
      const sendRequest = async (imageData) => {
        const payload = { type, title, amount, date, description };
        if (imageData) payload.image = imageData;

        const url = initialData ? `/api/invoices/${initialData._id}` : "/api/invoices";
        const method = initialData ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Fehler beim Speichern der Rechnung");
        const data = await res.json();

        if (initialData && onUpdate) onUpdate(data);
        else if (onAdd) onAdd(data);

        alert(initialData ? "Rechnung erfolgreich aktualisiert" : "Rechnung erfolgreich hinzugefügt");
        if (!initialData) resetForm();
      };

      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () => sendRequest(reader.result);
      } else {
        if (initialData) sendRequest(null);
        else {
          alert("Bitte Rechnungsbild hochladen");
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Fehler: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all placeholder-slate-600";
  const labelClasses = "block text-sm font-bold text-slate-300 ml-2 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className={labelClasses}>Transaktionstyp</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-4 rounded-2xl font-bold transition-all border ${type === 'income' ? 'bg-green-500 text-black border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'}`}
            >
              Einnahme (Income)
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-4 rounded-2xl font-bold transition-all border ${type === 'expense' ? 'bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'}`}
            >
              Ausgabe (Expense)
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Datum</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClasses} required />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Rechnungstitel</label>
          <input type="text" placeholder="z.B. Kundenprojekt, Webdesign..." value={title} onChange={e => setTitle(e.target.value)} className={inputClasses} required />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Betrag (€)</label>
          <div className="relative">
            <input type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className={inputClasses} required />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>Beschreibung (optional)</label>
        <textarea placeholder="Zusätzliche Details zur Rechnung..." value={description} onChange={e => setDescription(e.target.value)} className={`${inputClasses} h-32 resize-none`} />
      </div>

      <div className="space-y-4">
        <label className={labelClasses}>Rechnungsbild {initialData && "(Leer lassen, um das aktuelle zu behalten)"}</label>
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            required={!initialData}
          />
          <div className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 group-hover:bg-white/10 group-hover:border-yellow-500/50 transition-all">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-bold">{image ? image.name : 'Bild hierher ziehen oder zum Hochladen klicken'}</p>
            <p className="text-slate-600 text-xs text-center">Unterstützt JPG, PNG (max. 5MB)</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-[0.98] shadow-2xl ${loading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-[#F2B824] hover:bg-yellow-500 text-black shadow-[0_20px_40px_rgba(242,184,36,0.25)]'}`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
              Wird verarbeitet...
            </span>
          ) : (initialData ? "Rechnung aktualisieren" : "Rechnung jetzt hinzufügen")}
        </button>

        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[2rem] font-bold transition-all"
          >
            Abbrechen
          </button>
        )}
      </div>
    </form>
  );
}

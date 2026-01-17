"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [bundesland, setBundesland] = useState("");
  const [vatRate, setVatRate] = useState(19);
  const [corporateTaxRate, setCorporateTaxRate] = useState(15);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data) {
        setCompanyName(data.companyName || "");
        setBundesland(data.bundesland || "");
        setVatRate(data.vatRate || 19);
        setCorporateTaxRate(data.corporateTaxRate || 15);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, bundesland, vatRate, corporateTaxRate }),
      });
      if (res.ok) {
        alert("Einstellungen erfolgreich gespeichert!");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all placeholder-slate-600 appearance-none";
  const labelClasses = "block text-sm font-bold text-slate-300 ml-2 mb-2 text-left";

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-left">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight italic">Systemeinstellungen</h1>
        <p className="text-slate-400 text-lg mt-2 font-medium">Anpassung der Unternehmensdaten und Steuersätze</p>
      </div>

      <div className="glass p-10 md:p-14 rounded-[3rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-[100px] -z-10"></div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClasses}>Firmenname / Geschäftsbereich</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClasses} required />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Bundesland</label>
              <select value={bundesland} onChange={(e) => setBundesland(e.target.value)} className={inputClasses} required>
                <option value="">Bundesland wählen</option>
                <option value="Bayern">Bayern</option>
                <option value="Berlin">Berlin</option>
                <option value="Hamburg">Hamburg</option>
                <option value="Hessen">Hessen</option>
                <option value="NRW">Nordrhein-Westfalen</option>
                <option value="Sachsen">Sachsen</option>
                <option value="Thüringen">Thüringen</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Umsatzsteuersatz (VAT) (%)</label>
              <div className="relative">
                <input type="number" value={vatRate} onChange={(e) => setVatRate(parseFloat(e.target.value))} className={inputClasses} min={0} max={100} required />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Körperschaftssteuersatz (%)</label>
              <div className="relative">
                <input type="number" value={corporateTaxRate} onChange={(e) => setCorporateTaxRate(parseFloat(e.target.value))} className={inputClasses} min={0} max={100} required />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-[2.5rem] font-black text-xl transition-all active:scale-[0.98] shadow-2xl ${loading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-[#F2B824] hover:bg-yellow-500 text-black shadow-[0_20px_40px_rgba(242,184,36,0.25)]'}`}
            >
              {loading ? "Wird gespeichert..." : "Einstellungen speichern"}
            </button>
          </div>
        </form>
      </div>

      <div className="p-8 glass rounded-[2rem] border border-blue-500/10 bg-blue-500/5 text-center">
        <p className="text-blue-400 font-medium text-sm leading-relaxed">
          * Diese Einstellungen werden zur Berechnung von Steuern und Nettogewinnen im Abschnitt Berichte verwendet. Bitte stellen Sie die Genauigkeit der eingegebenen Sätze sicher.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../../components/LanguageContext";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [companyName, setCompanyName] = useState("");
  const [bundesland, setBundesland] = useState("");
  const [vatRate, setVatRate] = useState(19);
  const [corporateTaxRate, setCorporateTaxRate] = useState(15);
  const [companyLogo, setCompanyLogo] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [taxId, setTaxId] = useState("");
  const [vatId, setVatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data) {
        setCompanyName(data.companyName || "");
        setBundesland(data.bundesland || "");
        setVatRate(data.vatRate || 19);
        setCorporateTaxRate(data.corporateTaxRate || 15);
        setCompanyLogo(data.companyLogo || "");
        setAddress(data.address || "");
        setCountry(data.country || "");
        setTaxId(data.taxId || "");
        setVatId(data.vatId || "");
      }
    };
    fetchSettings();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setCompanyLogo(reader.result);
        setLogoUploading(false);
      };
      reader.onerror = () => {
        throw new Error("Fehler beim Lesen der Datei");
      };
    } catch (err) {
      console.error(err);
      alert(t("upload_failed") || "Fehler beim Hochladen");
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, bundesland, vatRate, corporateTaxRate, companyLogo, address, country, taxId, vatId }),
      });
      
      if (res.ok) {
        setStatusMessage({ type: 'success', text: t("settings_saved") || "Einstellungen erfolgreich gespeichert!" });
        setTimeout(() => setStatusMessage(null), 5000);
      } else {
        const errorData = await res.json();
        setStatusMessage({ type: 'error', text: errorData.error || t("settings_error") || "Fehler beim Speichern" });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || t("settings_error") || "Ein Fehler ist aufgetreten" });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all placeholder-slate-600 appearance-none";
  const labelClasses = "block text-sm font-bold text-slate-300 ml-2 mb-2 text-left";

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-left">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight italic">{t("system_settings")}</h1>
        <p className="text-slate-400 text-lg mt-2 font-medium">{t("settings_summary")}</p>
      </div>

      <div className="glass p-10 md:p-14 rounded-[3rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-[100px] -z-10"></div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 md:col-span-2">
              <label className={labelClasses}>{t("company_logo") || "Firmenlogo"}</label>
              <div className="flex items-center gap-6">
                {companyLogo && (
                  <img src={companyLogo} alt="Logo" className="w-24 h-24 object-contain bg-white rounded-xl" />
                )}
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="bg-white/5 border border-white/10 hover:border-yellow-500 text-white px-6 py-3 rounded-xl transition-all cursor-pointer font-bold text-sm">
                    {logoUploading ? t("processing") : (companyLogo ? (t("change_logo") || "Logo ändern") : (t("upload_logo") || "Logo hochladen"))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>{t("company_name")}</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClasses} required />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>{t("state")}</label>
              <input type="text" value={bundesland} onChange={(e) => setBundesland(e.target.value)} className={inputClasses} required />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>{t("country") || "Land"}</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClasses} required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className={labelClasses}>{t("address") || "Adresse"}</label>
              <input type="text" placeholder="Musterstraße 1, 12345 Musterstadt" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClasses} />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>{t("tax_id") || "Steuernummer"}</label>
              <input type="text" value={taxId} onChange={(e) => setTaxId(e.target.value)} className={inputClasses} />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>{t("vat_id") || "Umsatzsteuer-ID"}</label>
              <input type="text" value={vatId} onChange={(e) => setVatId(e.target.value)} className={inputClasses} />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>{t("vat_rate")}</label>
              <div className="relative">
                <input type="number" value={vatRate} onChange={(e) => setVatRate(parseFloat(e.target.value))} className={inputClasses} min={0} max={100} required />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>{t("corporate_rate")}</label>
              <div className="relative">
                <input type="number" value={corporateTaxRate} onChange={(e) => setCorporateTaxRate(parseFloat(e.target.value))} className={inputClasses} min={0} max={100} required />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            {statusMessage && (
              <div className={`p-4 rounded-2xl border text-sm font-bold text-center flex items-center justify-center gap-2 ${
                statusMessage.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {statusMessage.type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
                {statusMessage.text}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-[2.5rem] font-black text-xl transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 ${loading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-[#F2B824] hover:bg-yellow-500 text-black shadow-[0_20px_40px_rgba(242,184,36,0.25)]'}`}
            >
              {loading && <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>}
              {loading ? t("saving") : t("save_settings")}
            </button>
          </div>
        </form>
      </div>

      <div className="p-8 glass rounded-[2rem] border border-blue-500/10 bg-blue-500/5 text-center">
        <p className="text-blue-400 font-medium text-sm leading-relaxed">
          {t("settings_note")}
        </p>
      </div>
    </div>
  );
}

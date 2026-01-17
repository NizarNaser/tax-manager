"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [bundesland, setBundesland] = useState("");
  const [vatRate, setVatRate] = useState(19);
  const [corporateTaxRate, setCorporateTaxRate] = useState(15);

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
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, bundesland, vatRate, corporateTaxRate }),
    });
    const data = await res.json();
    alert("Settings saved successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Company Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Bundesland</label>
          <select
            value={bundesland}
            onChange={(e) => setBundesland(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Bundesland</option>
            <option value="Bayern">Bayern</option>
            <option value="Berlin">Berlin</option>
            <option value="Hamburg">Hamburg</option>
            <option value="Hessen">Hessen</option>
            <option value="NRW">Nordrhein-Westfalen</option>
            <option value="Sachsen">Sachsen</option>
            <option value="Thüringen">Thüringen</option>
            {/* أضف كل Bundesländer حسب الحاجة */}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">VAT Rate (%)</label>
          <input
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
            min={0}
            max={100}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Corporate Tax Rate (%)</label>
          <input
            type="number"
            value={corporateTaxRate}
            onChange={(e) => setCorporateTaxRate(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
            min={0}
            max={100}
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Settings
        </button>
      </form>
    </div>
  );
}

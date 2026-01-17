"use client";

import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function InvoiceList({ invoices = [], onEdit, onDelete }) {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (Array.isArray(invoices)) {
      setList(invoices);
    } else {
      setList([]);
    }
  }, [invoices]);

  const downloadExcel = async () => {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rechnungen");

    worksheet.columns = [
      { header: "Typ", key: "type", width: 10 },
      { header: "Titel", key: "title", width: 30 },
      { header: "Betrag", key: "amount", width: 15 },
      { header: "Datum", key: "date", width: 20 },
      { header: "Beschreibung", key: "description", width: 30 },
      { header: "Bild-URL", key: "imageUrl", width: 40 },
    ];

    list.forEach(inv =>
      worksheet.addRow({
        type: inv.type === 'income' ? 'Einnahme' : 'Ausgabe',
        title: inv.title,
        amount: inv.amount,
        date: inv.date ? new Date(inv.date).toLocaleDateString('de-DE') : "",
        description: inv.description,
        imageUrl: inv.imageUrl || "",
      })
    );

    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rechnungen.xlsx";
    a.click();
  };

  const handleOpenImage = (url) => {
    setCurrentImage(url);
    setOpen(true);
  };

  const downloadImageHelper = async (inv) => {
    try {
      const res = await fetch(inv.imageUrl, { mode: "cors" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Rechnung_${inv.title}_${new Date(inv.date)
        .toISOString()
        .slice(0, 10)}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
      alert("Fehler beim Herunterladen des Bildes");
    }
  }

  const ActionButtons = ({ inv }) => (
    <div className="flex gap-3 justify-center">
      {onEdit && (
        <button
          onClick={() => onEdit(inv)}
          className="bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-black px-4 py-1.5 text-xs font-bold rounded-lg transition-all border border-yellow-500/20"
        >
          Bearbeiten
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => {
            if (confirm("Sind Sie sicher, dass Sie diese Rechnung löschen möchten?")) {
              onDelete(inv._id);
            }
          }}
          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-1.5 text-xs font-bold rounded-lg transition-all border border-red-500/20"
        >
          Löschen
        </button>
      )}
    </div>
  );

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
          Rechnungsliste
        </h2>
        <button
          onClick={downloadExcel}
          className="w-full sm:w-auto bg-[#F2B824] hover:bg-yellow-500 text-black px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-[0_10px_20px_rgba(242,184,36,0.2)] active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Excel herunterladen
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-center p-16 glass rounded-[2.5rem] border border-white/5 text-slate-500">
          <div className="mb-4 text-slate-600">
            <svg className="w-16 h-16 mx-auto opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg">Derzeit keine Rechnungen vorhanden.</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-4">
            {list.map((inv) => (
              <div key={inv._id} className="glass p-6 rounded-[2rem] border border-white/5 flex flex-col gap-4 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-2 h-full ${inv.type === 'income' ? 'bg-green-500' : 'bg-red-500'} opacity-20`}></div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{inv.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{inv.date ? new Date(inv.date).toLocaleDateString('de-DE') : ""}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inv.type === 'income' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {inv.type === 'income' ? 'Einnahme' : 'Ausgabe'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-y border-white/5">
                  <p className="text-sm text-slate-400">Betrag:</p>
                  <p className="text-xl font-black text-white">{inv.amount} €</p>
                </div>

                {inv.description && (
                  <p className="text-sm text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5 italic">"{inv.description}"</p>
                )}

                <div className="flex items-center justify-between mt-2">
                  {inv.imageUrl ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={inv.imageUrl}
                        alt="Rechnung"
                        className="w-12 h-12 object-cover rounded-xl cursor-pointer border border-white/10 hover:border-yellow-500 transition-all"
                        onClick={() => handleOpenImage(inv.imageUrl)}
                      />
                      <button
                        onClick={() => downloadImageHelper(inv)}
                        className="text-blue-400 text-xs font-bold hover:text-blue-300 underline underline-offset-4"
                      >
                        Bild speichern
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-600">Kein Bild</span>
                  )}

                  <ActionButtons inv={inv} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-6">Status</th>
                  <th className="p-6">Titel</th>
                  <th className="p-6">Betrag</th>
                  <th className="p-6">Datum</th>
                  <th className="p-6">Beschreibung</th>
                  <th className="p-6 text-center">Bild</th>
                  <th className="p-6 text-center">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((inv) => (
                  <tr key={inv._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inv.type === 'income' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {inv.type === 'income' ? 'Einnahme' : 'Ausgabe'}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-white group-hover:text-yellow-500 transition-colors">{inv.title}</td>
                    <td className="p-6 font-black text-lg text-white">{inv.amount} €</td>
                    <td className="p-6 text-slate-400">
                      {inv.date ? new Date(inv.date).toLocaleDateString('de-DE') : ""}
                    </td>
                    <td className="p-6 text-slate-500 max-w-xs truncate" title={inv.description}>{inv.description || "---"}</td>
                    <td className="p-6">
                      <div className="flex flex-col items-center gap-2">
                        {inv.imageUrl ? (
                          <>
                            <img
                              src={inv.imageUrl}
                              alt="Rechnung"
                              className="w-12 h-12 object-cover rounded-xl cursor-pointer border border-white/10 hover:border-yellow-500 hover:scale-110 transition-all shadow-lg"
                              onClick={() => handleOpenImage(inv.imageUrl)}
                            />
                            <button
                              className="text-blue-400 text-[10px] font-bold hover:text-blue-300 transition-colors"
                              onClick={() => downloadImageHelper(inv)}
                            >
                              Speichern
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-600 text-[10px]">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <ActionButtons inv={inv} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={[{ src: currentImage }]}
          className="backdrop-blur-xl"
        />
      )}
    </div>
  );
}

"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function InvoicePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [invoice, setInvoice] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoices/${params.id}`);
        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoice();
  }, [params.id]);

  const downloadImage = () => {
    if (!invoice?.imageUrl) return;
    const a = document.createElement("a");
    a.href = invoice.imageUrl;
    a.download = `Rechnung_${invoice._id}.jpg`; // Invoice
    a.click();
  };

  if (!invoice) return <p>Daten werden geladen...</p>; {/* جارٍ تحميل البيانات... */}

  return (
    <article className="max-w-xl mx-auto p-4 border rounded shadow">
      <h3 className="text-xl font-bold mb-2">Rechnung: {invoice.title}</h3> {/* فاتورة */}
      <p><strong>Rechnungsart:</strong> {invoice.type}</p> {/* نوع الفاتورة */}
      <p><strong>Betrag:</strong> {invoice.amount} €</p> {/* المبلغ */}
      <p><strong>Datum:</strong> {new Date(invoice.date).toLocaleDateString()}</p> {/* التاريخ */}
      <p><strong>Beschreibung:</strong> {invoice.description}</p> {/* الوصف */}

      {invoice.imageUrl && (
        <div className="mt-4">
          <img
            src={invoice.imageUrl}
            alt="Rechnung"
            style={{ maxWidth: "100%", cursor: "pointer" }}
            onClick={() => setLightboxOpen(true)}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setLightboxOpen(true)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Bild vergrößern {/* تكبير الصورة */}
            </button>
            <button
              onClick={downloadImage}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Bild herunterladen {/* تحميل الصورة */}
            </button>
          </div>
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: invoice.imageUrl }]}
        />
      )}
    </article>
  );
}

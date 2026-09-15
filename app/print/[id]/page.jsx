"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "../../../components/LanguageContext";
import { getCurrencySymbol } from "../../../utils/currency";

export default function PrintInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  
  const [invoice, setInvoice] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, setRes] = await Promise.all([
          fetch(`/api/invoices/${params.id}`),
          fetch(`/api/settings`)
        ]);

        if (!invRes.ok) throw new Error("Failed to fetch invoice");
        if (!setRes.ok) throw new Error("Failed to fetch settings");

        const invData = await invRes.json();
        const setData = await setRes.json();

        setInvoice(invData);
        setSettings(setData);
      } catch (error) {
        console.error(error);
        alert(t("download_error") || "Fehler");
      } finally {
        setLoading(false);
      }
    };
    
    if (params?.id) {
      fetchData();
    }
  }, [params.id, t]);

  if (loading) {
    return <div className="p-10 text-center text-xl text-white">{t("processing") || "Wird verarbeitet..."}</div>;
  }

  if (!invoice || !settings) {
    return <div className="p-10 text-center text-xl text-white">Not found</div>;
  }

  // Calculate gross, net, vat
  const vatRate = settings.vatRate || 19;
  const currencySymbol = getCurrencySymbol(settings.currency);
  const gross = invoice.amount;
  const net = gross / (1 + (vatRate / 100));
  const vatAmount = gross - net;

  // Determine legal notice based on country
  const euCountries = [
    'Deutschland', 'Germany', 'Allemagne', 'Германия', 'Німеччина',
    'Frankreich', 'France', 'Франция', 'Франція',
    'Österreich', 'Austria', 'Autriche', 'Австрия', 'Австрія',
    'Schweiz', 'Switzerland', 'Suisse', 'Svizzera', 'Швейцария', 'Швейцарія',
    'Niederlande', 'Netherlands', 'Pays-Bas', 'Нидерланды', 'Нідерланди',
    'Belgien', 'Belgium', 'Belgique', 'Бельгия', 'Бельгія',
    'Luxemburg', 'Luxembourg', 'Люксембург',
    'Italien', 'Italy', 'Italie', 'Italia', 'Италия', 'Італія',
    'Spanien', 'Spain', 'Espagne', 'España', 'Испания', 'Іспанія',
    'Portugal', 'Португалия', 'Португалія',
    'Polen', 'Poland', 'Pologne', 'Польша', 'Польща',
    'Tschechien', 'Czech Republic', 'Tchéquie', 'Чехия', 'Чехія',
    'Ungarn', 'Hungary', 'Hongrie', 'Венгрия', 'Угорщина',
    'Schweden', 'Sweden', 'Suède', 'Sverige', 'Швеция', 'Швеція',
    'Dänemark', 'Denmark', 'Danemark', 'Danmark', 'Дания', 'Данія',
    'Finnland', 'Finland', 'Finlande', 'Финляндия', 'Фінляндія',
    'Griechenland', 'Greece', 'Grèce', 'Греция', 'Греція',
    'Rumänien', 'Romania', 'Roumanie', 'Румыния', 'Румунія',
    'Bulgarien', 'Bulgaria', 'Bulgarie', 'Болгария', 'Болгарія',
    'Kroatien', 'Croatia', 'Croatie', 'Hrvatska', 'Хорватия', 'Хорватія',
    'Slowakei', 'Slovakia', 'Slovaquie', 'Словакия', 'Словаччина',
    'Slowenien', 'Slovenia', 'Slovénie', 'Словения', 'Словенія',
    'Irland', 'Ireland', 'Irlande', 'Ирландия', 'Ірландія',
    'Estland', 'Estonia', 'Estonie', 'Эстония', 'Естонія',
    'Lettland', 'Latvia', 'Lettonie', 'Latvija', 'Латвия', 'Латвія',
    'Litauen', 'Lithuania', 'Lituanie', 'Lietuva', 'Литва',
    'Malta', 'Мальта',
    'Zypern', 'Cyprus', 'Chypre', 'Кипр', 'Кіпр',
  ];

  const userCountry = (settings.country || '').trim();
  const isEU = euCountries.some(c => c.toLowerCase() === userCountry.toLowerCase());

  const getLegalNotice = () => {
    if (!userCountry) {
      // No country set — use generic bilingual notice
      return t('legal_notice1');
    }
    if (isEU) {
      // EU countries — reference the EU directives
      return t('legal_notice1');
    }
    // Non-EU countries — generic commercial notice
    const notices = {
      de: `Dieses Dokument wurde von ${userCountry} ausgestellt und ist gemäß den geltenden nationalen Handelsgesetzen ohne Unterschrift gültig.`,
      en: `This document was issued in ${userCountry} and is valid without a signature under applicable national commercial law.`,
      ar: `تم إصدار هذا المستند في ${userCountry} وهو صالح دون توقيع وفقاً للقانون التجاري الوطني المعمول به.`,
      fr: `Ce document a été émis en ${userCountry} et est valable sans signature conformément à la loi commerciale nationale applicable.`,
      uk: `Цей документ виданий у ${userCountry} та є дійсним без підпису відповідно до чинного національного законодавства.`,
      ru: `Настоящий документ выдан в ${userCountry} и действителен без подписи в соответствии с применимым национальным законодательством.`,
    };
    return notices[language] || notices['en'];
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen text-black print:bg-white print:m-0 print:p-0 font-sans">
      
      {/* Non-printable header for actions */}
      <div className="print:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
        <button
          onClick={() => {
            // Page opened in new tab — close it; fallback to /invoices
            if (window.history.length > 1) {
              window.close();
            } else {
              router.push("/invoices");
            }
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all font-bold flex items-center gap-2"
        >
          &larr; {t("cancel") || "Back"}
        </button>
        <button onClick={handlePrint} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold flex items-center gap-2 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          {t("print")}
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div className="max-w-4xl mx-auto p-8 md:p-16 bg-white print:p-8 print:max-w-none print:w-full">
        
        {/* Header: Logo and Company Details */}
        <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
          <div className="flex-1">
            {settings.companyLogo ? (
              <img src={settings.companyLogo} alt="Company Logo" className="max-h-24 object-contain mb-4" />
            ) : (
              <div className="text-3xl font-black text-slate-800 tracking-tighter mb-4 uppercase">
                {settings.companyName || "COMPANY NAME"}
              </div>
            )}
          </div>
          <div className="flex-1 text-end text-sm text-slate-600 space-y-1">
            <h2 className="font-bold text-lg text-slate-900">{settings.companyName}</h2>
            <p>{settings.address}</p>
            {settings.bundesland && settings.country ? (
              <p>{settings.bundesland}, {settings.country}</p>
            ) : (
              <p>{settings.bundesland || settings.country}</p>
            )}
            {settings.taxId && <p>{t("tax_id")}: {settings.taxId}</p>}
            {settings.vatId && <p>{t("vat_id")}: {settings.vatId}</p>}
          </div>
        </div>

        {/* Title and Dates */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-wider">
              {invoice.type === "income" ? t("invoice_doc") : t("expense_doc")}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">{t("invoice_no")}: {invoice._id.slice(-6).toUpperCase()}</p>
          </div>
          <div className="text-end text-sm">
            <p className="text-slate-500 font-bold uppercase mb-1">{t("date")}</p>
            <p className="text-lg font-bold text-slate-900">
              {new Date(invoice.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'de-DE', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="mb-12">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-900">
                <th className="py-4 font-bold uppercase tracking-wider text-sm text-start">{t("description_opt") ? t("description_opt").replace(' (optional)', '') : 'Description'}</th>
                <th className="py-4 font-bold uppercase tracking-wider text-sm text-end">{t("qty")}</th>
                <th className="py-4 font-bold uppercase tracking-wider text-sm text-end">{t("price")}</th>
                <th className="py-4 font-bold uppercase tracking-wider text-sm text-end">{t("total")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-6 text-start">
                  <p className="font-bold text-slate-900 text-lg">{invoice.title}</p>
                  {invoice.description && <p className="text-slate-500 text-sm mt-1 whitespace-pre-wrap">{invoice.description}</p>}
                </td>
                <td className="py-6 text-end text-slate-700">1</td>
                <td className="py-6 text-end text-slate-700">{gross.toFixed(2)} {currencySymbol}</td>
                <td className="py-6 text-end font-bold text-slate-900">{gross.toFixed(2)} {currencySymbol}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-16 rtl:justify-start">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-slate-600 text-sm gap-8">
              <span>{t("net_amount")}:</span>
              <span>{net.toFixed(2)} {currencySymbol}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-sm border-b border-slate-200 pb-3 gap-8">
              <span>{t("vat")} ({vatRate}%):</span>
              <span>{vatAmount.toFixed(2)} {currencySymbol}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-slate-900 pt-2 gap-8">
              <span>{t("gross_amount")}:</span>
              <span>{gross.toFixed(2)} {currencySymbol}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-slate-200 pt-8 mt-12 text-center text-xs text-slate-500 space-y-2">
          <p>{getLegalNotice()}</p>
          <p className="font-bold text-slate-400 mt-4">Powered by TaxManager</p>
        </div>

      </div>
    </div>
  );
}

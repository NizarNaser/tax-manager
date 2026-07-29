"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const { t, language, changeLanguage } = useLanguage();

  useEffect(() => {
    if (session) {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.companyLogo) {
            setCompanyLogo(data.companyLogo);
          }
        })
        .catch((err) => console.error("Error fetching logo:", err));
    }
  }, [session]);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  if (!session) return null;

  return (
    <nav className="bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F2B824] to-[#B48A1B] rounded-xl flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(242,184,36,0.2)]">
              T
            </div>
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              TaxManager
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 items-center">
            <NavLink href="/dashboard">{t("dashboard")}</NavLink>
            <NavLink href="/invoices">{t("invoices")}</NavLink>
            <NavLink href="/reports">{t("reports")}</NavLink>
            <div className="md:mr-4"></div>
            <NavLink href="/settings">{t("settings")}</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm rounded-xl px-4 py-2 pr-8 outline-none cursor-pointer transition-all focus:ring-2 focus:ring-yellow-500/50"
              >
                <option value="de">🇩🇪 DE</option>
                <option value="en">🇬🇧 EN</option>
                <option value="ar">🇸🇦 AR</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="uk">🇺🇦 UK</option>
                <option value="ru">🇷🇺 RU</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="text-left hidden lg:block flex items-center gap-3">
              {companyLogo && (
                <img src={companyLogo} alt="Logo" className="w-8 h-8 rounded-full object-cover bg-white inline-block mr-3" />
              )}
              <div className="inline-block align-middle">
                <p className="text-sm font-bold text-white leading-none mb-1">{session.user.name || t("admin")}</p>
                <div className="flex items-center justify-start gap-2 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-500 font-bold uppercase tracking-wider w-fit">
                  <span className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></span>
                  {t("user")}
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-white/5 hover:bg-red-500/10 text-red-400 hover:text-red-500 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/5 hover:border-red-500/20"
            >
              {t("logout")}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-slate-400 hover:text-white p-2 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-[80px] left-0 h-[calc(100vh-80px)] w-full bg-[#05070A]/95 backdrop-blur-2xl transform transition-transform duration-500 ease-in-out z-40 border-r border-white/5 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col space-y-4">
          <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>{t("dashboard")}</MobileNavLink>
          <MobileNavLink href="/invoices" onClick={() => setMobileMenuOpen(false)}>{t("invoices")}</MobileNavLink>
          <MobileNavLink href="/reports" onClick={() => setMobileMenuOpen(false)}>{t("reports")}</MobileNavLink>
          <div className="mt-4"></div>
          <MobileNavLink href="/settings" onClick={() => setMobileMenuOpen(false)}>{t("settings")}</MobileNavLink>

          <div className="h-px bg-white/5 my-4"></div>
          
          <div className="flex px-4 justify-between items-center mb-4">
            <span className="text-white text-sm">Language</span>
            <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2 outline-none cursor-pointer"
              >
                <option value="de">🇩🇪 DE</option>
                <option value="en">🇬🇧 EN</option>
                <option value="ar">🇸🇦 AR</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="uk">🇺🇦 UK</option>
                <option value="ru">🇷🇺 RU</option>
              </select>
          </div>

          <div className="px-4 py-2">
            <div className="flex items-center gap-3 mb-4">
              {companyLogo && (
                <img src={companyLogo} alt="Logo" className="w-10 h-10 rounded-full object-cover bg-white" />
              )}
              <div>
                <p className="text-lg font-bold text-white mb-1">{session.user.name}</p>
                <p className="text-sm text-slate-500">{session.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }}
              className="w-full text-center bg-red-500/10 text-red-500 py-4 rounded-2xl hover:bg-red-500/20 font-bold border border-red-500/20 transition-all"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link href={href} className="text-slate-400 hover:text-white font-bold transition-all text-sm relative group py-2">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-6 py-4 text-slate-300 hover:bg-white/5 hover:text-white rounded-2xl transition-all font-bold text-lg border border-transparent hover:border-white/5"
    >
      {children}
    </Link>
  )
}

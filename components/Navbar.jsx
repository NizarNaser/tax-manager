"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const isAdmin = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").split(",").includes(session?.user?.email);

  if (!session || !isAdmin) return null;

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
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/invoices">Rechnungen</NavLink>
            <NavLink href="/reports">Berichte</NavLink>
            <div className="md:mr-4"></div>
            <NavLink href="/settings">Einstellungen</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-left hidden lg:block">
              <p className="text-sm font-bold text-white leading-none mb-1">{session.user.name || "Admin"}</p>
              <div className="flex items-center justify-start gap-2 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-500 font-bold uppercase tracking-wider">
                <span className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></span>
                Administrator
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-white/5 hover:bg-red-500/10 text-red-400 hover:text-red-500 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/5 hover:border-red-500/20"
            >
              Abmelden
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
          <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
          <MobileNavLink href="/invoices" onClick={() => setMobileMenuOpen(false)}>Rechnungen</MobileNavLink>
          <MobileNavLink href="/reports" onClick={() => setMobileMenuOpen(false)}>Berichte</MobileNavLink>
          <div className="mt-4"></div>
          <MobileNavLink href="/settings" onClick={() => setMobileMenuOpen(false)}>Einstellungen</MobileNavLink>

          <div className="h-px bg-white/5 my-4"></div>

          <div className="px-4 py-2">
            <p className="text-lg font-bold text-white mb-1">{session.user.name}</p>
            <p className="text-sm text-slate-500 mb-6">{session.user.email}</p>
            <button
              onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }}
              className="w-full text-center bg-red-500/10 text-red-500 py-4 rounded-2xl hover:bg-red-500/20 font-bold border border-red-500/20 transition-all"
            >
              Abmelden
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

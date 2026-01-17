"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const isAdmin = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").split(",").includes(session?.user?.email);

  // Hide Navbar if not logged in or not admin
  if (!session || !isAdmin) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              T
            </div>
            <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight">TaxManager</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 space-x-reverse items-center">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/invoices">Invoices</NavLink>
            <NavLink href="/reports">Reports</NavLink>
            <NavLink href="/settings">Settings</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-slate-900">{session.user.name || "Admin"}</p>
              <p className="text-xs text-slate-500">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              تسجيل خروج
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-slate-600 hover:text-slate-900 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
        className={`md:hidden fixed top-[64px] left-0 h-[calc(100vh-64px)] w-full bg-white/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-40 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 flex flex-col space-y-2">
          <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
          <MobileNavLink href="/invoices" onClick={() => setMobileMenuOpen(false)}>Invoices</MobileNavLink>
          <MobileNavLink href="/reports" onClick={() => setMobileMenuOpen(false)}>Reports</MobileNavLink>
          <MobileNavLink href="/settings" onClick={() => setMobileMenuOpen(false)}>Settings</MobileNavLink>

          <div className="h-px bg-slate-100 my-2"></div>

          <div className="px-4 py-2">
            <p className="text-sm font-medium text-slate-900">{session.user.name || "Admin"}</p>
            <p className="text-xs text-slate-500 mb-2">{session.user.email}</p>
            <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }} className="w-full text-center bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100">
              تسجيل خروج
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link href={href} className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
    >
      {children}
    </Link>
  )
}

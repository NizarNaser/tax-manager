"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // إخفاء Navbar بالكامل إذا لم يكن Admin
  if (!session || !isAdmin) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">TaxManager</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/dashboard" className="hover:text-gray-200">Dashboard</Link>
            <Link href="/settings" className="hover:text-gray-200">Settings</Link>
            <Link href="/reports" className="hover:text-gray-200">Reports</Link>
            <Link href="/invoices" className="hover:text-gray-200">Invoices</Link>
            <button onClick={() => signOut()} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
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
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-blue-700 text-white transform transition-transform duration-300 ease-in-out z-50 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 flex flex-col space-y-4 mt-16">
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-200">Dashboard</Link>
          <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-200">Settings</Link>
          <Link href="/reports" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-200">Reports</Link>
          <Link href="/invoices" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-200">Invoices</Link>

          <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}

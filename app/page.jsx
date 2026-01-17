"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const isAdmin = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").split(",").includes(session?.user?.email);

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {!session ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-slate-100">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200">
            T
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 mb-8">Sign in to manage your tax invoices</p>
          <button
            onClick={() => signIn("google")}
            className="w-full bg-white border border-slate-300 text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.-.19-.58z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      ) : !isAdmin ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-slate-100">
          <div className="mb-4 text-red-500 mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-6 font-medium">
            هذا الحساب غير مسجل كمسؤول. يرجى التواصل مع الإدارة.
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-slate-500 hover:text-slate-700 text-sm hover:underline transition-all"
          >
            تسجيل خروج
          </button>
        </div>
      ) : (
        <div className="text-center w-full max-w-4xl">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Tax Manager Dashboard</h1>
            <p className="text-slate-500 text-lg">Welcome back, {session.user.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Invoices"
              desc="Create and manage tax invoices"
              href="/invoices"
              icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
            <DashboardCard
              title="Reports"
              desc="View monthly financial summaries"
              href="/reports"
              icon={<svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
            <DashboardCard
              title="Settings"
              desc="Configure app preferences"
              href="/settings"
              icon={<svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ title, desc, icon, href }) {
  return (
    <a href={href} className="group block bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all text-left">
      <div className="mb-4 bg-slate-50 p-3 rounded-lg w-fit group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm mt-1">{desc}</p>
    </a>
  )
}

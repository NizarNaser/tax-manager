"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const isAdmin = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").split(",").includes(session?.user?.email);

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {!session ? (
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 py-12">
          {/* Hero Section */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Verwalten Sie Ihre <br />
              <span className="text-yellow-500 animate-glow">Steuern mit Qualität</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-md mr-auto">
              Das erstklassige Rechnungs- und Steuerverwaltungssystem für Profis. Schnelligkeit, Genauigkeit und Sicherheit auf höchstem Niveau.
            </p>
            <div className="flex flex-col sm:flex-row justify-start gap-4 pt-4">
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-slate-300">Sehr schnell</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-slate-300">Sicher & geschützt</span>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] -z-10 group-hover:bg-yellow-500/20 transition-all duration-700"></div>

            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center text-black text-3xl font-bold mx-auto mb-8 shadow-[0_0_30px_rgba(242,184,36,0.3)] animate-float">
              T
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 text-center">Willkommen</h2>
            <p className="text-slate-400 mb-10 text-center text-sm">Melden Sie sich an, um auf das Dashboard zuzugreifen</p>

            <button
              onClick={() => signIn("google")}
              className="w-full bg-white hover:bg-slate-100 text-[#05070A] font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-4 group active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.-.19-.58z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Mit Google anmelden
            </button>
          </div>
        </div>
      ) : !isAdmin ? (
        <div className="glass p-12 rounded-[2.5rem] shadow-2xl w-full max-w-lg text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
          <div className="mb-8 text-red-500 mx-auto w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Zugriff verweigert</h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            Entschuldigung, dieses Konto ist nicht als Administrator registriert. <br />Bitte kontaktieren Sie die Verwaltung.
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-4 rounded-2xl transition-all border border-red-500/20"
          >
            Abmelden
          </button>
        </div>
      ) : (
        <div className="text-center w-full max-w-6xl space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-400 text-xl">Willkommen zurück, <span className="text-yellow-500 font-bold">{session.user.name}</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard
              title="Rechnungen"
              desc="Erstellen und verwalten Sie Ihre Steuerrechnungen"
              href="/invoices"
              icon={<svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              count="54"
              color="yellow"
            />
            <DashboardCard
              title="Berichte"
              desc="Monatliche Finanzzusammenfassungen anzeigen"
              href="/reports"
              icon={<svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              count="12"
              color="blue"
            />
            <DashboardCard
              title="Einstellungen"
              desc="App-Präferenzen und Währung konfigurieren"
              href="/settings"
              icon={<svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              count="OK"
              color="purple"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ title, desc, icon, href, count, color }) {
  const colorMap = {
    yellow: "from-yellow-500/20 via-yellow-500/5 to-transparent border-yellow-500/20 hover:border-yellow-500/50",
    blue: "from-blue-500/20 via-blue-500/5 to-transparent border-blue-500/20 hover:border-blue-500/50",
    purple: "from-purple-500/20 via-purple-500/5 to-transparent border-purple-500/20 hover:border-purple-500/50"
  };

  return (
    <a href={href} className={`group block glass p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden text-left hover:-translate-y-2 ${colorMap[color]}`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br opacity-10 group-hover:opacity-20 blur-2xl transition-all duration-700 ${colorMap[color].split(" ")[0]}`}></div>

      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-all duration-500`}>
          {icon}
        </div>
        <div className="text-3xl font-black text-white/20 group-hover:text-white transition-all duration-500">
          {count}
        </div>
      </div>

      <h3 className="font-bold text-2xl text-white mb-3 group-hover:text-yellow-500 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>

      <div className="mt-8 flex items-center justify-start gap-2 text-yellow-500 font-bold text-sm">
        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>Jetzt ansehen</span>
      </div>
    </a>
  )
}

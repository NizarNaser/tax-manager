
import Navbar from '../components/Navbar';
import Providers from '../components/Providers';
import './globals.css';

const siteUrl = process.env.NEXTAUTH_URL || "https://tax-manager.lughaty.cloud";
const description =
    "TaxManager: invoicing and tax management for freelancers and small businesses. Create EU-compliant invoices, track income and expenses, and export monthly reports.";

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "TaxManager — Invoicing & Tax Management",
        template: "%s · TaxManager",
    },
    description,
    applicationName: "TaxManager",
    manifest: "/site.webmanifest",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icon0.svg", type: "image/svg+xml" },
            { url: "/icon1.png", type: "image/png" },
        ],
        apple: "/apple-icon.png",
    },
    openGraph: {
        type: "website",
        url: siteUrl,
        siteName: "TaxManager",
        title: "TaxManager — Invoicing & Tax Management",
        description,
        images: [{ url: "/web-app-manifest-512x512.png", width: 512, height: 512 }],
    },
    twitter: {
        card: "summary",
        title: "TaxManager — Invoicing & Tax Management",
        description,
    },
    robots: {
        index: true,
        follow: true,
    },
};


const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TaxManager",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (Web)",
    description,
    url: siteUrl,
};

export default function RootLayout({ children }) {
    return (
        <html lang="de" dir="ltr">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </head>
            <body className="font-['Cairo'] bg-[#05070A] text-slate-100 antialiased min-h-screen flex flex-col relative overflow-x-hidden">
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-yellow-500 focus:text-black focus:font-bold focus:px-4 focus:py-2 focus:rounded-xl"
                >
                    Skip to content
                </a>
                <div className="stars-container" aria-hidden="true">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="star"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 3}px`,
                                height: `${Math.random() * 3}px`,
                                animation: `pulse-glow ${2 + Math.random() * 4}s infinite ${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
                <Providers>
                    <Navbar />
                    <main id="main-content" className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
                        {children}
                    </main>
                    <footer className="py-6 text-center text-slate-500 text-sm border-t border-white/5 bg-black/20 backdrop-blur-sm space-y-2">
                        <div className="flex items-center justify-center gap-4 flex-wrap px-4">
                            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                            <span aria-hidden="true">·</span>
                            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms</a>
                            <span aria-hidden="true">·</span>
                            <a href="/imprint" className="hover:text-slate-300 transition-colors">Imprint</a>
                        </div>
                        &copy; {new Date().getFullYear()} TaxManager. All rights reserved.
                    </footer>
                </Providers>
            </body>
        </html>
    );
}

import Navbar from '../components/Navbar';
import Providers from '../components/Providers';
import './globals.css';

export const metadata = { title: 'Tax Invoices App' };


export default function RootLayout({ children }) {
    return (
        <html lang="de" dir="ltr">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
            </head>
            <body className="font-['Cairo'] bg-[#05070A] text-slate-100 antialiased min-h-screen flex flex-col relative overflow-x-hidden">
                <div className="stars-container">
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
                    <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
                        {children}
                    </main>
                    <footer className="py-6 text-center text-slate-500 text-sm border-t border-white/5 bg-black/20 backdrop-blur-sm">
                        &copy; {new Date().getFullYear()} TaxManager. All rights reserved.
                    </footer>
                </Providers>
            </body>
        </html>
    );
}


import Navbar from '../components/Navbar';
import Providers from '../components/Providers';
import './globals.css';

export const metadata = { title: 'Tax Invoices App' };


export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
<<<<<<< HEAD
            <body>
                <Providers>{/* Navbar can show login */}
                    <Navbar />
                    <main className="container mx-auto p-4">{children}</main>
=======
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
            </head>
            <body className="font-['Cairo'] bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col">
                <Providers>
                    <Navbar />
                    <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                        {children}
                    </main>
                    <footer className="py-6 text-center text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} TaxManager. All rights reserved.
                    </footer>
>>>>>>> 48ff154 (Refactor: Modernize UI, fix dependencies, and improve project structure)
                </Providers>
            </body>
        </html>
    );
}
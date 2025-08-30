

import Navbar from '../components/Navbar';
import Providers from '../components/Providers';
import './globals.css';

export const metadata = { title: 'Tax Invoices App' };


export default function RootLayout({ children }) {
return (
<html lang="ar" dir="rtl">
<body>
<Providers>{/* Navbar can show login */}
<Navbar />
<main className="container mx-auto p-4">{children}</main>
</Providers>
</body>
</html>
);
}
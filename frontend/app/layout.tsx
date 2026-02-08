import { Inter } from 'next/font/google';
import { Toaster } from './components/ui/sooner';
import './globals.css';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sharwings - 100% Genuine Products, Unbeatable Prices | Fast Delivery',
  description: 'Discover premium products curated for the modern lifestyle at Sharwings.',
};

export default function RootLayout({ children } : {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster position="top-right" richColors />
        <Footer />
      </body>
    </html>
  );
}

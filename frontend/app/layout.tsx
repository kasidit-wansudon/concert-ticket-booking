import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/button-effects.css";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Concert Ticket Booking",
  description: "จองตั๋วคอนเสิร์ตฟรี",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

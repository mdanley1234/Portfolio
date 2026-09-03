import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

// Variable axis (300-900) rather than four static cuts: one file to download,
// and font-semibold (600) renders a real weight instead of a synthesized one.
const rubik = Rubik({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Michael Danley",
  description: "Michael Danley Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

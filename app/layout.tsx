import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Oswald } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "World Cup 2026 · Match Center",
  description:
    "Every FIFA World Cup 2026 match in your own local time — full schedule across the USA, Canada & Mexico, plus a dedicated tracker for Ecuador 🇪🇨.",
  keywords: [
    "World Cup 2026",
    "FIFA",
    "fixtures",
    "schedule",
    "Ecuador",
    "matches",
    "local time",
  ],
  openGraph: {
    title: "World Cup 2026 · Match Center",
    description:
      "Every World Cup 2026 match in your local time, plus a dedicated Ecuador tracker.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060a14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

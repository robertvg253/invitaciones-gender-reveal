import type { Metadata, Viewport } from "next";
import { Playfair_Display, Great_Vibes, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baby Shower de Avril",
  description: "Emilia & Robert te invitan a celebrar el baby shower de nuestra bebé",
  icons: {
    icon: "/lazos-dresscode/great - 11.png?v=2",
    shortcut: "/lazos-dresscode/great - 11.png?v=2",
    apple: "/lazos-dresscode/great - 11.png?v=2",
  },
};

export const viewport: Viewport = {
  themeColor: "#F9F8F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F9F8F6]">{children}</body>
    </html>
  );
}

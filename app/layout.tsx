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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined));

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "Baby Shower de Avril",
  description: "Emilia & Robert te invitan a celebrar el baby shower de nuestra bebé",
  icons: {
    icon: "/lazos-dresscode/great - 11.png?v=2",
    shortcut: "/lazos-dresscode/great - 11.png?v=2",
    apple: "/lazos-dresscode/great - 11.png?v=2",
  },
  openGraph: {
    title: "Baby Shower de Avril",
    description: "Emilia & Robert te invitan a celebrar el baby shower de nuestra bebé",
    url: "/",
    siteName: "Baby Shower de Avril",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Baby Shower de Avril",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Shower de Avril",
    description: "Emilia & Robert te invitan a celebrar el baby shower de nuestra bebé",
    images: ["/og-image.png"],
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

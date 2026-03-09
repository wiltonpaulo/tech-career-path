import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BRAND_CONFIG } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} | By ${BRAND_CONFIG.author}`,
  description: BRAND_CONFIG.tagline,
  authors: [{ name: BRAND_CONFIG.author, url: BRAND_CONFIG.website }],
  publisher: BRAND_CONFIG.company,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/src/component/Navbar";
import Loader from "@/src/component/Loader";
import LenisProvider from "@/src/component/LenisProvider";
import SheryInit from "@/src/component/SheryInit";

export const metadata: Metadata = {
  title: "Rebel Grace",
  description:
    "Rebel Grace — UIUX Designer & Developer. Elevating businesses through crafting exceptional digital experiences.",
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>
          <SheryInit />
          <Loader />
          <Navbar />
          {children}
        </LenisProvider>

        {/* Global Scripts for WebGL Effects */}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.155.0/three.min.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://unpkg.com/sheryjs/dist/Shery.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

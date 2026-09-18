import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PollarProvider } from "@pollar/react";
import "@pollar/react/styles.css";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Payo",
  description: "Send and receive USDC with Payo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PollarProvider
          client={{
            apiKey: process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY!,
            stellarNetwork: "testnet",
          }}
        >
          {children}
        </PollarProvider>
      </body>
    </html>
  );
}
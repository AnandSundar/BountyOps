import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BountyOps - Bug Bounty Operations Platform",
  description:
    "Streamline your bug bounty program with BountyOps - the modern vulnerability management platform for security teams.",
  keywords: [
    "bug bounty",
    "vulnerability",
    "security",
    "penetration testing",
    "CVE",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

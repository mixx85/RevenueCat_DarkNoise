import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SubInsights — RevenueCat Weekly Growth Memo",
  description:
    "Turn your RevenueCat charts into actionable weekly insights in 30 seconds. Built for indie app founders.",
  openGraph: {
    title: "SubInsights — RevenueCat Weekly Growth Memo",
    description: "Turn your RevenueCat charts into actionable weekly insights in 30 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

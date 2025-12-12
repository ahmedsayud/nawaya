import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nawaya | موقع عربى",
  description: "موقع تم تطويره باستخدام Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "كووورة - الموقع العربي الرياضي الأول",
  description:
    "كووورة - أخبار كرة القدم، نتائج المباريات، مواعيد المباريات، أخبار الأندية والمنتخبات العربية والعالمية",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

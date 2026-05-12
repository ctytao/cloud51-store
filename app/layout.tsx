import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloud51 Store — Mở khoá iCloud | iPhone góp | Bán Apple",
  description: "Cloud51 Store — Bán iPhone, MacBook, iPad trả góp qua iCloud. Mở khoá iCloud chuyên nghiệp. Liên hệ Zalo: 0888393339",
  keywords: ["iCloud unlock", "iPhone trả góp", "mua iPhone", "Cloud51", "bán iPhone", "MacBook iPad"],
  openGraph: {
    title: "Cloud51 Store",
    description: "Mở khoá iCloud | Bán iPhone góp qua iCloud | Vay - Góp iCloud",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

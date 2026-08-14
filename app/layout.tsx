import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/Providers";
import { CONTACT } from "@/lib/contact";
import "./globals.css";

export const metadata: Metadata = {
  title: "iGop — Mở khoá iCloud | iPhone góp | Bán Apple",
  description: `iGop — Bán iPhone, MacBook, iPad trả góp qua iCloud. Mở khoá iCloud chuyên nghiệp. Liên hệ Zalo: ${CONTACT.zalo}`,
  keywords: ["iCloud unlock", "iPhone trả góp", "mua iPhone", "iGop", "bán iPhone", "MacBook iPad"],
  openGraph: {
    title: "iGop",
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

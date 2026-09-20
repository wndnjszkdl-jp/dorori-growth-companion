import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dorori — 나를 키우는 작은 습관",
  description: "캐릭터와 함께 오늘의 마음을 돌보고 작은 습관을 키우는 곳",
  manifest: "/manifest.webmanifest",
  applicationName: "Dorori",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Dorori" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/characters/pingo.png",
  },
};

export const viewport: Viewport = { themeColor: "#d7f9f0" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

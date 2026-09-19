import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dorori — 나를 키우는 작은 습관",
  description: "캐릭터와 함께 오늘의 마음을 돌보고 작은 습관을 키우는 곳",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

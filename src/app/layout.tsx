/**
 * File:     layout.tsx
 * Purpose:  Sets the global styling and fonts to the entire frontend
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import "./globals.css";
import { Noto_Sans } from "next/font/google";

const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={noto.className}>
      <body>{children}</body>
    </html>
  );
}

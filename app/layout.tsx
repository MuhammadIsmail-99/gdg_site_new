import type { Metadata } from "next";
import "./globals.css";
import { Inter, Open_Sans, Roboto_Mono } from "next/font/google";
import AOSInit from "@/components/AOSInit";
import SmoothScroll from "@/components/SmoothScroll";
import { Providers } from './providers';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "GDGoC Chapter | Google Developer Groups on Campus",
  description: "Official website for the GDGoC Chapter. Join us to learn, build, and grow together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${openSans.variable} ${robotoMono.variable}`}>
      <body>
        <Providers>
          <SmoothScroll>
            <AOSInit />
            {children}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}

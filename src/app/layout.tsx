import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Roboto } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Providers } from "@/components/Providers";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    url: site.url,
    images: ["/images/og.png"],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${roboto.variable}`}>
      <body>
        <Providers>
          <SmoothScroll />
          <Cursor />
          <Nav />
          <main className="page">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

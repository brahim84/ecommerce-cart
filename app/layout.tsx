import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "@/components";
import SessionProvider from "@/utils/SessionProvider";
import Providers from "@/Providers";
import { getServerSession } from "next-auth";




const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remote Shop  – Gate, Garage & Automotive",
  description: "New Zealand’s Remote Control Experts – Gate, Garage & Automotive",
    icons: [
    { rel: "icon", url: "/favicon/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "96x96", url: "/favicon/favicon-96x96.png" },
    { rel: "icon", type: "image/png", sizes: "192x192", url: "/favicon/favicon-192x192.png" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-touch-icon.png" },
    { rel: "manifest", url: "/favicon/site.webmanifest" },
  ]
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
      <SessionProvider session={session}>
        <Header />
        <Providers>
        {children}
        </Providers>
        <Footer />
      </SessionProvider>
        </body>
    </html>
  );
}

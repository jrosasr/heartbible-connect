import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const exo2 = Exo_2({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heartbible Connect",
  description: "Heartbible Connect: Es la aplicación para conectar con tu biblia de corazon con otras biblias de corazon al rededor de mundo.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${exo2.className} antialiased bg-[#fefefe]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

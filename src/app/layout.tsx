// 📁 src/app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import ClientBody from "./ClientBody"; // ← Das ist deine Komponente
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auto Service 19",
  description: "Fahrzeugverwaltung & Online-Angebote",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}

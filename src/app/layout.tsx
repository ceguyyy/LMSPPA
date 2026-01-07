import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { LMSProvider } from "@/context/LMSContext";

export const metadata: Metadata = {
  title: "Video LMS",
  description: "Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LMSProvider>
          <TopNav />
          <Sidebar />
          <main className="min-h-screen">
            {children}
          </main>
        </LMSProvider>
      </body>
    </html>
  );
}

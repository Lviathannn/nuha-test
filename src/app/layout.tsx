import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { MainLayout, QueryProvider } from "@/components/layouts";

const PoppinsSans = Poppins({
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Frontend Recruitment Test | Data Integrasi Inovasi",
  description: "This is a frontend recruitment test for Data Integrasi Inovasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${PoppinsSans.className} antialiased`}>
        <QueryProvider>
          <MainLayout>{children}</MainLayout>
        </QueryProvider>
      </body>
    </html>
  );
}

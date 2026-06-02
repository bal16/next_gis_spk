import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
// import { FONT } from "@/lib/config";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { QueryParamNotifier } from "@/components/QueryParamNotifier";
import { Suspense } from "react";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "SPK Gedung",
  description: "SPK Gedung berbasis GIS",
};

const InterFont = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${InterFont.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Toaster />
            <Suspense>
              <QueryParamNotifier />
            </Suspense>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

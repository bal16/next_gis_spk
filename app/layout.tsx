import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { FONT } from "@/lib/config";

export const metadata: Metadata = {
  title: "SPK Gedung",
  description: "SPK Gedung berbasis GIS",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${FONT.className} antialiased`}
      >
        <ThemeProvider 
         attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
        <Toaster />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import OfflineProvider from "@/components/providers/offline-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Synapse",
  description: "Build knowledge that sticks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen text-foreground antialiased">
        <OfflineProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </OfflineProvider>
      </body>
    </html>
  );
}
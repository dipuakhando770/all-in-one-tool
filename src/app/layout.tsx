import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Nasir Tools",
  description: "Your Everyday Digital Toolkit",
  verification: {
    google: "nNC_6sZlQCSTbyCWAiIP__5d1jbVJGNqrxMtpZ64qMo",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

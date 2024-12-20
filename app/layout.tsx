import { ThemeProvider } from 'next-themes'
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EXIF Viwer",
  description: "Inspect any kind of image | a product of Adons.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


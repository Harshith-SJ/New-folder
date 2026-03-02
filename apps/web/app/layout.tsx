import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Drawing Whiteboard",
  description: "Solo instructor whiteboard for free drawing and teaching"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

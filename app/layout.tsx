import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tic Tac Toe - One More Round",
  description: "A little friendly competition. Challenge a friend to a quick game of Tic Tac Toe.",
};

export const viewport: Viewport = {
  themeColor: "#f7f5ef",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  title: "Kenfi",
  description: "Kenfi Application",
  icons: {
    icon: "/kinfi-mark-on-dark.svg",
    shortcut: "/kinfi-mark-on-dark.svg",
    apple: "/kinfi-mark-on-dark.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#131416" }}>
        <Providers>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

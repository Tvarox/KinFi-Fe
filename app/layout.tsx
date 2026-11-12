import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import ParticleBackground from "./components/ParticleBackground";
import Providers from "../components/Providers";
import AuthGate from "../components/AuthGate";

export const metadata: Metadata = {
  title: "Kinfi",
  description: "Your money, working smarter.",
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
        <ParticleBackground />
        <Providers>
          <div className="relative z-10 flex h-screen min-h-[100dvh]">
            <Navbar />
            <main className="flex-1 flex-col overflow-y-auto">
              <AuthGate>{children}</AuthGate>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

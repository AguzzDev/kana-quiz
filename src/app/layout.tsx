import type { Metadata } from "next";
import { ABeeZee } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

const font = ABeeZee({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kana Quiz",
  description: "Practice Hiragana & Katakana",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <GameProvider>
          <main className="relative flex justify-center items-center min-h-screen">
            <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-no-repeat bg-center bg-cover z-0 opacity-50"></div>

            <section className="relative z-10 max-w-6xl w-full h-[90vh] sm:h-[80vh] mx-auto bg-gray-300/50 shadow-2xl border-2 border-gray-400/50 bg-opacity-10 py-3 px-6 rounded-2xl overflow-hidden">
              {children}
            </section>
          </main>
        </GameProvider>
      </body>
    </html>
  );
}

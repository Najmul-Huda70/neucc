import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { Navbar } from "@/components/navbar";
import { ToasterProvider } from "@/components/toaster-provider";
import "./globals.css";
import { Footer } from "@/components/footer";
import { AiChatAssistant } from "@/components/ai-chat-assistant";

export const metadata: Metadata = {
  title: {
    default: "NEUCC — Netrokona University Computer Club",
    template: "%s | NEUCC",
  },
  description:
    "Official site of the Computer Club, Department of CSE, Netrokona University — events, contests, workshops, and the Executive Committee Election 2026.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer/>
        <ToasterProvider />
        <AiChatAssistant />
      </body>
    </html>
  );
}

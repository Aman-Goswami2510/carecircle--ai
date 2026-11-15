import type { Metadata } from "next";
import "./globals.css";
import { CareProvider } from "@/context/CareContext";
import NavigationBar from "@/components/NavigationBar";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";

export const metadata: Metadata = {
  title: "CareCircle AI – Intelligent Elderly Care & Medication Management Ecosystem",
  description:
    "Smart, collaborative healthcare management connecting elderly individuals, family members, and caregivers through secure passcode access, proactive email reminders, and adherence tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <CareProvider>
          <AccessibilityToolbar />
          <NavigationBar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                <strong>CareCircle AI</strong> • PromptWars x Catalyst Hackathon • Developed for Aman Goswami
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Demo Ready
                </span>
                <span>Protected by Passcode RLS Architecture</span>
              </div>
            </div>
          </footer>
        </CareProvider>
      </body>
    </html>
  );
}


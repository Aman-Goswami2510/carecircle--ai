"use client";

import React from "react";
import { useCare } from "@/context/CareContext";
import { Eye, Type, Volume2, ShieldCheck, RefreshCw } from "lucide-react";

export default function AccessibilityToolbar() {
  const { isHighContrast, toggleHighContrast, fontSize, setFontSize, resetDemoData } = useCare();

  const handleSpeech = () => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(
        "Welcome to CareCircle AI. You are viewing Eleanor Vance's elderly healthcare portal. All your morning medications have been taken on time. Your next dose is at 7:30 PM."
      );
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  return (
    <aside aria-label="Accessibility and Quick Role Switching Toolbar" className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Accessibility Controls */}
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Accessibility & Senior Mode:
          </span>

          <button
            onClick={toggleHighContrast}
            aria-pressed={isHighContrast}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              isHighContrast ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800 hover:bg-slate-700"
            }`}
            title="Toggle High Contrast for Visual Clarity"
          >
            <Eye className="w-3.5 h-3.5" />
            {isHighContrast ? "High Contrast: ON" : "High Contrast"}
          </button>

          <div className="flex items-center bg-slate-800 rounded p-0.5">
            <span className="px-1.5 text-slate-400 flex items-center">
              <Type className="w-3 h-3 mr-1" /> Size:
            </span>
            <button
              onClick={() => setFontSize("normal")}
              className={`px-2 py-0.5 rounded text-xs ${fontSize === "normal" ? "bg-primary-600 text-white font-bold" : "hover:text-white text-slate-400"}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("large")}
              className={`px-2 py-0.5 rounded text-sm ${fontSize === "large" ? "bg-primary-600 text-white font-bold" : "hover:text-white text-slate-400"}`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize("xlarge")}
              className={`px-2 py-0.5 rounded text-base font-bold ${fontSize === "xlarge" ? "bg-primary-600 text-white" : "hover:text-white text-slate-400"}`}
            >
              A++
            </button>
          </div>

          <button
            onClick={handleSpeech}
            className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors flex items-center gap-1 text-slate-200"
            title="Read screen aloud for visually impaired users"
          >
            <Volume2 className="w-3.5 h-3.5 text-teal-400" />
            Listen Aloud
          </button>
        </div>

        {/* Right: Reset Demo & Live Indicator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={resetDemoData}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-xs transition-colors"
            title="Reset demo data to initial state"
          >
            <RefreshCw className="w-3 h-3" /> Reset Demo
          </button>
          <span className="text-slate-500">|</span>
          <span className="text-teal-400 font-mono text-[11px]">Passcode Auth: Active (PIN: 2468)</span>
        </div>
      </div>
    </aside>
  );
}


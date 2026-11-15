"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCare } from "@/context/CareContext";
import {
  HeartHandshake,
  Pill,
  Calendar,
  BarChart3,
  Users,
  Bell,
  Menu,
  X,
  PhoneCall,
  UserCheck
} from "lucide-react";
import { UserRole } from "@/types";

export default function NavigationBar() {
  const pathname = usePathname();
  const { currentRole, setCurrentRole, currentProfile, fontSize } = useCare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: HeartHandshake },
    { href: "/medications", label: "Medications", icon: Pill },
    { href: "/adherence", label: "Adherence", icon: BarChart3 },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/care-team", label: "Care Team", icon: Users },
    { href: "/notifications", label: "Notifications & Alerts", icon: Bell },
  ];

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    patient: { title: "Elderly View (Eleanor)", badge: "Patient Mode", color: "bg-emerald-100 text-emerald-800" },
    caregiver: { title: "Caregiver View (Marcus)", badge: "Caregiver Mode", color: "bg-blue-100 text-blue-800" },
    family: { title: "Family View (Dr. Sarah)", badge: "Family Mode", color: "bg-purple-100 text-purple-800" },
  };

  const textClass = fontSize === "xlarge" ? "text-lg" : fontSize === "large" ? "text-base" : "text-sm";

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                  CareCircle<span className="text-primary-600">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-600 block -mt-1">
                  Elderly Care Ecosystem
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium transition-all ${textClass} ${
                    isActive
                      ? "bg-primary-50 text-primary-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Role Switcher & Emergency Pill */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Quick Emergency Button */}
            <Link
              href="/dashboard#emergency"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold transition-all shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>SOS Contacts</span>
            </Link>

            {/* Role Switch Dropdown */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent font-medium text-slate-700 py-1 pr-2 pl-1 cursor-pointer focus:outline-none"
                aria-label="Switch Active User Perspective"
              >
                <option value="patient">Elderly (Eleanor)</option>
                <option value="caregiver">Caregiver (Marcus)</option>
                <option value="family">Family (Dr. Sarah)</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive ? "bg-primary-50 text-primary-700 font-bold" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5 text-primary-600" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Switch Perspective:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setCurrentRole("patient");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-1 text-xs rounded-lg font-medium text-center ${
                  currentRole === "patient" ? "bg-emerald-600 text-white font-bold" : "bg-slate-100 text-slate-700"
                }`}
              >
                Elderly
              </button>
              <button
                onClick={() => {
                  setCurrentRole("caregiver");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-1 text-xs rounded-lg font-medium text-center ${
                  currentRole === "caregiver" ? "bg-blue-600 text-white font-bold" : "bg-slate-100 text-slate-700"
                }`}
              >
                Caregiver
              </button>
              <button
                onClick={() => {
                  setCurrentRole("family");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-1 text-xs rounded-lg font-medium text-center ${
                  currentRole === "family" ? "bg-purple-600 text-white font-bold" : "bg-slate-100 text-slate-700"
                }`}
              >
                Family
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


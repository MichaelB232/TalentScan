// src/components/layout/Navbar.tsx
// Top navigation bar shared across all pages.

import { BrainCircuit, Users, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Candidates", icon: Users },
  { to: "/jobs", label: "Job Descriptions", icon: FileText },
];

export default function Navbar() {
  return (
    <header className="bg-brand-blue shadow-lg sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-7 h-7 text-white" />
          <span className="text-xl font-bold text-white tracking-tight">
            TalentScan <span className="text-brand-orange font-extrabold">AI</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

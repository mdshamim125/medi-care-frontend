"use client";

import { useState } from "react";
import { Activity, Menu, Phone, X } from "lucide-react";

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const navItems = [
    { href: "#ai-matching", label: "AI Matching" },
    { href: "#doctors", label: "Top Doctors" },
    { href: "#reviews", label: "Patient Stories" },
    { href: "#footer", label: "For Clinics" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-teal-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Activity className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            medi<span className="text-teal-600">-</span>care
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+18005550199"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-teal-700"
          >
            <Phone className="h-4 w-4" />
            (800) 555-0199
          </a>
          <a
            href="#ai-matching"
            className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
          >
            Find my doctor
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-100 bg-white text-slate-900 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-teal-100 bg-white lg:hidden">
          <ul className="space-y-1 px-5 py-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#ai-matching"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Find my doctor
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
};

export default PublicNavbar;

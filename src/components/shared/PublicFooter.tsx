"use client";

import { Activity, ArrowRight, Mail, MapPin, Phone } from "lucide-react";

function PublicFooter() {
  const columns = [
    {
      title: "Patients",
      links: [
        "Find a doctor",
        "AI symptom check",
        "Insurance coverage",
        "Telehealth visits",
      ],
    },
    {
      title: "Clinics",
      links: [
        "Join the network",
        "Practice dashboard",
        "Referral tools",
        "Pricing",
      ],
    },
    {
      title: "Company",
      links: ["About medi-care", "Medical board", "Careers", "Press"],
    },
  ];

  return (
    <footer id="footer" className="w-full bg-teal-950 text-teal-100">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 py-16 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700">
                <Activity className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                medi<span className="text-teal-300">-</span>care
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-teal-200">
              AI-driven doctor suggestions that get patients to the right
              specialist faster — backed by a clinician review board.
            </p>

            <form
              className="mt-7 flex w-full max-w-sm items-center gap-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="you@email.com"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-teal-300/70 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300"
              />
              <button
                type="submit"
                className="inline-flex flex-none items-center gap-1.5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50"
              >
                Join
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-sm font-bold text-white">{column.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="text-sm text-teal-200 transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="text-sm font-bold text-white">Contact</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-teal-200">
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 flex-none" />
                  <a href="tel:+18005550199" className="hover:text-white">
                    (800) 555-0199
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 flex-none" />
                  <a
                    href="mailto:care@medi-care.com"
                    className="hover:text-white"
                  >
                    care@medi-care.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-none" />
                  240 Harbor Ave, Suite 500
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-teal-300">
            © {new Date().getFullYear()} medi-care Health, Inc. All rights
            reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-teal-300">
            {[
              "Privacy Policy",
              "Terms of Service",
              "HIPAA Notice",
              "Accessibility",
            ].map((item) => (
              <li key={item}>
                <a href="#top" className="transition-colors hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;

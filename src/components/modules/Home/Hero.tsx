import { ArrowRight, CalendarClock, PlayCircle, ShieldCheck, Sparkles, Star } from "lucide-react";

const stats = [
  { value: "1,200+", label: "Verified specialists" },
  { value: "94%", label: "Match accuracy" },
  { value: "<2 min", label: "Average time to match" },
];

const symptomPills = ["Chest tightness", "Shortness of breath", "Age 54"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#f7f5f0]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-teal-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 h-[420px] w-[420px] rounded-full bg-teal-50 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI-driven doctor suggestion
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Describe your symptoms.
            <br />
            <span className="text-teal-600">We find the right doctor.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
            medi-care reads your symptoms, history, insurance and location, then ranks the specialists most likely to resolve your case — with a clear reason behind every suggestion.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#ai-matching"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(11,43,51,0.04),0_12px_32px_-12px_rgba(11,43,51,0.16)] transition-colors hover:bg-teal-700"
            >
              Get my doctor match
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#doctors"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:border-teal-300 hover:bg-teal-50"
            >
              <PlayCircle className="h-4 w-4 text-teal-600" />
              See how it works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              HIPAA-compliant & clinician reviewed
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              4.9 average from 18,000+ patients
            </span>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-teal-100 pt-7">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{stat.value}</dd>
                <dt className="mt-1 block text-xs font-medium leading-snug text-slate-600">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <div className="rounded-3xl border border-teal-100 bg-white p-5 shadow-[0_2px_4px_rgba(11,43,51,0.05),0_24px_48px_-16px_rgba(11,43,51,0.22)] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-teal-50 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Doctor Match AI</p>
                  <p className="text-xs text-slate-600">Live suggestion engine</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                Analyzing
              </span>
            </div>

            <div className="pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Patient input</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {symptomPills.map((symptom) => (
                  <span key={symptom} className="rounded-full border border-teal-100 bg-[#f7f5f0] px-3 py-1.5 text-xs font-medium text-slate-700">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            <ol className="mt-6 space-y-2.5">
              {[
                "Reading symptoms & history",
                "Ranking 1,200 specialists",
                "Best-fit doctors ready",
              ].map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border ${index < 2 ? "border-teal-500 bg-teal-500 text-white" : "border-teal-100 bg-white text-teal-200"}`}>
                    {index < 2 ? <Sparkles className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
                  </span>
                  <span className={`text-sm ${index < 2 ? "font-semibold text-slate-900" : "text-slate-600"}`}>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-2xl bg-[#f7f5f0] p-4">
              <div className="space-y-3">
                {[
                  { name: "Dr. Anaya Raghunathan", detail: "Cardiologist · Northline Heart Institute", fit: "96% fit" },
                  { name: "Dr. Marcus Ellison", detail: "Neurologist · St. Bridget Medical Center", fit: "92% fit" },
                ].map((doctor) => (
                  <div key={doctor.name} className="rounded-xl border border-teal-100 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-lg font-bold text-teal-700">
                        {doctor.name.split(" ")[1]?.[0] ?? "D"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">{doctor.name}</p>
                        <p className="truncate text-xs text-slate-600">{doctor.detail}</p>
                      </div>
                      <span className="flex-none rounded-lg bg-teal-600 px-2 py-1 text-[11px] font-bold text-white">
                        {doctor.fit}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        4.9
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        Tomorrow, 9:30 AM
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  BrainCircuit,
  CalendarCheck,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us what you feel",
    body: "Answer a 90-second symptom check in plain language — no medical jargon required.",
  },
  {
    icon: BrainCircuit,
    title: "The AI ranks specialists",
    body: "It weighs your history, outcomes, insurance, distance and availability against 1,200 verified doctors.",
  },
  {
    icon: CalendarCheck,
    title: "Book your best fit",
    body: "See a fit score and the reasoning behind it, then confirm an appointment in a single tap.",
  },
];

const Specialities = () => {
  return (
    <section id="ai-matching" className="w-full bg-white py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
            How matching works
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            The right specialist, chosen by evidence — not by guesswork
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-700">
            Most patients see the wrong specialist first. Our matching engine
            closes that gap by explaining every recommendation it makes.
          </p>

          <ol className="mt-10 space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="flex gap-5">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      <span className="mr-2 text-teal-500">0{index + 1}</span>
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-700">
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[#f7f5f0] px-4 py-3 text-sm text-slate-700">
            <ShieldCheck className="h-4 w-4 flex-none text-teal-600" />
            Every suggestion is reviewed against clinical guidelines by our
            medical board.
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-[#f7f5f0]">
            <img
              src="https://cdn.magicpatterns.com/patterns/generated-images/6214df44-755f-4a03-955f-fc4dc355f96e.jpg"
              alt="A patient checking their doctor matches on a phone in a bright clinic waiting area"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-teal-100 bg-white/95 p-4 backdrop-blur-sm sm:left-6 sm:right-auto sm:max-w-xs">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                Average outcome
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-900">
                Patients matched by medi-care reach the correct specialist{" "}
                <span className="font-bold">2.4× faster</span> than
                self-referral.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialities;

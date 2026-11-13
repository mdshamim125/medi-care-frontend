import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ISpecialty } from "@/types/specialities.interface";
import {
  ArrowRight,
  CalendarCheck,
  Search,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

interface SpecialtiesProps {
  specialties: ISpecialty[];
  totalCount: number;
}

const careSteps = [
  {
    icon: Search,
    title: "Explore doctors",
    description: "Browse profiles and find a provider whose specialty fits your needs.",
  },
  {
    icon: CalendarCheck,
    title: "Choose an appointment",
    description: "Review available schedules and request a time that works for you.",
  },
  {
    icon: Stethoscope,
    title: "Keep care organized",
    description: "Manage your appointments and follow-up details from your dashboard.",
  },
];

export default function Specialties({
  specialties,
  totalCount,
}: SpecialtiesProps) {
  const visibleSpecialties = specialties.slice(0, 8);

  return (
    <section id="specialties" className="bg-muted/35 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Browse by specialty
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Start with the care you need
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Explore {totalCount} {totalCount === 1 ? "specialty" : "specialties"}{" "}
              and find doctors who focus on the care you’re looking for.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-fit rounded-xl border-border bg-card"
          >
            <Link href="/consultation">
              Browse all doctors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {visibleSpecialties.length > 0 ? (
          <ul className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visibleSpecialties.map((specialty) => (
              <li key={specialty.id}>
                <Link
                  href={`/consultation?specialties=${encodeURIComponent(specialty.title)}`}
                  className="group flex h-full min-h-24 items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md sm:gap-4 sm:p-5"
                >
                  <Avatar className="h-11 w-11 rounded-xl bg-primary/5">
                    <AvatarImage src={specialty.icon} alt="" />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                      <Stethoscope className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground">
                      {specialty.title}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                      Find a doctor
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-9 rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <Stethoscope className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-semibold text-foreground">
              Specialty listings will appear here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              You can still browse all available doctor profiles.
            </p>
          </div>
        )}

        <div
          id="care-journey"
          className="mt-16 border-t border-border pt-14 sm:mt-20 sm:pt-16"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Simple from start to finish
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Your next step, made easier
            </h2>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {careSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.title}
                  className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-bold tabular-nums text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

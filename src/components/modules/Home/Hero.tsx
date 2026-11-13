import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/formatters";
import { IDoctor } from "@/types/doctor.interface";
import { ArrowRight, CalendarCheck, ShieldCheck, Star, Stethoscope } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  doctors: IDoctor[];
  doctorCount: number;
  specialtyCount: number;
}

export function Hero({ doctors, doctorCount, specialtyCount }: HeroProps) {
  const featuredDoctors = doctors.slice(0, 2);

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="pointer-events-none absolute -right-36 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 -z-10 h-[420px] w-[420px] rounded-full bg-accent blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
            <Stethoscope className="h-3.5 w-3.5" />
            Care that connects
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find care with
            <br />
            <span className="text-primary">a clearer next step.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Explore doctor profiles, compare specialties, and book an
            appointment—all in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 rounded-xl px-6 font-semibold shadow-md shadow-primary/15">
              <Link href="/consultation">
                Explore doctors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-border/80 bg-card px-6 font-semibold"
            >
              <a href="#care-journey">
                <CalendarCheck className="h-4 w-4 text-primary" />
                How it works
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Clear doctor profiles
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />
              Convenient online booking
            </span>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-border pt-7">
            <div>
              <dd className="text-3xl font-extrabold tracking-tight text-foreground">
                {doctorCount}
              </dd>
              <dt className="mt-1 text-sm font-medium text-muted-foreground">
                {doctorCount === 1 ? "Doctor in directory" : "Doctors in directory"}
              </dt>
            </div>
            <div>
              <dd className="text-3xl font-extrabold tracking-tight text-foreground">
                {specialtyCount}
              </dd>
              <dt className="mt-1 text-sm font-medium text-muted-foreground">
                {specialtyCount === 1 ? "Care specialty" : "Care specialties"}
              </dt>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/5 blur-xl" />
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[0_24px_70px_-32px_rgba(15,118,110,0.28)]">
            <div className="flex items-center justify-between gap-4 border-b border-border/70 bg-muted/30 px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-bold text-foreground">
                  Meet our doctors
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  From the Medi-Care directory
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {doctorCount} listed
              </span>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {featuredDoctors.length > 0 ? (
                featuredDoctors.map((doctor) => {
                  const profilePhoto =
                    typeof doctor.profilePhoto === "string"
                      ? doctor.profilePhoto
                      : undefined;
                  const primarySpecialty =
                    doctor.doctorSpecialties?.[0]?.specialities?.title;
                  const rating = Number(doctor.averageRating ?? 0);

                  return (
                    <article
                      key={doctor.id ?? doctor.email}
                      className="rounded-2xl border border-border/70 bg-background p-4 transition-colors hover:border-primary/30"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-xl ring-1 ring-border">
                          <AvatarImage
                            src={profilePhoto}
                            alt={doctor.name}
                          />
                          <AvatarFallback className="rounded-xl bg-primary/10 font-semibold text-primary">
                            {getInitials(doctor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-foreground">
                            {doctor.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {doctor.designation}
                          </p>
                        </div>
                        {rating > 0 && (
                          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="truncate text-xs text-muted-foreground">
                          {primarySpecialty || "General consultation"}
                        </span>
                        <Link
                          href={
                            doctor.id
                              ? `/consultation/doctor/${doctor.id}`
                              : "/consultation"
                          }
                          className="shrink-0 text-xs font-semibold text-primary hover:underline"
                        >
                          View profile
                        </Link>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-border px-5 py-10 text-center">
                  <Stethoscope className="mx-auto h-7 w-7 text-muted-foreground" />
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Browse the doctor directory
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Doctor profiles will appear here when available.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-border/70 px-5 py-4 sm:px-6">
              <Link
                href="/consultation"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                View all doctors
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

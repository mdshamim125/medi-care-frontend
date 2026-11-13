import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/formatters";
import { IDoctor } from "@/types/doctor.interface";
import { ArrowRight, MapPin, Star, Stethoscope } from "lucide-react";
import Link from "next/link";

interface TopRatedDoctorsProps {
  doctors: IDoctor[];
  totalCount: number;
  loadFailed: boolean;
}

const formatFee = (fee: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(fee);

export default function TopRatedDoctors({
  doctors,
  totalCount,
  loadFailed,
}: TopRatedDoctorsProps) {
  const featuredDoctors = doctors.slice(0, 4);

  return (
    <section id="doctors" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Meet the care team
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Doctors in our directory
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              {totalCount > 0
                ? `Explore ${totalCount} ${totalCount === 1 ? "doctor profile" : "doctor profiles"} and learn more about their experience and specialties.`
                : "Explore doctor profiles and learn more about their experience and specialties."}
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

        {featuredDoctors.length > 0 ? (
          <ul className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDoctors.map((doctor) => {
              const profilePhoto =
                typeof doctor.profilePhoto === "string"
                  ? doctor.profilePhoto
                  : undefined;
              const specialties =
                doctor.doctorSpecialties
                  ?.map((item) => item.specialities?.title)
                  .filter((title): title is string => Boolean(title)) ?? [];
              const rating = Number(doctor.averageRating ?? 0);

              return (
                <li key={doctor.id ?? doctor.email}>
                  <article className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-14 w-14 rounded-2xl ring-1 ring-border">
                        <AvatarImage src={profilePhoto} alt={doctor.name} />
                        <AvatarFallback className="rounded-2xl bg-primary/10 font-semibold text-primary">
                          {getInitials(doctor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <h3 className="truncate text-base font-bold text-foreground">
                          {doctor.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                          {doctor.designation}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex min-h-7 flex-wrap gap-1.5">
                      {specialties.length > 0 ? (
                        specialties.slice(0, 2).map((specialty) => (
                          <span
                            key={specialty}
                            className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary"
                          >
                            {specialty}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Stethoscope className="h-3.5 w-3.5" />
                          General consultation
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {doctor.currentWorkingPlace && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">
                            {doctor.currentWorkingPlace}
                          </span>
                        </p>
                      )}
                      {typeof doctor.experience === "number" && (
                        <p className="text-xs">
                          {doctor.experience}{" "}
                          {doctor.experience === 1 ? "year" : "years"} of
                          experience
                        </p>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Consultation fee
                        </p>
                        <p className="mt-0.5 font-bold text-foreground">
                          {formatFee(doctor.appointmentFee)}
                        </p>
                      </div>
                      {rating > 0 ? (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          New profile
                        </span>
                      )}
                    </div>

                    <Button
                      asChild
                      className="mt-4 w-full rounded-xl"
                      variant="outline"
                    >
                      <Link
                        href={
                          doctor.id
                            ? `/consultation/doctor/${doctor.id}`
                            : "/consultation"
                        }
                      >
                        View profile
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </article>
                </li>
              );
            })}
          </ul>
        ) : (
          <div
            className="mt-9 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"
            role={loadFailed ? "alert" : undefined}
          >
            <Stethoscope className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-semibold text-foreground">
              {loadFailed
                ? "Doctor profiles are temporarily unavailable."
                : "No doctor profiles are available yet."}
            </p>
            {!loadFailed && (
              <p className="mt-1 text-sm text-muted-foreground">
                Please check back soon or browse the directory.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

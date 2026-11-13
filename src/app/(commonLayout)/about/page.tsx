import { getDoctors } from "@/services/admin/doctorManagement";
import { getSpecialities } from "@/services/admin/specialitiesManagement";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

const AboutPage = async () => {
  const [doctorsResponse, specialtiesResponse] = await Promise.all([
    getDoctors("?page=1&limit=1", "no-store"),
    getSpecialities("?page=1&limit=1"),
  ]);

  const doctorCount =
    doctorsResponse?.success && Number.isFinite(Number(doctorsResponse.meta?.total))
      ? Number(doctorsResponse.meta.total)
      : null;
  const specialtyCount =
    specialtiesResponse?.success &&
    Number.isFinite(Number(specialtiesResponse.meta?.total))
      ? Number(specialtiesResponse.meta.total)
      : null;

  return (
    <div className="container mx-auto space-y-20 px-4 py-10 md:space-y-28 md:py-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-linear-to-br from-primary/10 via-card to-card px-6 py-10 shadow-sm sm:px-10 md:px-14 md:py-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[36px] border-primary/5" />
        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              About Medi-Care
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Healthcare that feels a little more human.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              We make it easier to find the right care, connect with a doctor,
              and keep important parts of your healthcare journey together.
            </p>
            <Link
              href="/consultation"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore consultations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border bg-card/90 p-5 shadow-sm sm:p-6">
              <Stethoscope className="h-5 w-5 text-primary" />
              <p className="mt-5 text-3xl font-bold tracking-tight">
                {doctorCount === null ? "—" : doctorCount}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {doctorCount === 1 ? "Doctor available" : "Doctors available"}
              </p>
            </div>
            <div className="mt-8 rounded-2xl border bg-card/90 p-5 shadow-sm sm:mt-10 sm:p-6">
              <HeartHandshake className="h-5 w-5 text-primary" />
              <p className="mt-5 text-3xl font-bold tracking-tight">
                {specialtyCount === null ? "—" : specialtyCount}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {specialtyCount === 1 ? "Care specialty" : "Care specialties"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Our purpose
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Less friction between you and the care you need.
        </h2>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          Finding care can feel complicated. Medi-Care brings doctor discovery,
          appointment booking, and patient records into one clear experience,
          so you can focus on the next step that matters.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Care with confidence",
            description:
              "Get clear information about doctors and appointments before you decide what works for you.",
          },
          {
            icon: HeartHandshake,
            title: "People come first",
            description:
              "We design each step to feel approachable, respectful, and easier to understand.",
          },
          {
            icon: Stethoscope,
            title: "Connected care",
            description:
              "Keep appointments and care information together in one convenient place.",
          },
        ].map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border bg-muted/40 px-6 py-8 text-center sm:px-10 sm:py-10">
        <h2 className="text-2xl font-bold tracking-tight">
          Ready to find your doctor?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Browse available doctors and choose a consultation that fits your
          needs.
        </p>
        <Link
          href="/consultation"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Browse doctors
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;

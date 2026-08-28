import AIDoctorSuggestion from "@/components/modules/Consultation/AIDoctorSuggestion";
import DoctorGrid from "@/components/modules/Consultation/DoctorGrid";
import DoctorSearchFilters from "@/components/modules/Consultation/DoctorSearchFilter";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getDoctors } from "@/services/admin/doctorManagement";
import { getSpecialities } from "@/services/admin/specialitiesManagement";
import { ArrowDown, Stethoscope } from "lucide-react";
import { Suspense } from "react";

// ISR: Revalidate every 10 minutes for doctor listings
export const revalidate = 600;

const ConsultationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  // Fetch doctors and specialties in parallel
  const [doctorsResponse, specialtiesResponse] = await Promise.all([
    getDoctors(queryString),
    getSpecialities(),
  ]);

  const doctors = doctorsResponse?.data || [];
  const specialties = specialtiesResponse?.data || [];
  const totalDoctors = doctorsResponse?.meta?.total || doctors.length;
  const limit = doctorsResponse?.meta?.limit || 10;
  const totalPages = Math.ceil(totalDoctors / limit);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-primary/10 via-card to-card px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <Stethoscope className="h-3.5 w-3.5" />
              Care, matched to you
            </div>
            <h1 className="max-w-xl text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Find the right doctor for your next step.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            Search and book appointments with our qualified healthcare
            professionals
            </p>
          </div>
          <ArrowDown className="absolute -bottom-8 right-8 h-36 w-36 rotate-[-35deg] text-primary/10 md:right-20" />
        </section>

        <AIDoctorSuggestion />

        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Doctor directory
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                Browse trusted specialists
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalDoctors} {totalDoctors === 1 ? "doctor" : "doctors"} available
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm md:p-5">
            <DoctorSearchFilters specialties={specialties} />
          </div>
        </section>

        <Suspense fallback={<TableSkeleton columns={3} />}>
          <DoctorGrid doctors={doctors} />
        </Suspense>

        <TablePagination
          currentPage={doctorsResponse?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </div>
    </div>
  );
};

export default ConsultationPage;

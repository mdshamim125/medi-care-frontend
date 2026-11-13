import PatientPrescriptionsList from "@/components/modules/Patient/PatientPrescription/PatientPrescriptionList";
import TablePagination from "@/components/shared/TablePagination";
import { queryStringFormatter } from "@/lib/formatters";
import { getMyPrescriptions } from "@/services/patient/prescription.service";
import { IPrescription } from "@/types/prescription.interface";
import { CalendarDays, ClipboardList, Stethoscope } from "lucide-react";

export default async function MyPrescriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const response = await getMyPrescriptions(queryString);
  const prescriptions: IPrescription[] = response?.data || [];
  const totalPrescriptions = response?.meta?.total ?? prescriptions.length;
  const limit = response?.meta?.limit || 6;
  const currentPage = response?.meta?.page || 1;
  const totalPages = Math.ceil(totalPrescriptions / limit) || 1;
  const followUpsOnPage = prescriptions.filter(
    (prescription) => prescription.followUpDate,
  ).length;
  const doctorsOnPage = new Set(
    prescriptions.map((prescription) => prescription.doctorId),
  ).size;
  const hasFilters = Boolean(
    searchParamsObj.searchTerm || searchParamsObj.followUp,
  );

  return (
    <div className="space-y-7">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Your care
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Prescriptions
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Review treatment instructions, recommended tests, and follow-up
              dates from your care team.
            </p>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {totalPrescriptions}{" "}
            {totalPrescriptions === 1 ? "prescription" : "prescriptions"}
          </p>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/70 px-5 py-5 sm:px-7">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-900">
                Your care plan, all in one place
              </p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-teal-800/75">
                Review the guidance from your doctor and download a copy of any
                prescription when you need it.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <div className="flex min-w-[145px] items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">
                  {totalPrescriptions}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Care records
                </p>
              </div>
            </div>
            <div className="flex min-w-[145px] items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">
                  {followUpsOnPage}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Follow-ups on page
                </p>
              </div>
            </div>
            <div className="flex min-w-[145px] items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">
                  {doctorsOnPage}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Care team on page
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[18px] border-white/40" />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Prescription records
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search by health issue or narrow your list by follow-up schedule.
          </p>
        </div>
        <PatientPrescriptionsList
          prescriptions={prescriptions}
          hasFilters={hasFilters}
        />
        {totalPrescriptions > 0 && (
          <div className="border-t pt-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              defaultLimit={limit}
            />
          </div>
        )}
      </section>
    </div>
  );
}
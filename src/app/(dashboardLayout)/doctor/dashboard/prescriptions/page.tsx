import DoctorPrescriptionsFilter from "@/components/modules/Doctor/DoctorPrescription/DoctorPrescriptionsFilter";
import DoctorPrescriptionsTable from "@/components/modules/Doctor/DoctorPrescription/DoctorPrescriptionTable";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getMyPrescriptions } from "@/services/patient/prescription.service";
import { IPrescription } from "@/types/prescription.interface";
import { ClipboardList, FileCheck2, UsersRound } from "lucide-react";
import { Suspense } from "react";

const DoctorPrescriptionsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const response = await getMyPrescriptions(queryString);
  const prescriptions: IPrescription[] = response?.data || [];
  const totalPrescriptions = response?.meta?.total ?? prescriptions.length;
  const limit = response?.meta?.limit || 6;
  const currentPage = response?.meta?.page || 1;
  const totalPages = Math.ceil(totalPrescriptions / limit) || 1;
  const patientsOnPage = new Set(
    prescriptions.map((prescription) => prescription.patientId),
  ).size;
  const followUpsOnPage = prescriptions.filter(
    (prescription) => prescription.followUpDate,
  ).length;

  return (
    <div className="space-y-7">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Clinical workspace
        </p>
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Prescriptions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Review the treatment plans you have prepared and keep patient
            follow-ups organized.
          </p>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/70 px-5 py-5 sm:px-7">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-900">
                Keep every care plan within reach
              </p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-teal-800/75">
                Find prescriptions by patient or health issue, and quickly see
                which visits have a follow-up scheduled.
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
                  Prescriptions
                </p>
              </div>
            </div>
            <div className="flex min-w-[145px] items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <UsersRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">
                  {patientsOnPage}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Patients on page
                </p>
              </div>
            </div>
            <div className="flex min-w-[145px] items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <FileCheck2 className="h-4 w-4" />
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
          </div>
        </div>
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[18px] border-white/40" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-teal-500" />
            <h2 className="text-base font-bold text-slate-900">
              Prescription directory
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Search treatment records and filter by follow-up schedule.
          </p>
        </div>

        <div className="border-b border-slate-100 bg-slate-50/40 px-5 py-4 sm:px-6">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Find prescriptions
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Search by patient name, email, or recorded health issue.
            </p>
          </div>
          <DoctorPrescriptionsFilter />
        </div>

        <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
          <div className="overflow-x-auto">
            <DoctorPrescriptionsTable prescriptions={prescriptions} />
          </div>
          <div className="border-t border-slate-100 px-4 py-4 sm:px-6">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              defaultLimit={limit}
            />
          </div>
        </Suspense>
      </section>
    </div>
  );
};

export default DoctorPrescriptionsPage;

import PatientsFilter from "@/components/modules/Admin/PatientsManagement/PatientsFilter";
import PatientsTable from "@/components/modules/Admin/PatientsManagement/PatientsTable";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getPatients } from "@/services/admin/patientsManagement";
import { HeartPulse, UserRoundCheck, UsersRound } from "lucide-react";
import { Suspense } from "react";

const AdminPatientsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const patientsResult = await getPatients(queryString);
  const patients = patientsResult?.data || [];

  const totalPatients = patientsResult?.meta?.total || 0;
  const limit = patientsResult?.meta?.limit || 6;
  const currentPage = patientsResult?.meta?.page || 1;
  const totalPages = Math.ceil(totalPatients / limit) || 1;
  const activePatients = patients.filter(
    (patient: { isDeleted?: boolean }) => !patient.isDeleted,
  ).length;

  return (
    <div className="space-y-7">
      <ManagementPageHeader
        title="Patients Management"
        description="Manage patient information and details"
      />

      <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/70 px-5 py-5 sm:px-7">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-900">
                Keep patient records organized
              </p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-teal-800/75">
                Review patient profiles, update contact information, and keep
                the care directory accurate and up to date.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <div className="flex min-w-[155px] items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <UsersRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">
                  {totalPatients}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total patients
                </p>
              </div>
            </div>

            <div className="flex min-w-[155px] items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <UserRoundCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">
                  {activePatients}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Active on page
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[18px] border-white/40" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-teal-500" />
                <h2 className="text-base font-bold text-slate-900">
                  Patient directory
                </h2>
              </div>
              <p className="mt-1.5 text-sm text-slate-500">
                Search, filter, and manage patients registered on the platform.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-100 bg-slate-50/40 px-5 py-4 sm:px-6">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Filter patients
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Find a patient by name, email, or contact number.
            </p>
          </div>
          <PatientsFilter />
        </div>

        <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
          <div className="overflow-x-auto">
            <PatientsTable patients={patients} />
          </div>
          <div className="border-t border-slate-100 px-4 py-4 sm:px-6">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </Suspense>
      </section>
    </div>
  );
};

export default AdminPatientsManagementPage;

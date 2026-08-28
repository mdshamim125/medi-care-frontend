import DoctorFilters from "@/components/modules/Admin/DoctorsManagement/DoctorFilters";
import DoctorsManagementHeader from "@/components/modules/Admin/DoctorsManagement/DoctorsManagementHeader";
import DoctorsTable from "@/components/modules/Admin/DoctorsManagement/DoctorsTable";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getDoctors } from "@/services/admin/doctorManagement";
import { getSpecialities } from "@/services/admin/specialitiesManagement";
import { Activity, Stethoscope, Users } from "lucide-react";
import { Suspense } from "react";

const AdminDoctorsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) => {
  const searchParamsObj = await searchParams;

  const queryString = queryStringFormatter(searchParamsObj);

  // Keep this structure because it gives you smooth pagination behavior
const specialitiesResult = await getSpecialities("?limit=1000");  const doctorsResult = await getDoctors(queryString);

  const specialities = specialitiesResult?.data || [];
  const doctors = doctorsResult?.data || [];

  const totalDoctors = doctorsResult?.meta?.total || doctors.length;
  const limit = doctorsResult?.meta?.limit || 10;
  const currentPage = doctorsResult?.meta?.page || 1;

  const totalPages = Math.ceil(totalDoctors / limit);

  return (
    <div className="space-y-7">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <DoctorsManagementHeader specialities={specialities} />

      {/* =========================================================
          OVERVIEW / SUMMARY SECTION
      ========================================================= */}
      <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/70 px-5 py-5 sm:px-7">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Description */}
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
              <Stethoscope className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-teal-900">
                Manage your medical professionals
              </p>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-teal-800/75">
                Review doctor profiles, manage their information, and keep your
                healthcare directory organized for patients.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {/* Total Doctors */}
            <div className="flex min-w-[155px] items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Users className="h-4 w-4" />
              </div>

              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">
                  {totalDoctors}
                </p>

                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total doctors
                </p>
              </div>
            </div>

            {/* Specialties */}
            <div className="flex min-w-[155px] items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Activity className="h-4 w-4" />
              </div>

              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">
                  {specialities.length}
                </p>

                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Specialties
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Circle */}
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-18 border-white/40" />
      </section>

      {/* =========================================================
          DOCTOR DIRECTORY
      ========================================================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {/* -------------------------------------------------------
            DIRECTORY HEADER
        ------------------------------------------------------- */}
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-teal-500" />

                <h2 className="text-base font-bold text-slate-900">
                  Doctor directory
                </h2>
              </div>

              <p className="mt-1.5 text-sm text-slate-500">
                Search, filter, and manage doctors registered on the platform.
              </p>
            </div>

            {/* <RefreshButton variant="outline" size="sm" /> */}
          </div>
        </div>

        {/* -------------------------------------------------------
            FILTER AREA
        ------------------------------------------------------- */}
        <div className="border-b border-slate-100 bg-slate-50/40 px-5 py-4 sm:px-6">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Filter doctors
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Narrow down the directory using name, specialty, or other
              available filters.
            </p>
          </div>

          <DoctorFilters specialties={specialities} />
        </div>

        {/* -------------------------------------------------------
            TABLE + PAGINATION
            Keep both inside Suspense for smooth pagination
        ------------------------------------------------------- */}
        <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
          {/* Table */}
          <div className="overflow-x-auto">
            <DoctorsTable doctors={doctors} specialities={specialities} />
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-100 px-4 py-4 sm:px-6">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
            />
          </div>
        </Suspense>
      </section>
    </div>
  );
};

export default AdminDoctorsManagementPage;

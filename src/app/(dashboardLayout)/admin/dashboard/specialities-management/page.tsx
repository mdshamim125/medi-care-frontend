import SpecialitiesManagementHeader from "@/components/modules/Admin/SpecialitiesManagement/SpecialitiesManagementHeader";
import SpecialitiesTable from "@/components/modules/Admin/SpecialitiesManagement/SpecialitiesTable";
import RefreshButton from "@/components/shared/RefreshButton";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getSpecialities } from "@/services/admin/specialitiesManagement";
import { Layers3, Sparkles } from "lucide-react";
import { Suspense } from "react";

const AdminSpecialitiesManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const result = await getSpecialities(queryString);
  const specialities = result?.data ?? [];
  const totalSpecialities = result?.meta?.total ?? specialities.length;
  const totalPages = Math.ceil(totalSpecialities / (result?.meta?.limit || 1));

  return (
    <div className="space-y-7">
      <SpecialitiesManagementHeader />

      <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/70 px-5 py-5 sm:px-7">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-900">
                Keep your directory focused
              </p>
              <p className="mt-1 max-w-xl text-sm leading-6 text-teal-800/75">
                Maintain the specialties patients use to find the right care.
                Clear names and recognizable icons make every search easier.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3">
            <Layers3 className="h-5 w-5 text-teal-700" />
            <div>
              <p className="text-2xl font-bold leading-none text-slate-900">
                {totalSpecialities}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                Active specialties
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[18px] border-white/40" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Specialty directory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review and manage the categories available across the platform.
            </p>
          </div>
          <RefreshButton variant="outline" size="sm" />
        </div>
        <div className="overflow-x-auto">
          <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
            <SpecialitiesTable specialities={specialities} />
          </Suspense>
        </div>
        <div className="border-t border-slate-100 px-4 py-4 sm:px-6">
          <TablePagination
            currentPage={result?.meta?.page || 1}
            totalPages={totalPages || 1}
          />
        </div>
      </section>
    </div>
  );
};

export default AdminSpecialitiesManagementPage;

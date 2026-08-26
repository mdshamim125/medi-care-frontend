import SchedulesFilter from "@/components/modules/Admin/SchedulesManagement/SchedulesFilter";
import SchedulesManagementHeader from "@/components/modules/Admin/SchedulesManagement/SchedulesManagementHeader";
import SchedulesTable from "@/components/modules/Admin/SchedulesManagement/SchedulesTable";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getSchedules } from "@/services/admin/schedulesManagement";
import { CalendarDays, Clock3, Layers3 } from "lucide-react";
import { Suspense } from "react";

const AdminSchedulesManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;

  const queryString = queryStringFormatter(searchParamsObj);
  const schedulesResult = await getSchedules(queryString);

  const totalPages = Math.ceil(
    (schedulesResult?.meta?.total || 1) / (schedulesResult?.meta?.limit || 1),
  );
  const totalSchedules = schedulesResult?.meta?.total || 0;
  const visibleSchedules = schedulesResult?.data?.length || 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border bg-teal-50/30 p-5 shadow-sm sm:p-7">
        <SchedulesManagementHeader />
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total schedules</p>
              <p className="text-xl font-semibold">{totalSchedules}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">
            <Layers3 className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">On this page</p>
              <p className="text-xl font-semibold">{visibleSchedules}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">
            <Clock3 className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Page size</p>
              <p className="text-xl font-semibold">{schedulesResult?.meta?.limit || 10}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Schedule library</h2>
          <p className="text-sm text-muted-foreground">Filter, review, and maintain appointment time slots.</p>
        </div>
        <SchedulesFilter />

        <Suspense fallback={<TableSkeleton columns={4} rows={10} />}>
          <SchedulesTable schedules={schedulesResult?.data || []} />
          <TablePagination
            currentPage={schedulesResult?.meta?.page || 1}
            totalPages={totalPages || 1}
          />
        </Suspense>
      </section>
    </div>
  );
};

export default AdminSchedulesManagementPage;

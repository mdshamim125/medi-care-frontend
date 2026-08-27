import MySchedulesFilters from "@/components/modules/Doctor/MySchedules/MyScheduleFilters";
import MySchedulesHeader from "@/components/modules/Doctor/MySchedules/MyScheduleHeader";
import MySchedulesTable from "@/components/modules/Doctor/MySchedules/MyScheduleTable";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import {
  getAvailableSchedules,
  getDoctorOwnSchedules,
} from "@/services/doctor/doctorScedule.services";
import { CalendarCheck2, CalendarPlus, ListChecks } from "lucide-react";
import { Suspense } from "react";

interface DoctorMySchedulesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    isBooked?: string;
  }>;
}

const DoctorMySchedulesPage = async ({
  searchParams,
}: DoctorMySchedulesPageProps) => {
  const params = await searchParams;

  const queryString = queryStringFormatter(params);
  const myDoctorsScheduleResponse = await getDoctorOwnSchedules(queryString);
  const availableSchedulesResponse = await getAvailableSchedules();

  const schedules = myDoctorsScheduleResponse?.data || [];
  const meta = myDoctorsScheduleResponse?.meta;
  const totalPages = Math.ceil((meta?.total || 1) / (meta?.limit || 1));
  const totalSchedules = meta?.total || 0;
  const visibleSchedules = schedules.length;
  const availableSchedules = availableSchedulesResponse?.data?.length || 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border bg-teal-50/30 p-5 shadow-sm sm:p-7">
        <MySchedulesHeader
          availableSchedules={availableSchedulesResponse?.data || []}
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">
            <CalendarCheck2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">My schedules</p>
              <p className="text-xl font-semibold">{totalSchedules}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">
            <ListChecks className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">On this page</p>
              <p className="text-xl font-semibold">{visibleSchedules}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">
            <CalendarPlus className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Available to book</p>
              <p className="text-xl font-semibold">{availableSchedules}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Your availability</h2>
          <p className="text-sm text-muted-foreground">Review your time slots and booking status at a glance.</p>
        </div>
        <MySchedulesFilters />

        <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
          <MySchedulesTable schedules={schedules} />
          <TablePagination
            currentPage={meta?.page || 1}
            totalPages={totalPages || 1}
          />
        </Suspense>
      </section>
    </div>
  );
};

export default DoctorMySchedulesPage;

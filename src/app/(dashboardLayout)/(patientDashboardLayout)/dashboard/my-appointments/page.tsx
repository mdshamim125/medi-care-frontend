import AppointmentsList from "@/components/modules/Patient/PatientAppointment/AppointmentsList";
import TablePagination from "@/components/shared/TablePagination";
import { queryStringFormatter } from "@/lib/formatters";
import { getMyAppointments } from "@/services/patient/appointment.service";
import { IAppointment } from "@/types/appointments.interface";

export default async function MyAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const response = await getMyAppointments(queryString);
  const appointments: IAppointment[] = response?.data || [];
  const totalAppointments = response?.meta?.total ?? appointments.length;
  const limit = response?.meta?.limit || 6;
  const currentPage = response?.meta?.page || 1;
  const totalPages = Math.ceil(totalAppointments / limit) || 1;
  const hasFilters = Boolean(
    searchParamsObj.searchTerm ||
      searchParamsObj.status ||
      searchParamsObj.paymentStatus,
  );

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Your care
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            My Appointments
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Keep track of your visits, upcoming consultations, and payment
            details in one place.
          </p>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {totalAppointments}{" "}
          {totalAppointments === 1 ? "appointment" : "appointments"}
        </p>
      </div>

      <AppointmentsList appointments={appointments} hasFilters={hasFilters} />
      {totalAppointments > 0 && (
        <div className="border-t pt-4">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            defaultLimit={limit}
          />
        </div>
      )}
    </div>
  );
}
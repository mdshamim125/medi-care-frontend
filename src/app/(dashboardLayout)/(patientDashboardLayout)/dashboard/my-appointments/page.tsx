import AppointmentsList from "@/components/modules/Patient/PatientAppointment/AppointmentsList";
import { getMyAppointments } from "@/services/patient/appointment.service";
import { IAppointment } from "@/types/appointments.interface";

export default async function MyAppointmentsPage() {
  const response = await getMyAppointments();
  const appointments: IAppointment[] = response?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
          <p className="mt-1.5 text-muted-foreground">
            View and manage your scheduled appointments
          </p>
        </div>
        {appointments.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {appointments.length} appointment
            {appointments.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <AppointmentsList appointments={appointments} />
    </div>
  );
}
import DoctorAppointmentsTable from "@/components/modules/Doctor/DoctorAppointments/DoctorAppointmentTable";
import { getMyAppointments } from "@/services/patient/appointment.service";
import { IAppointment } from "@/types/appointments.interface";
import { Suspense } from "react";

async function AppointmentsContent() {
  const response = await getMyAppointments();
  const appointments: IAppointment[] = response?.data || [];

  return <DoctorAppointmentsTable appointments={appointments} />;
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export default async function DoctorAppointmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
          <p className="mt-1.5 text-muted-foreground">
            Manage your patient appointments and prescriptions
          </p>
        </div>
      </div>

      <Suspense fallback={<AppointmentsSkeleton />}>
        <AppointmentsContent />
      </Suspense>
    </div>
  );
}
"use client";

import InfoRow from "@/components/shared/InfoRow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, getInitials } from "@/lib/formatters";
import {
  AppointmentStatus,
  IAppointment,
  PaymentStatus,
} from "@/types/appointments.interface";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Hash,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";

interface AppointmentViewDetailDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: IAppointment | null;
}

const appointmentStatusStyles: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]:
    "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200",
  [AppointmentStatus.INPROGRESS]:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  [AppointmentStatus.COMPLETED]:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  [AppointmentStatus.CANCELED]:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
};

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
};

const formatTime = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
};

const AppointmentViewDetailDialog = ({
  open,
  onClose,
  appointment,
}: AppointmentViewDetailDialogProps) => {
  if (!appointment) return null;

  const patient = appointment.patient;
  const doctor = appointment.doctor;
  const schedule = appointment.schedule;
  const isPaid = appointment.paymentStatus === PaymentStatus.PAID;
  const appointmentStatusLabel = appointment.status
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase())
    .replace("Inprogress", "In progress");

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b bg-muted/20 px-6 py-5 pr-12 text-left">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl">Appointment details</DialogTitle>
          <DialogDescription>
            Review the appointment, care team, schedule, and payment information.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            <section className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Appointment
                </p>
                <p className="mt-1 break-all font-mono text-sm font-medium">
                  {appointment.id}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={appointmentStatusStyles[appointment.status]}
                >
                  {appointmentStatusLabel}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    isPaid
                      ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
                      : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
                  }
                >
                  <CreditCard className="mr-1 h-3 w-3" />
                  {isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Schedule</h3>
              </div>
              <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <InfoRow
                    label="Date"
                    value={formatDate(schedule?.startDateTime)}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <InfoRow
                    label="Time"
                    value={`${formatTime(schedule?.startDateTime)} – ${formatTime(schedule?.endDateTime)}`}
                  />
                </div>
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="rounded-xl border p-4">
                <div className="mb-4 flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarImage
                      src={patient?.profilePhoto || ""}
                      alt={patient?.name || "Patient"}
                    />
                    <AvatarFallback>
                      {getInitials(patient?.name || "Patient")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Patient
                    </p>
                    <h3 className="truncate font-semibold">
                      {patient?.name || "Patient unavailable"}
                    </h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <InfoRow
                      label="Email"
                      value={patient?.email || "Not provided"}
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <InfoRow
                      label="Phone"
                      value={patient?.contactNumber || "Not provided"}
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <InfoRow
                      label="Address"
                      value={patient?.address || "Not provided"}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border p-4">
                <div className="mb-4 flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarImage
                      src={doctor?.profilePhoto || ""}
                      alt={doctor?.name || "Doctor"}
                    />
                    <AvatarFallback>
                      {getInitials(doctor?.name || "Doctor")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Doctor
                    </p>
                    <h3 className="truncate font-semibold">
                      {doctor?.name || "Doctor unavailable"}
                    </h3>
                    {doctor?.designation && (
                      <p className="truncate text-xs text-muted-foreground">
                        {doctor.designation}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <InfoRow
                      label="Email"
                      value={doctor?.email || "Not provided"}
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <InfoRow
                      label="Phone"
                      value={doctor?.contactNumber || "Not provided"}
                    />
                  </div>
                  {doctor?.doctorSpecialties &&
                    doctor.doctorSpecialties.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-sm text-muted-foreground">
                            Specialties
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {doctor.doctorSpecialties.map((item) => (
                              <Badge
                                key={item.specialitiesId}
                                variant="secondary"
                                className="font-normal"
                              >
                                {item.specialities?.title || "Specialty"}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </section>
            </div>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Visit details</h3>
              </div>
              <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Video className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <InfoRow
                    label="Video call ID"
                    value={
                      appointment.videoCallingId ? (
                        <span className="break-all font-mono text-xs">
                          {appointment.videoCallingId}
                        </span>
                      ) : (
                        "Not available"
                      )
                    }
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <InfoRow
                    label="Schedule reference"
                    value={
                      schedule?.id ? (
                        <span className="break-all font-mono text-xs">
                          {schedule.id}
                        </span>
                      ) : (
                        "Not available"
                      )
                    }
                  />
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Record history</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow
                  label="Created"
                  value={
                    appointment.createdAt
                      ? formatDateTime(appointment.createdAt)
                      : "Not available"
                  }
                />
                <InfoRow
                  label="Last updated"
                  value={
                    appointment.updatedAt
                      ? formatDateTime(appointment.updatedAt)
                      : "Not available"
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentViewDetailDialog;

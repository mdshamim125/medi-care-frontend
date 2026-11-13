"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeAppointmentStatus } from "@/services/admin/appoitmentsManagement";
import {
  AppointmentStatus,
  IAppointment,
} from "@/types/appointments.interface";
import {
  AlertCircle,
  CalendarClock,
  Check,
  ClipboardCheck,
  Loader2,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ChangeAppointmentStatusDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: IAppointment | null;
  onSuccess: () => void;
}

const statusOptions = [
  {
    value: AppointmentStatus.SCHEDULED,
    label: "Scheduled",
    className:
      "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200",
  },
  {
    value: AppointmentStatus.INPROGRESS,
    label: "In progress",
    className:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  {
    value: AppointmentStatus.COMPLETED,
    label: "Completed",
    className:
      "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  },
  {
    value: AppointmentStatus.CANCELED,
    label: "Canceled",
    className:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  },
];

const getStatusOption = (status: AppointmentStatus) =>
  statusOptions.find((option) => option.value === status);

const formatSchedule = (appointment: IAppointment) => {
  if (!appointment.schedule) return null;

  const start = new Date(appointment.schedule.startDateTime);
  const end = new Date(appointment.schedule.endDateTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  return {
    date: start.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: `${start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })} – ${end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`,
  };
};

const ChangeAppointmentStatusDialog = ({
  open,
  onClose,
  appointment,
  onSuccess,
}: ChangeAppointmentStatusDialogProps) => {
  const [selection, setSelection] = useState<{
    appointmentId: string;
    originalStatus: AppointmentStatus;
    status: AppointmentStatus;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!appointment) return null;

  const selectedStatus =
    selection?.appointmentId === appointment.id &&
    selection.originalStatus === appointment.status
      ? selection.status
      : appointment.status;
  const currentStatus = getStatusOption(appointment.status);
  const hasChanges = selectedStatus !== appointment.status;
  const isStatusLocked =
    appointment.status === AppointmentStatus.COMPLETED ||
    appointment.status === AppointmentStatus.CANCELED;
  const schedule = formatSchedule(appointment);

  const handleClose = () => {
    if (!isPending) {
      setSelection(null);
      onClose();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasChanges || isPending || isStatusLocked) return;

    startTransition(async () => {
      try {
        const result = await changeAppointmentStatus(
          appointment.id,
          selectedStatus,
        );

        if (!result?.success) {
          toast.error(result?.message || "Unable to update appointment status");
          return;
        }

        toast.success("Appointment status updated");
        setSelection(null);
        onSuccess();
      } catch (error) {
        console.error("Update appointment status error:", error);
        toast.error("An unexpected error occurred while updating the status");
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b bg-muted/30 px-6 py-5 pr-12 text-left">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl">Update appointment status</DialogTitle>
          <DialogDescription className="leading-relaxed">
            Review the appointment and select its new status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex min-w-0 items-start gap-3 rounded-xl border bg-card p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <UserRound className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Patient
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold">
                    {appointment.patient?.name || "Patient unavailable"}
                  </p>
                  {appointment.patient?.email && (
                    <p className="truncate text-xs text-muted-foreground">
                      {appointment.patient.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 items-start gap-3 rounded-xl border bg-card p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Doctor
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold">
                    {appointment.doctor?.name || "Doctor unavailable"}
                  </p>
                  {appointment.doctor?.email && (
                    <p className="truncate text-xs text-muted-foreground">
                      {appointment.doctor.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {schedule && (
              <div className="flex items-center gap-3 rounded-xl border bg-muted/20 px-4 py-3">
                <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{schedule.date}</p>
                  <p className="text-xs text-muted-foreground">
                    {schedule.time}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="appointment-status">Appointment status</Label>
                {currentStatus && (
                  <Badge
                    variant="outline"
                    className={currentStatus.className}
                  >
                    Current: {currentStatus.label}
                  </Badge>
                )}
              </div>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelection({
                    appointmentId: appointment.id,
                    originalStatus: appointment.status,
                    status: value as AppointmentStatus,
                  })
                }
                disabled={isPending || isStatusLocked}
              >
                <SelectTrigger id="appointment-status" className="h-11 w-full">
                  <SelectValue placeholder="Choose a status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isStatusLocked ? (
              <div className="flex items-start gap-3 rounded-xl border border-muted bg-muted/40 p-3.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This appointment is {currentStatus?.label.toLowerCase()} and
                  its status can no longer be changed.
                </p>
              </div>
            ) : selectedStatus === AppointmentStatus.COMPLETED &&
              !appointment.prescription && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-900 dark:bg-amber-950/40">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
                  <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                    <span className="font-semibold">Reminder:</span> Add a
                    prescription for this patient after completing the
                    appointment.
                  </p>
                </div>
              )}

            {!isStatusLocked &&
              selectedStatus === AppointmentStatus.CANCELED &&
              appointment.status !== AppointmentStatus.CANCELED && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 dark:border-red-900 dark:bg-red-950/40">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />
                  <p className="text-sm leading-relaxed text-red-900 dark:text-red-200">
                    This change will mark the appointment as canceled.
                  </p>
                </div>
              )}
          </div>

          <DialogFooter className="border-t bg-muted/20 px-6 py-4 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !hasChanges || isStatusLocked}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : isStatusLocked ? (
                "Status locked"
              ) : hasChanges ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save changes
                </>
              ) : (
                "No changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAppointmentStatusDialog;

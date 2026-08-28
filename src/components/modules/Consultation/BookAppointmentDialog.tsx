"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IDoctor } from "@/types/doctor.interface";
import { IDoctorSchedule } from "@/types/schedule.interface";
import { format } from "date-fns";
import { Calendar, Check, Clock, Loader2, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookAppointmentDialogProps {
  doctor: IDoctor;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookAppointmentDialog({
  doctor,
  isOpen,
  onClose,
}: BookAppointmentDialogProps) {
  const router = useRouter();

  const doctorSchedules = doctor.doctorSchedules || [];

  const [selectedSchedule, setSelectedSchedule] =
    useState<IDoctorSchedule | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCloseModal = () => {
    setSelectedSchedule(null);
    setIsNavigating(false);
    onClose();
  };

  const groupSchedulesByDate = () => {
    const grouped: Record<string, IDoctorSchedule[]> = {};

    doctorSchedules.forEach((schedule) => {
      if (!schedule.schedule?.startDateTime) return;

      const startDate = new Date(schedule.schedule.startDateTime)
        .toISOString()
        .split("T")[0];

      if (!startDate) return;

      if (!grouped[startDate]) {
        grouped[startDate] = [];
      }

      grouped[startDate].push(schedule);
    });

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  };

  const groupedSchedules = groupSchedulesByDate();

  const hasSchedulesWithoutData =
    doctorSchedules.length > 0 && groupedSchedules.length === 0;

  const handleContinue = () => {
    if (!selectedSchedule || isNavigating) return;

    setIsNavigating(true);

    router.push(
      `/dashboard/book-appointment/${doctor.id}/${selectedSchedule.scheduleId}`,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent
        className="
          flex
          max-h-[calc(100dvh-2rem)]
          w-[calc(100%-2rem)]
          max-w-2xl
          flex-col
          gap-0
          overflow-hidden
          p-0
          sm:max-h-[calc(100dvh-3rem)]
          sm:w-full
          sm:rounded-2xl
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}
        <DialogHeader className="shrink-0 border-b bg-muted/20 px-6 py-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Stethoscope className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold">
                Book an Appointment
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
          {/* Doctor Information */}
          <div className="mb-5 flex shrink-0 items-center justify-between gap-4 rounded-xl border bg-card p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Stethoscope className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Dr. {doctor.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {doctor.designation}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-xs text-muted-foreground">Consultation Fee</p>

              <p className="mt-0.5 text-sm font-semibold text-primary">
                ${doctor.appointmentFee}
              </p>
            </div>
          </div>

          {/* Schedule Header */}
          <div className="mb-3 flex shrink-0 items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Available time slots
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Choose a date and time that works for you.
              </p>
            </div>

            {doctorSchedules.length > 0 && groupedSchedules.length > 0 && (
              <span className="hidden rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
                {doctorSchedules.length}{" "}
                {doctorSchedules.length === 1 ? "slot" : "slots"} available
              </span>
            )}
          </div>

          {/* =====================================================
              SCHEDULE CONTENT
          ====================================================== */}
          {hasSchedulesWithoutData ? (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-8 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>

                <p className="mt-4 text-sm font-medium">
                  Schedule data unavailable
                </p>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                  The doctor has {doctorSchedules.length}{" "}
                  {doctorSchedules.length === 1 ? "schedule" : "schedules"}, but
                  the detailed time information could not be loaded.
                </p>
              </div>
            </div>
          ) : groupedSchedules.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-8 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>

                <p className="mt-4 text-sm font-medium">No available slots</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  There are currently no available appointments for this doctor.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-0 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-3 [scrollbar-gutter:stable]">
              <div className="space-y-6 pb-6">
                {groupedSchedules.map(([date, dateSchedules]) => (
                  <div key={date}>
                    {/* Date Header */}
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {format(new Date(date), "EEEE, MMMM d, yyyy")}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {dateSchedules.length}{" "}
                          {dateSchedules.length === 1
                            ? "available time"
                            : "available times"}
                        </p>
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {dateSchedules.map((schedule) => {
                        const startTime = schedule.schedule?.startDateTime
                          ? new Date(schedule.schedule.startDateTime)
                          : null;

                        const isSelected =
                          selectedSchedule?.scheduleId === schedule.scheduleId;

                        return (
                          <Button
                            key={schedule.scheduleId}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => setSelectedSchedule(schedule)}
                            className={`
                              h-11
                              justify-start
                              rounded-lg
                              px-3
                              transition-all
                              ${
                                isSelected
                                  ? "border-primary shadow-sm"
                                  : "hover:border-primary/50 hover:bg-primary/5"
                              }
                            `}
                          >
                            <Clock className="mr-2 h-4 w-4 shrink-0" />

                            <span className="text-sm font-medium">
                              {startTime ? format(startTime, "h:mm a") : "N/A"}
                            </span>

                            {isSelected && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <DialogFooter className="shrink-0 border-t bg-muted/20 px-6 py-4">
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleContinue}
              disabled={!selectedSchedule || isNavigating}
              className="w-full sm:w-auto sm:min-w-[130px]"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening booking...
                </>
              ) : selectedSchedule ? (
                "Continue"
              ) : (
                "Select a time"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

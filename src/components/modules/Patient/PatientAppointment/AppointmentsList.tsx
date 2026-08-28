"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AppointmentStatus,
  IAppointment,
} from "@/types/appointments.interface";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Star,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

interface AppointmentsListProps {
  appointments: IAppointment[];
}

const statusConfig: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  [AppointmentStatus.SCHEDULED]: {
    label: "Scheduled",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  [AppointmentStatus.INPROGRESS]: {
    label: "In Progress",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  [AppointmentStatus.COMPLETED]: {
    label: "Completed",
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
  },
  [AppointmentStatus.CANCELED]: {
    label: "Canceled",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  },
};

const AppointmentsList = ({ appointments }: AppointmentsListProps) => {
  if (appointments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No appointments yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            You haven&apos;t booked any appointments. Browse our doctors and
            schedule your first consultation.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/consultation">Find a Doctor</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {appointments.map((appointment) => {
        const status = statusConfig[appointment.status];

        return (
          <Card
            key={appointment.id}
            className="flex flex-col overflow-hidden transition-all hover:shadow-md"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold leading-tight">
                      {appointment.doctor?.name || "Unknown Doctor"}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {appointment.doctor?.designation || "Doctor"}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`shrink-0 ${status.className}`}
                >
                  {status.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 pt-0">
              {/* Specialties */}
              {appointment.doctor?.doctorSpecialties &&
                appointment.doctor.doctorSpecialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {appointment.doctor.doctorSpecialties
                      .slice(0, 3)
                      .map((ds, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {ds.specialities?.title || "N/A"}
                        </Badge>
                      ))}
                    {appointment.doctor.doctorSpecialties.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        +{appointment.doctor.doctorSpecialties.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

              {/* Schedule */}
              {appointment.schedule && (
                <div className="space-y-2.5 rounded-lg bg-muted/60 px-3 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">
                      {format(
                        new Date(appointment.schedule.startDateTime),
                        "EEE, MMM d, yyyy"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      {format(
                        new Date(appointment.schedule.startDateTime),
                        "h:mm a"
                      )}{" "}
                      –{" "}
                      {format(
                        new Date(appointment.schedule.endDateTime),
                        "h:mm a"
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Address */}
              {appointment.doctor?.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="line-clamp-2">
                    {appointment.doctor.address}
                  </span>
                </div>
              )}

              {/* Extra badges / review */}
              <div className="flex flex-wrap gap-2">
                {appointment.prescription && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                  >
                    <FileText className="h-3 w-3" />
                    Prescription
                  </Badge>
                )}

                {appointment.status === AppointmentStatus.COMPLETED &&
                  !appointment.review && (
                    <Badge
                      variant="outline"
                      className="gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    >
                      <MessageSquare className="h-3 w-3" />
                      Review Available
                    </Badge>
                  )}
              </div>

              {/* Review rating */}
              {appointment.status === AppointmentStatus.COMPLETED &&
                appointment.review && (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">
                      Rated {appointment.review.rating}/5
                    </span>
                  </div>
                )}
            </CardContent>

            <CardFooter className="border-t bg-muted/30 px-6 py-4">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-full"
                asChild
              >
                <Link href={`/dashboard/my-appointments/${appointment.id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default AppointmentsList;
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AppointmentStatus,
  IAppointment,
  PaymentStatus,
} from "@/types/appointments.interface";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  Star,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import AppointmentCountdown from "./AppointmentCountdown";
import { initiatePayment } from "@/services/payment/payment.service";

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
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  [AppointmentStatus.CANCELED]: {
    label: "Canceled",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  },
};

const AppointmentsList = ({ appointments }: AppointmentsListProps) => {
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(
    null,
  );

  const handlePayNow = async (appointmentId: string) => {
    setProcessingPaymentId(appointmentId);
    try {
      const result = await initiatePayment(appointmentId);

      if (result.success && result.data?.paymentUrl) {
        toast.success("Redirecting to payment...");
        sessionStorage.setItem(
          "paymentReturnUrl",
          "/dashboard/my-appointments",
        );
        window.location.replace(result.data.paymentUrl);
      } else {
        toast.error(result.message || "Failed to initiate payment");
        setProcessingPaymentId(null);
      }
    } catch (error) {
      toast.error("An error occurred while initiating payment");
      setProcessingPaymentId(null);
      console.error(error);
    }
  };

  if (appointments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Calendar className="h-7 w-7 text-muted-foreground" />
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
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {appointments.map((appointment) => {
        const status = statusConfig[appointment.status];
        const isUnpaid =
          appointment.paymentStatus === PaymentStatus.UNPAID &&
          appointment.status !== AppointmentStatus.CANCELED;
        const isProcessing = processingPaymentId === appointment.id;

        return (
          <Card
            key={appointment.id}
            className="group flex flex-col overflow-hidden transition-all hover:shadow-md"
          >
            <CardContent className="flex flex-1 flex-col space-y-4 pt-5">
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>

                {appointment.paymentStatus === PaymentStatus.PAID ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  >
                    Paid
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
                  >
                    Payment Pending
                  </Badge>
                )}

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
                      className="gap-1 border-amber-200 bg-amber-50 text-amber-700 animate-pulse dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    >
                      <MessageSquare className="h-3 w-3" />
                      Review
                    </Badge>
                  )}
              </div>

              {/* Doctor */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
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

              {/* Specialties */}
              {appointment.doctor?.doctorSpecialties &&
                appointment.doctor.doctorSpecialties.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {appointment.doctor.doctorSpecialties
                      .slice(0, 2)
                      .map((ds, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {ds.specialities?.title || "N/A"}
                        </Badge>
                      ))}
                    {appointment.doctor.doctorSpecialties.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        +{appointment.doctor.doctorSpecialties.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

              {/* Schedule */}
              {appointment.schedule && (
                <div className="space-y-2.5 rounded-lg border bg-muted/40 p-3.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="font-medium">
                      {format(
                        new Date(appointment.schedule.startDateTime),
                        "EEEE, MMM d, yyyy",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {format(
                        new Date(appointment.schedule.startDateTime),
                        "h:mm a",
                      )}{" "}
                      –{" "}
                      {format(
                        new Date(appointment.schedule.endDateTime),
                        "h:mm a",
                      )}
                    </span>
                  </div>

                  {appointment.status === AppointmentStatus.SCHEDULED &&
                    appointment.schedule.startDateTime && (
                      <div className="border-t pt-2.5">
                        <AppointmentCountdown
                          appointmentDateTime={
                            appointment.schedule.startDateTime
                          }
                        />
                      </div>
                    )}
                </div>
              )}

              {/* Address */}
              {appointment.doctor?.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-2">
                    {appointment.doctor.address}
                  </span>
                </div>
              )}

              {/* Review (completed only) */}
              {appointment.status === AppointmentStatus.COMPLETED && (
                <div>
                  {appointment.review ? (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50/80 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-medium">
                        Rated {appointment.review.rating}/5
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                      No review yet
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="gap-2 border-t bg-muted/20 px-5 py-3.5">
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex-1"
                asChild
              >
                <Link href={`/dashboard/my-appointments/${appointment.id}`}>
                  View Details
                </Link>
              </Button>

              {isUnpaid && (
                <Button
                  onClick={() => handlePayNow(appointment.id)}
                  disabled={isProcessing}
                  size="sm"
                  className="h-9 flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-3.5 w-3.5" />
                      Pay Now
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default AppointmentsList;

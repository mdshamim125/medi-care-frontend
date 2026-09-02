"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  createAppointment,
  createAppointmentWithPayLater,
} from "@/services/patient/appointment.service";
import { IDoctor } from "@/types/doctor.interface";
import { ISchedule } from "@/types/schedule.interface";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AppointmentConfirmationProps {
  doctor: IDoctor;
  schedule: ISchedule;
}

const AppointmentConfirmation = ({
  doctor,
  schedule,
}: AppointmentConfirmationProps) => {
  const router = useRouter();
  const [isPayingNow, setIsPayingNow] = useState(false);
  const [isPayingLater, setIsPayingLater] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const isBusy = isPayingNow || isPayingLater;

  const handleConfirmBooking = async () => {
    setIsPayingNow(true);

    try {
      const result = await createAppointment({
        doctorId: doctor.id!,
        scheduleId: schedule.id,
      });

      if (result.success && result.data?.paymentUrl) {
        toast.success("Redirecting to payment...");
        sessionStorage.setItem(
          "paymentReturnUrl",
          "/dashboard/my-appointments",
        );
        window.location.replace(result.data.paymentUrl);
      } else if (result.success) {
        setBookingSuccess(true);
        toast.success("Appointment booked successfully!");
        setTimeout(() => {
          router.push("/dashboard/my-appointments");
        }, 2000);
      } else {
        toast.error(result.message || "Failed to book appointment");
        setIsPayingNow(false);
      }
    } catch (error) {
      toast.error("An error occurred while booking the appointment");
      setIsPayingNow(false);
      console.error(error);
    }
  };

  const handlePayLater = async () => {
    setIsPayingLater(true);

    try {
      const result = await createAppointmentWithPayLater({
        doctorId: doctor.id!,
        scheduleId: schedule.id,
      });

      if (result.success) {
        setBookingSuccess(true);
        toast.success(
          "Appointment booked! You can pay later from your appointments page.",
        );
        setTimeout(() => {
          router.push("/dashboard/my-appointments");
        }, 2000);
      } else {
        toast.error(result.message || "Failed to book appointment");
        setIsPayingLater(false);
      }
    } catch (error) {
      toast.error("An error occurred while booking the appointment");
      setIsPayingLater(false);
      console.error(error);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center p-4">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-800/20" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-800/15" />
        </div>

        <Card className="relative z-10 w-full max-w-md border-emerald-200/80 shadow-xl shadow-emerald-100/50 dark:border-emerald-800/60 dark:shadow-emerald-950/40">
          <CardContent className="px-8 pb-8 pt-10">
            <div className="flex flex-col items-center space-y-5 text-center">
              <div className="relative">
                <div className="absolute inset-0 scale-110 rounded-full bg-emerald-400/30 blur-2xl animate-pulse" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 ring-8 ring-emerald-50 dark:from-emerald-900/60 dark:to-teal-900/50 dark:ring-emerald-950/50">
                  <CheckCircle2
                    className="h-10 w-10 text-emerald-600 dark:text-emerald-400"
                    strokeWidth={1.75}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
                  Appointment Confirmed
                </h2>
                <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80">
                  Your appointment has been successfully booked.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-emerald-600/90 dark:text-emerald-400/90">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Redirecting to your appointments…
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Confirm Appointment
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Review the details below and confirm your booking
          </p>
        </div>
        <Button
          variant="outline"
          className="w-fit gap-2"
          onClick={() => router.back()}
          disabled={isBusy}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Doctor – left */}
        <Card className="self-start lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="h-5 w-5 text-primary" />
              Doctor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {doctor.name}
              </p>
              <p className="mt-1 text-muted-foreground">
                {doctor.designation || "Doctor"}
              </p>
            </div>

            {doctor.doctorSpecialties &&
              doctor.doctorSpecialties.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2.5 text-sm font-medium text-muted-foreground">
                      Specialties
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.doctorSpecialties.map((ds, idx) => (
                        <Badge key={idx} variant="secondary">
                          {ds.specialities?.title || "N/A"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

            <Separator />

            <div className="grid gap-3 sm:grid-cols-2">
              {doctor.qualification && (
                <div>
                  <p className="text-xs text-muted-foreground">Qualification</p>
                  <p className="mt-0.5 font-medium">{doctor.qualification}</p>
                </div>
              )}
              {doctor.experience !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="mt-0.5 font-medium">
                    {doctor.experience} years
                  </p>
                </div>
              )}
              {doctor.currentWorkingPlace && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Working at</p>
                  <p className="mt-0.5 font-medium">
                    {doctor.currentWorkingPlace}
                  </p>
                </div>
              )}
            </div>

            {(doctor.contactNumber || doctor.address) && (
              <>
                <Separator />
                <div className="space-y-2.5">
                  {doctor.contactNumber && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{doctor.contactNumber}</span>
                    </div>
                  )}
                  {doctor.address && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{doctor.address}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <span className="text-sm font-medium">Consultation Fee</span>
              <span className="text-xl font-bold text-primary">
                ${doctor.appointmentFee}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Schedule + Actions – right */}
        <div className="space-y-6 self-start lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 rounded-lg bg-muted/60 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="mt-1 text-lg font-semibold">
                    {format(new Date(schedule.startDateTime), "EEEE")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(schedule.startDateTime), "MMMM d, yyyy")}
                  </p>
                </div>

                <Separator />

                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {format(new Date(schedule.startDateTime), "h:mm a")} –{" "}
                      {format(new Date(schedule.endDateTime), "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Before you go</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Arrive 10 minutes before your scheduled time
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Bring any relevant medical records or prescriptions
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Cancel or reschedule from your appointments page
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  A confirmation will be sent to your email
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleConfirmBooking}
              disabled={isBusy}
              className="w-full gap-2"
              size="lg"
            >
              {isPayingNow ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Payment…
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay Now & Book
                </>
              )}
            </Button>

            <Button
              onClick={handlePayLater}
              disabled={isBusy}
              variant="outline"
              className="w-full gap-2"
              size="lg"
            >
              {isPayingLater ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Booking…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Book Now, Pay Later
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
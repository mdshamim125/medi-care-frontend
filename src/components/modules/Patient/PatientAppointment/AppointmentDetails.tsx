"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  TestTube2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { changeAppointmentStatus } from "@/services/patient/appointment.service";
import {
  AppointmentStatus,
  IAppointment,
  PaymentStatus,
} from "@/types/appointments.interface";
import { toast } from "sonner";
import AppointmentCountdown from "./AppointmentCountdown";
import ReviewDialog from "./ReviewDialog";
import { initiatePayment } from "@/services/payment/payment.service";

interface AppointmentDetailProps {
  appointment: IAppointment;
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

const AppointmentDetails = ({ appointment }: AppointmentDetailProps) => {
  const router = useRouter();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isCompleted = appointment.status === AppointmentStatus.COMPLETED;
  const isCanceled = appointment.status === AppointmentStatus.CANCELED;
  const isScheduled = appointment.status === AppointmentStatus.SCHEDULED;
  const isUnpaid = appointment.paymentStatus === PaymentStatus.UNPAID;

  const canReview = isCompleted && !appointment.review && !isUnpaid;
  const canCancel = isScheduled && !isCanceled;
  const status = statusConfig[appointment.status];
  const prescription = appointment.prescription;

  const handlePayNow = async () => {
    setIsProcessingPayment(true);
    try {
      const result = await initiatePayment(appointment.id);

      if (result.success && result.data?.paymentUrl) {
        toast.success("Redirecting to payment...");
        sessionStorage.setItem(
          "paymentReturnUrl",
          "/dashboard/my-appointments",
        );
        window.location.replace(result.data.paymentUrl);
      } else {
        toast.error(result.message || "Failed to initiate payment");
        setIsProcessingPayment(false);
      }
    } catch (error) {
      toast.error("An error occurred while initiating payment");
      setIsProcessingPayment(false);
      console.error(error);
    }
  };

  const handleCancelAppointment = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setIsCancelling(true);
    try {
      const result = await changeAppointmentStatus(
        appointment.id,
        AppointmentStatus.CANCELED,
      );

      if (result.success) {
        toast.success("Appointment cancelled successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to cancel appointment");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling appointment");
      console.error(error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Appointment Details
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Complete information about your appointment
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancelAppointment}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Appointment"
              )}
            </Button>
          )}
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {canReview && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Review this appointment
              </h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Your appointment has been completed. Share your experience with
                Dr. {appointment.doctor?.name}.
              </p>
              <Button
                size="sm"
                className="mt-4"
                onClick={() => setShowReviewDialog(true)}
              >
                Write a Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isCompleted && isUnpaid && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Payment required
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                Please complete payment for this appointment
                {isCompleted ? " before leaving a review." : "."}
              </p>
              <Button
                size="sm"
                className="mt-4 gap-1.5 bg-red-600 hover:bg-red-700"
                onClick={handlePayNow}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isCompleted && !appointment.review && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Review not available yet
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                You can leave a review after this appointment is completed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main layout */}
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
                {appointment.doctor?.name || "Unknown Doctor"}
              </p>
              <p className="mt-1 text-muted-foreground">
                {appointment.doctor?.designation || "Doctor"}
              </p>
            </div>

            {appointment.doctor?.doctorSpecialties &&
              appointment.doctor.doctorSpecialties.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2.5 text-sm font-medium text-muted-foreground">
                      Specialties
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {appointment.doctor.doctorSpecialties.map((ds, idx) => (
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
              {appointment.doctor?.qualification && (
                <div>
                  <p className="text-xs text-muted-foreground">Qualification</p>
                  <p className="mt-0.5 font-medium">
                    {appointment.doctor.qualification}
                  </p>
                </div>
              )}
              {appointment.doctor?.experience !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="mt-0.5 font-medium">
                    {appointment.doctor.experience} years
                  </p>
                </div>
              )}
              {appointment.doctor?.currentWorkingPlace && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Working at</p>
                  <p className="mt-0.5 font-medium">
                    {appointment.doctor.currentWorkingPlace}
                  </p>
                </div>
              )}
            </div>

            {(appointment.doctor?.contactNumber ||
              appointment.doctor?.address) && (
              <>
                <Separator />
                <div className="space-y-2.5">
                  {appointment.doctor?.contactNumber && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.doctor.contactNumber}</span>
                    </div>
                  )}
                  {appointment.doctor?.address && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{appointment.doctor.address}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {appointment.doctor?.appointmentFee !== undefined && (
              <>
                <Separator />
                <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <span className="text-sm font-medium">Consultation Fee</span>
                  <span className="text-xl font-bold text-primary">
                    ${appointment.doctor.appointmentFee}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Status + Schedule – right */}
        <div className="space-y-6 self-start lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Appointment
                </span>
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment</span>
                {isUnpaid ? (
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
                  >
                    Pending
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  >
                    Paid
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {appointment.schedule && (
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
                      {format(
                        new Date(appointment.schedule.startDateTime),
                        "EEEE",
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(appointment.schedule.startDateTime),
                        "MMMM d, yyyy",
                      )}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {format(
                          new Date(appointment.schedule.startDateTime),
                          "h:mm a",
                        )}{" "}
                        –{" "}
                        {format(
                          new Date(appointment.schedule.endDateTime),
                          "h:mm a",
                        )}
                      </p>
                    </div>
                  </div>

                  {isScheduled && appointment.schedule.startDateTime && (
                    <>
                      <Separator />
                      <AppointmentCountdown
                        appointmentDateTime={
                          appointment.schedule.startDateTime
                        }
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Prescription – full width */}
      {prescription && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Prescription
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Health Issue */}
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Health Issue
                </p>
              </div>
              <div className="rounded-lg border bg-muted/40 px-4 py-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {prescription.healthIssue || "No health issue recorded."}
                </p>
              </div>
            </div>

            {/* Given Test */}
            {prescription.givenTest && (
              <div>
                <div className="mb-2.5 flex items-center gap-2">
                  <TestTube2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recommended Tests
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/40 px-4 py-3">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {prescription.givenTest}
                  </p>
                </div>
              </div>
            )}

            {/* Structured Instructions */}
            {(() => {
              const raw = prescription.instructions || "";
              const medicinesMatch = raw.match(
                /Medicines?\s*([\s\S]*?)(?=Advice|$)/i,
              );
              const adviceMatch = raw.match(/Advice\s*([\s\S]*)/i);
              const medicinesText = medicinesMatch?.[1]?.trim() || "";
              const adviceText = adviceMatch?.[1]?.trim() || "";
              const hasStructure = medicinesText || adviceText;

              if (!hasStructure) {
                return (
                  <div>
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Instructions
                    </p>
                    <div className="rounded-lg border bg-muted/40 px-4 py-3">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {raw || "No instructions provided."}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <>
                  {medicinesText && (
                    <div>
                      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Medicines
                      </p>
                      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        {medicinesText
                          .split(/(?<=\.)\s+(?=[A-Z])/)
                          .map((item) => item.trim())
                          .filter(Boolean)
                          .map((item, idx) => {
                            const parts = item.split(/\s*[—–-]\s*/);
                            const name = parts[0]?.trim() || item;
                            const dosage = parts.slice(1).join(" — ").trim();

                            return (
                              <li
                                key={idx}
                                className="rounded-lg border bg-muted/40 px-3.5 py-2.5"
                              >
                                <p className="text-sm font-medium">{name}</p>
                                {dosage && (
                                  <p className="mt-0.5 text-sm text-muted-foreground">
                                    {dosage}
                                  </p>
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}

                  {adviceText && (
                    <div>
                      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Advice
                      </p>
                      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                        <ul className="list-disc space-y-1.5 pl-4">
                          {adviceText
                            .split(/(?<=\.)\s+/)
                            .map((item) => item.trim())
                            .filter(Boolean)
                            .map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {prescription.followUpDate && (
              <div className="flex items-center justify-between rounded-lg border border-green-100 bg-green-50/60 px-4 py-3 dark:border-green-900 dark:bg-green-950/30">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Follow-up Date
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {format(
                      new Date(prescription.followUpDate),
                      "EEEE, MMMM d, yyyy",
                    )}
                  </p>
                </div>
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Review */}
      {appointment.review && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Star className="h-5 w-5 fill-current" />
              Your Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 rounded-lg bg-amber-50 p-5 dark:bg-amber-950/40">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= appointment.review!.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
                  {appointment.review.rating}/5
                </span>
              </div>

              {appointment.review.comment && (
                <div>
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                    Comment
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
                    {appointment.review.comment}
                  </p>
                </div>
              )}

              <p className="text-xs italic text-amber-600/80 dark:text-amber-400/70">
                Reviews cannot be edited or deleted once submitted.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {canReview && (
        <ReviewDialog
          isOpen={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          appointmentId={appointment.id}
          doctorName={appointment.doctor?.name || "the doctor"}
        />
      )}
    </div>
  );
};

export default AppointmentDetails;
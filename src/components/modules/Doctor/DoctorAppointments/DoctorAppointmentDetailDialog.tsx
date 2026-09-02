/* eslint-disable react/no-unescaped-entities */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPrescription } from "@/services/patient/prescription.service";
import { IAppointment } from "@/types/appointments.interface";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Star,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DoctorAppointmentDetailDialogProps {
  appointment: IAppointment | null;
  open: boolean;
  onClose: () => void;
}

const statusStyles: Record<string, string> = {
  SCHEDULED:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  INPROGRESS:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  COMPLETED:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
  CANCELED:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
};

export default function DoctorAppointmentDetailDialog({
  appointment,
  open,
  onClose,
}: DoctorAppointmentDetailDialogProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [healthIssue, setHealthIssue] = useState("");
  const [givenTest, setGivenTest] = useState("");
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  if (!appointment) return null;

  const { patient, schedule, status, paymentStatus, prescription, review } =
    appointment;

  const isCompleted = status === "COMPLETED";
  const hasPrescription = !!prescription;
  const canWritePrescription = isCompleted && !hasPrescription;

  const handleSubmitPrescription = async () => {
    if (!healthIssue.trim()) {
      toast.error("Please provide the patient's health issue");
      return;
    }

    if (healthIssue.trim().length < 3) {
      toast.error("Health issue must be at least 3 characters long");
      return;
    }

    if (!instructions.trim()) {
      toast.error("Please provide prescription instructions");
      return;
    }

    if (instructions.trim().length < 20) {
      toast.error(
        "Instructions must be at least 20 characters long for clarity",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const prescriptionData: {
        appointmentId: string;
        healthIssue: string;
        givenTest?: string;
        instructions: string;
        followUpDate?: string;
      } = {
        appointmentId: appointment.id,
        healthIssue: healthIssue.trim(),
        instructions: instructions.trim(),
      };

      if (givenTest.trim()) {
        prescriptionData.givenTest = givenTest.trim();
      }

      if (followUpDate) {
        prescriptionData.followUpDate = new Date(followUpDate).toISOString();
      }

      const result = await createPrescription(prescriptionData);

      if (result.success) {
        toast.success("Prescription created successfully");

        setHealthIssue("");
        setGivenTest("");
        setInstructions("");
        setFollowUpDate("");

        onClose();
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create prescription");
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error("An error occurred while creating prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHealthIssue("");
    setGivenTest("");
    setInstructions("");
    setFollowUpDate("");
    onClose();
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto p-0">
        <DialogHeader className="border-b bg-muted/30 px-6 py-5">
          <DialogTitle className="text-xl">Appointment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-6 py-5">
          {/* PATIENT INFORMATION */}
          <div className="rounded-xl border bg-muted/40 p-5">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Patient Information</h3>
            </div>

            <div className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="mt-0.5 font-medium">{patient?.name || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="mt-0.5 break-all font-medium">
                  {patient?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {patient?.contactNumber || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="mt-0.5 flex items-start gap-1.5 font-medium">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  {patient?.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* APPOINTMENT DETAILS */}
          <div className="rounded-xl border p-5">
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Appointment Details</h3>
            </div>

            <div className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="mt-0.5 font-medium">
                  {schedule?.startDateTime
                    ? format(
                        new Date(schedule.startDateTime),
                        "EEEE, MMM d, yyyy",
                      )
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {schedule?.startDateTime && schedule?.endDateTime
                    ? `${format(
                        new Date(schedule.startDateTime),
                        "h:mm a",
                      )} – ${format(new Date(schedule.endDateTime), "h:mm a")}`
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={statusStyles[status] || ""}
                  >
                    {status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <div className="mt-1">
                  <Badge
                    variant={
                      paymentStatus === "PAID" ? "default" : "destructive"
                    }
                  >
                    {paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* PRESCRIPTION */}
          <div className="rounded-xl border p-5">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Prescription</h3>
            </div>

            {/* CANCELED */}
            {status === "CANCELED" && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 dark:border-red-800 dark:bg-red-950/40">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  This appointment has been canceled. No prescription can be
                  provided.
                </p>
              </div>
            )}

            {/* NOT COMPLETED */}
            {!isCompleted && status !== "CANCELED" && (
              <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                You can write a prescription once the appointment is marked as{" "}
                <span className="font-medium text-green-700 dark:text-green-400">
                  Completed
                </span>
                .
              </div>
            )}

            {/* WRITE PRESCRIPTION */}
            {canWritePrescription && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-800 dark:bg-amber-950/40">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Once created, prescriptions cannot be edited or deleted.
                    Please ensure all information is correct.
                  </p>
                </div>

                {/* HEALTH ISSUE */}
                <div className="space-y-2">
                  <Label htmlFor="healthIssue">
                    Health Issue <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="healthIssue"
                    placeholder="Example: Fever, sore throat, headache, and mild cough"
                    value={healthIssue}
                    onChange={(e) => setHealthIssue(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe the patient's primary health issue or diagnosis.
                  </p>
                </div>

                {/* GIVEN TEST */}
                <div className="space-y-2">
                  <Label htmlFor="givenTest">
                    Given Test{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Textarea
                    id="givenTest"
                    placeholder="Example: CBC, Blood Sugar, Chest X-Ray"
                    value={givenTest}
                    onChange={(e) => setGivenTest(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add any tests recommended for the patient.
                  </p>
                </div>

                {/* INSTRUCTIONS */}
                <div className="space-y-2">
                  <Label htmlFor="instructions">
                    Instructions <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder={`Example format:
Medicines
Paracetamol 500 mg — 1 tablet after meals, 2–3 times daily if fever occurs.
Cetirizine 10 mg — 1 tablet at night for 5 days.

Advice
Drink plenty of water and take adequate rest.
Avoid cold drinks and dusty environments.`}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={10}
                    className="resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {instructions.length} / 20 characters minimum
                  </p>
                </div>

                {/* FOLLOW-UP DATE */}
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">
                    Follow-up Date & Time{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="followUpDate"
                    type="datetime-local"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <Button
                  onClick={handleSubmitPrescription}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Prescription...
                    </>
                  ) : (
                    "Create Prescription"
                  )}
                </Button>
              </div>
            )}

            {/* EXISTING PRESCRIPTION */}
            {hasPrescription && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3.5 dark:border-green-800 dark:bg-green-950/40">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Prescription has been provided
                    </p>
                    <p className="mt-0.5 text-xs text-green-700 dark:text-green-300">
                      Appointment status cannot be changed once a prescription
                      is created.
                    </p>
                  </div>
                </div>

                {/* HEALTH ISSUE */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Health Issue
                  </p>
                  <div className="rounded-lg border bg-muted/40 px-3.5 py-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {prescription.healthIssue || "No health issue recorded."}
                    </p>
                  </div>
                </div>

                {/* GIVEN TEST */}
                {prescription.givenTest && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Given Test
                    </p>
                    <div className="rounded-lg border bg-muted/40 px-3.5 py-3">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {prescription.givenTest}
                      </p>
                    </div>
                  </div>
                )}

                {/* STRUCTURED INSTRUCTIONS */}
                <div className="space-y-4">
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
                          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Instructions
                          </p>
                          <div className="rounded-lg border bg-muted/40 px-3.5 py-3">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {raw || "No instructions provided."}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <>
                        {/* MEDICINES */}
                        {medicinesText && (
                          <div>
                            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Medicines
                            </p>
                            <ul className="space-y-2.5">
                              {medicinesText
                                .split(/(?<=\.)\s+(?=[A-Z])/)
                                .map((item) => item.trim())
                                .filter(Boolean)
                                .map((item, idx) => {
                                  const parts = item.split(/\s*[—–-]\s*/);
                                  const name = parts[0]?.trim() || item;
                                  const dosage = parts
                                    .slice(1)
                                    .join(" — ")
                                    .trim();

                                  return (
                                    <li
                                      key={idx}
                                      className="rounded-lg border bg-muted/40 px-3.5 py-2.5"
                                    >
                                      <p className="text-sm font-medium">
                                        {name}
                                      </p>
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

                        {/* ADVICE */}
                        {adviceText && (
                          <div>
                            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Advice
                            </p>
                            <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                              <ul className="list-disc space-y-1 pl-4">
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
                </div>

                {/* FOLLOW-UP */}
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

                <p className="border-t pt-3 text-xs italic text-muted-foreground">
                  Prescriptions cannot be edited or deleted once created.
                </p>
              </div>
            )}
          </div>

          {/* PATIENT REVIEW */}
          {review && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-950/20">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Patient Review</h3>
                    <p className="text-xs text-muted-foreground">
                      Feedback from {patient?.name || "the patient"}
                    </p>
                  </div>
                </div>

                {/* RATING */}
                <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-background px-3 py-1.5 dark:border-amber-800">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= review.rating
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">
                    {review.rating}/5
                  </span>
                </div>
              </div>

              {/* REVIEW COMMENT */}
              {review.comment ? (
                <div className="rounded-lg border bg-background px-4 py-3.5">
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Patient's Comment
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    "{review.comment}"
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border bg-background px-4 py-3 text-sm text-muted-foreground">
                  The patient provided a rating without a written comment.
                </div>
              )}

              {/* REVIEW DATE */}
              {"createdAt" in review && review.createdAt && (
                <p className="mt-3 text-right text-xs text-muted-foreground">
                  Reviewed on{" "}
                  {format(new Date(review.createdAt), "MMMM d, yyyy")}
                </p>
              )}
            </div>
          )}

          {/* NO REVIEW */}
          {!review && isCompleted && (
            <div className="rounded-xl border border-dashed p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Star className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">
                    No patient review yet
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    The patient has not submitted a review for this appointment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t bg-muted/20 px-6 py-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

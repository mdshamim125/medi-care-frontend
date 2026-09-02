"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { doctorPrescriptionColumns } from "./doctorPrescriptionColumns";
import { IPrescription } from "@/types/prescription.interface";

interface DoctorPrescriptionsTableProps {
  prescriptions: IPrescription[];
}

export default function DoctorPrescriptionsTable({
  prescriptions = [],
}: DoctorPrescriptionsTableProps) {
  const router = useRouter();
  const [viewingPrescription, setViewingPrescription] =
    useState<IPrescription | null>(null);

  const handleView = (prescription: IPrescription) => {
    setViewingPrescription(prescription);
  };

  const handleClose = () => {
    setViewingPrescription(null);
    router.refresh();
  };

  return (
    <>
      <ManagementTable
        data={prescriptions}
        columns={doctorPrescriptionColumns}
        onView={handleView}
        getRowKey={(prescription) => prescription.id}
        emptyMessage="No prescriptions found"
      />

      {/* View Detail Dialog */}
      {viewingPrescription && (
        <Dialog open={!!viewingPrescription} onOpenChange={handleClose}>
          <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-y-auto p-0">
            <DialogHeader className="border-b bg-muted/30 px-6 py-5">
              <DialogTitle className="text-xl">
                Prescription Details
              </DialogTitle>
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
                    <p className="mt-0.5 font-medium">
                      {viewingPrescription.patient?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="mt-0.5 break-all font-medium">
                      {viewingPrescription.patient?.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {viewingPrescription.patient?.contactNumber ||
                        "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="mt-0.5 flex items-start gap-1.5 font-medium">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      {viewingPrescription.patient?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* APPOINTMENT INFORMATION */}
              <div className="rounded-xl border p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Appointment Information</h3>
                </div>

                <div className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="mt-0.5 font-medium">
                      {viewingPrescription.appointment?.schedule?.startDateTime
                        ? format(
                            new Date(
                              viewingPrescription.appointment.schedule
                                .startDateTime,
                            ),
                            "EEEE, MMM d, yyyy",
                          )
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {viewingPrescription.appointment?.schedule
                        ?.startDateTime &&
                      viewingPrescription.appointment?.schedule?.endDateTime
                        ? `${format(
                            new Date(
                              viewingPrescription.appointment.schedule
                                .startDateTime,
                            ),
                            "h:mm a",
                          )} – ${format(
                            new Date(
                              viewingPrescription.appointment.schedule
                                .endDateTime,
                            ),
                            "h:mm a",
                          )}`
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-1">
                      <Badge variant="default" className="bg-green-600">
                        {viewingPrescription.appointment?.status || "N/A"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          viewingPrescription.appointment?.paymentStatus ===
                          "PAID"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {viewingPrescription.appointment?.paymentStatus ||
                          "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRESCRIPTION DETAILS */}
              <div className="rounded-xl border p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">Prescription</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Medication instructions and clinical advice
                      </p>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    Read-only
                  </Badge>
                </div>

                {/* SUCCESS NOTICE */}
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3.5 dark:border-green-800 dark:bg-green-950/40">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Prescription has been provided
                    </p>
                    <p className="mt-0.5 text-xs text-green-700 dark:text-green-300">
                      This prescription is permanent and cannot be modified.
                    </p>
                  </div>
                </div>

                {/* HEALTH ISSUE */}
                <div className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Health Issue
                  </p>
                  <div className="rounded-lg border bg-muted/40 px-3.5 py-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {viewingPrescription.healthIssue ||
                        "No health issue recorded."}
                    </p>
                  </div>
                </div>

                {/* GIVEN TEST */}
                {viewingPrescription.givenTest && (
                  <div className="mb-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Given Test
                    </p>
                    <div className="rounded-lg border bg-muted/40 px-3.5 py-3">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {viewingPrescription.givenTest}
                      </p>
                    </div>
                  </div>
                )}

                {/* STRUCTURED INSTRUCTIONS */}
                <div className="space-y-6">
                  {(() => {
                    const rawInstructions =
                      viewingPrescription.instructions || "";

                    const medicinesMatch = rawInstructions.match(
                      /Medicines?\s*([\s\S]*?)(?=\n?\s*Advice\b|$)/i,
                    );
                    const adviceMatch =
                      rawInstructions.match(/Advice\s*([\s\S]*)/i);

                    const medicinesText = medicinesMatch?.[1]?.trim() || "";
                    const adviceText = adviceMatch?.[1]?.trim() || "";

                    const medicines = medicinesText
                      .split(/\n+/)
                      .map((item) => item.trim())
                      .filter(Boolean);

                    const advice = adviceText
                      .split(/\n+/)
                      .map((item) => item.trim())
                      .filter(Boolean);

                    // Fallback if no structure found
                    if (!medicinesText && !adviceText) {
                      return (
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Instructions
                          </p>
                          <div className="rounded-lg border bg-muted/40 px-3.5 py-3">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {rawInstructions || "No instructions provided."}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <>
                        {/* MEDICINES */}
                        {medicines.length > 0 && (
                          <section>
                            <div className="mb-3 flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                                <span className="text-sm font-bold text-primary">
                                  Rx
                                </span>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold">
                                  Medicines
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Prescribed medication and dosage instructions
                                </p>
                              </div>
                            </div>

                            <div className="overflow-hidden rounded-lg border">
                              <div className="divide-y">
                                {medicines.map((medicine, index) => {
                                  const parts = medicine.split(/\s*[—–-]\s*/);
                                  const medicineName =
                                    parts[0]?.trim() || medicine;
                                  const dosage = parts
                                    .slice(1)
                                    .join(" — ")
                                    .trim();

                                  return (
                                    <div
                                      key={index}
                                      className="flex gap-4 px-4 py-3.5"
                                    >
                                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                        {index + 1}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold">
                                          {medicineName}
                                        </p>
                                        {dosage && (
                                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                            {dosage}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </section>
                        )}

                        {/* ADVICE */}
                        {advice.length > 0 && (
                          <section>
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold">
                                Doctor&apos;s Advice
                              </h4>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Additional instructions for the patient
                              </p>
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4">
                              <ul className="space-y-2.5">
                                {advice.map((item, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2.5 text-sm leading-5"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </section>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* FOLLOW-UP */}
                {viewingPrescription.followUpDate && (
                  <div className="mt-6 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3.5 dark:border-blue-900 dark:bg-blue-950/30">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Follow-up Appointment
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {format(
                          new Date(viewingPrescription.followUpDate),
                          "EEEE, MMMM d, yyyy",
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {format(
                          new Date(viewingPrescription.followUpDate),
                          "h:mm a",
                        )}
                      </p>
                    </div>
                    <div className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      Follow-up
                    </div>
                  </div>
                )}

                {/* PRESCRIBED ON */}
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Prescribed On
                    </p>
                    <p className="mt-0.5 text-sm font-medium">
                      {format(
                        new Date(viewingPrescription.createdAt),
                        "MMMM d, yyyy",
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(viewingPrescription.createdAt),
                      "h:mm a",
                    )}
                  </p>
                </div>

                {/* READ-ONLY NOTICE */}
                <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-muted/40 px-3.5 py-2.5">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    This prescription is read-only and cannot be edited or
                    deleted.
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t bg-muted/20 px-6 py-4">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
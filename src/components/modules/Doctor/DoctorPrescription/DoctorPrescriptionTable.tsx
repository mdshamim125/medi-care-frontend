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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Patient Information */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold text-lg mb-3">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {viewingPrescription.patient?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">
                      {viewingPrescription.patient?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact Number</p>
                    <p className="font-medium">
                      {viewingPrescription.patient?.contactNumber ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {viewingPrescription.patient?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">
                  Appointment Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Appointment Date</p>
                    <p className="font-medium">
                      {viewingPrescription.appointment?.schedule?.startDateTime
                        ? format(
                            new Date(
                              viewingPrescription.appointment.schedule
                                .startDateTime,
                            ),
                            "PPP",
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {viewingPrescription.appointment?.schedule
                        ?.startDateTime &&
                      viewingPrescription.appointment?.schedule?.endDateTime
                        ? `${format(
                            new Date(
                              viewingPrescription.appointment.schedule
                                .startDateTime,
                            ),
                            "p",
                          )} - ${format(
                            new Date(
                              viewingPrescription.appointment.schedule
                                .endDateTime,
                            ),
                            "p",
                          )}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <div>
                      <Badge variant="default" className="bg-green-600">
                        {viewingPrescription.appointment?.status || "N/A"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment</p>
                    <div>
                      <Badge variant="default">
                        {viewingPrescription.appointment?.paymentStatus ||
                          "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription Details */}
              {/* Prescription Details */}
<div className="rounded-xl border bg-card p-5">
  <div className="mb-5 flex items-center justify-between">
    <div>
      <h3 className="text-base font-semibold">Prescription</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Medication instructions and clinical advice
      </p>
    </div>

    <Badge variant="outline" className="text-xs">
      Read-only
    </Badge>
  </div>

  {(() => {
    const rawInstructions = viewingPrescription.instructions || "";

    // Extract Medicines section
    const medicinesMatch = rawInstructions.match(
      /Medicines?\s*([\s\S]*?)(?=\n?\s*Advice\b|$)/i,
    );

    // Extract Advice section
    const adviceMatch = rawInstructions.match(
      /Advice\s*([\s\S]*)/i,
    );

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

    // If prescription does not follow the structured format
    if (!medicinesText && !adviceText) {
      return (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Instructions
          </p>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="whitespace-pre-wrap text-sm leading-6">
              {rawInstructions || "No instructions provided."}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Medicines */}
        {medicines.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <span className="text-sm font-bold text-primary">Rx</span>
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
                  const parts = medicine.split(
                    /\s*[—–-]\s*/,
                  );

                  const medicineName =
                    parts[0]?.trim() || medicine;

                  const dosage =
                    parts.slice(1).join(" — ").trim();

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

        {/* Advice */}
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

        {/* Follow-up */}
        {viewingPrescription.followUpDate && (
          <section className="rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3.5 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Follow-up Appointment
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {format(
                    new Date(
                      viewingPrescription.followUpDate,
                    ),
                    "EEEE, MMMM d, yyyy",
                  )}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {format(
                    new Date(
                      viewingPrescription.followUpDate,
                    ),
                    "h:mm a",
                  )}
                </p>
              </div>

              <div className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Follow-up
              </div>
            </div>
          </section>
        )}
      </div>
    );
  })()}

  {/* Prescribed On */}
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

  {/* Read-only notice */}
  <div className="mt-4 rounded-lg bg-muted/40 px-3.5 py-2.5">
    <p className="text-xs text-muted-foreground">
      This prescription is read-only and cannot be edited or
      deleted.
    </p>
  </div>
</div>
            </div>

            <div className="flex justify-end pt-4 border-t">
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

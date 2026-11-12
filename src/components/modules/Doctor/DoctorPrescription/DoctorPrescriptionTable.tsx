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
import { IPrescription } from "@/types/prescription.interface";
import { format, isValid, parseISO } from "date-fns";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Phone,
  Pill,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { doctorPrescriptionColumns } from "./doctorPrescriptionColumns";

interface DoctorPrescriptionsTableProps {
  prescriptions: IPrescription[];
}

const formatDate = (value?: string | null, pattern = "MMM d, yyyy") => {
  if (!value) return "Not available";
  const date = parseISO(value);
  return isValid(date) ? format(date, pattern) : "Not available";
};

const getInstructionSections = (instructions: string) => {
  const medicinesMatch = instructions.match(
    /Medicines?\s*([\s\S]*?)(?=\n?\s*Advice\b|$)/i,
  );
  const adviceMatch = instructions.match(/Advice\s*([\s\S]*)/i);
  const medicinesText = medicinesMatch?.[1]?.trim() || "";
  const adviceText = adviceMatch?.[1]?.trim() || "";

  return {
    medicines: medicinesText.split(/\n+/).map((item) => item.trim()).filter(Boolean),
    advice: adviceText.split(/\n+/).map((item) => item.trim()).filter(Boolean),
    isStructured: Boolean(medicinesText || adviceText),
  };
};

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className="mt-1.5 break-words text-sm font-medium leading-5 text-slate-800">
        {children}
      </div>
    </div>
  );
}

export default function DoctorPrescriptionsTable({
  prescriptions = [],
}: DoctorPrescriptionsTableProps) {
  const router = useRouter();
  const [viewingPrescription, setViewingPrescription] =
    useState<IPrescription | null>(null);

  const handleClose = () => {
    setViewingPrescription(null);
    router.refresh();
  };

  const schedule = viewingPrescription?.appointment?.schedule;
  const startDateTime = schedule?.startDateTime;
  const endDateTime = schedule?.endDateTime;
  const instructionSections = getInstructionSections(
    viewingPrescription?.instructions || "",
  );

  return (
    <>
      <ManagementTable
        data={prescriptions}
        columns={doctorPrescriptionColumns}
        onView={setViewingPrescription}
        getRowKey={(prescription) => prescription.id}
        emptyMessage="No prescriptions found"
      />

      <Dialog
        open={!!viewingPrescription}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        {viewingPrescription && (
          <DialogContent className="flex max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-2xl border-slate-200 p-0 shadow-2xl">
            <DialogHeader className="shrink-0 border-b border-slate-200 bg-gradient-to-r from-teal-50 via-white to-slate-50 px-5 py-5 text-left sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Prescription details
                    </DialogTitle>
                    <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-50">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      Issued
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Patient care record
                    <span className="mx-2 text-slate-300">•</span>
                    Issued {formatDate(viewingPrescription.createdAt)}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-5 py-5 sm:px-7">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                  <UserRound className="h-4 w-4 text-teal-700" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Patient information
                  </h3>
                </div>
                <div className="grid gap-5 p-4 sm:grid-cols-2 sm:p-5">
                  <DetailItem label="Patient name">
                    {viewingPrescription.patient?.name || "Not available"}
                  </DetailItem>
                  <DetailItem label="Email">
                    {viewingPrescription.patient?.email || "Not available"}
                  </DetailItem>
                  <DetailItem label="Contact">
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {viewingPrescription.patient?.contactNumber ||
                        "Not provided"}
                    </span>
                  </DetailItem>
                  <DetailItem label="Address">
                    <span className="inline-flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {viewingPrescription.patient?.address || "Not provided"}
                    </span>
                  </DetailItem>
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                  <CalendarDays className="h-4 w-4 text-teal-700" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Related appointment
                  </h3>
                </div>
                <div className="grid gap-5 p-4 sm:grid-cols-2 sm:p-5">
                  <DetailItem label="Appointment date">
                    {formatDate(startDateTime, "EEEE, MMM d, yyyy")}
                  </DetailItem>
                  <DetailItem label="Appointment time">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                      {startDateTime && endDateTime
                        ? `${formatDate(startDateTime, "h:mm a")} – ${formatDate(endDateTime, "h:mm a")}`
                        : "Not available"}
                    </span>
                  </DetailItem>
                  <DetailItem label="Visit status">
                    <Badge variant="outline" className="font-medium">
                      {viewingPrescription.appointment?.status || "Not available"}
                    </Badge>
                  </DetailItem>
                  <DetailItem label="Payment status">
                    <Badge
                      variant="outline"
                      className={
                        viewingPrescription.appointment?.paymentStatus === "PAID"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }
                    >
                      {viewingPrescription.appointment?.paymentStatus ||
                        "Not available"}
                    </Badge>
                  </DetailItem>
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-teal-700" />
                    <h3 className="text-sm font-semibold text-slate-900">
                      Treatment plan
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-slate-500">
                    Read-only record
                  </Badge>
                </div>

                <div className="space-y-5 p-4 sm:p-5">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Health issue
                    </p>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {viewingPrescription.healthIssue ||
                          "No health issue recorded."}
                      </p>
                    </div>
                  </div>

                  {viewingPrescription.givenTest && (
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Tests requested
                      </p>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          {viewingPrescription.givenTest}
                        </p>
                      </div>
                    </div>
                  )}

                  {instructionSections.isStructured ? (
                    <div className="space-y-5">
                      {instructionSections.medicines.length > 0 && (
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <Pill className="h-4 w-4 text-teal-700" />
                            <p className="text-sm font-semibold text-slate-900">
                              Prescribed medicines
                            </p>
                          </div>
                          <div className="overflow-hidden rounded-lg border border-slate-200">
                            {instructionSections.medicines.map(
                              (medicine, index) => {
                                const [medicineName, ...dosageParts] =
                                  medicine.split(/\s*[—–-]\s*/);
                                const dosage = dosageParts.join(" — ").trim();

                                return (
                                  <div
                                    key={`${index}-${medicine}`}
                                    className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-800">
                                      {index + 1}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-slate-800">
                                        {medicineName?.trim() || medicine}
                                      </p>
                                      {dosage && (
                                        <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-slate-500">
                                          {dosage}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      )}

                      {instructionSections.advice.length > 0 && (
                        <div>
                          <p className="mb-2 text-sm font-semibold text-slate-900">
                            Doctor&apos;s advice
                          </p>
                          <ul className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            {instructionSections.advice.map((item, index) => (
                              <li
                                key={`${index}-${item}`}
                                className="flex items-start gap-2.5 text-sm leading-5 text-slate-700"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Instructions
                      </p>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          {viewingPrescription.instructions ||
                            "No instructions provided."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Follow-up
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {viewingPrescription.followUpDate
                      ? formatDate(
                          viewingPrescription.followUpDate,
                          "EEEE, MMMM d, yyyy",
                        )
                      : "No follow-up scheduled"}
                  </p>
                  {viewingPrescription.followUpDate && (
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(viewingPrescription.followUpDate, "h:mm a")}
                    </p>
                  )}
                </section>
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Record issued
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatDate(
                      viewingPrescription.createdAt,
                      "EEEE, MMMM d, yyyy",
                    )}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(viewingPrescription.createdAt, "h:mm a")}
                  </p>
                </section>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-slate-500">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-xs leading-5">
                  This prescription is a read-only clinical record and cannot
                  be edited or deleted.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 justify-end border-t border-slate-200 bg-white px-5 py-3.5 sm:px-7">
              <Button
                className="min-w-24 bg-teal-700 hover:bg-teal-800"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

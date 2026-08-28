"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IPrescription } from "@/types/prescription.interface";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

interface PatientPrescriptionsListProps {
  prescriptions: IPrescription[];
}

export default function PatientPrescriptionsList({
  prescriptions = [],
}: PatientPrescriptionsListProps) {
  const sortedPrescriptions = [...prescriptions].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDownloadPDF = (prescription: IPrescription) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(15, 76, 129);
  doc.rect(0, 0, pageWidth, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Medi-Care", margin, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Your Health, Our Priority", margin, 23);

  doc.setFontSize(9);
  doc.text("Official Prescription", pageWidth - margin, 15, {
    align: "right",
  });
  doc.text(
    `Ref: ${prescription.id.slice(0, 8).toUpperCase()}`,
    pageWidth - margin,
    23,
    { align: "right" }
  );

  y = 45;

  // ── Doctor Section ──────────────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PRESCRIBED BY", margin, y);

  y += 7;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(prescription.doctor?.name || "Unknown Doctor", margin, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);

  if (prescription.doctor?.designation) {
    doc.text(prescription.doctor.designation, margin, y);
    y += 5;
  }

  if (prescription.doctor?.email) {
    doc.text(prescription.doctor.email, margin, y);
    y += 5;
  }

  y += 8;

  // ── Details Section ─────────────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DETAILS", margin, y);

  y += 7;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const prescribedDate = format(
    new Date(prescription.createdAt),
    "MMMM d, yyyy"
  );
  doc.text(`Prescribed on:  ${prescribedDate}`, margin, y);
  y += 6;

  if (prescription.appointment?.schedule?.startDateTime) {
    const apptDate = format(
      new Date(prescription.appointment.schedule.startDateTime),
      "MMMM d, yyyy"
    );
    doc.text(`Appointment:    ${apptDate}`, margin, y);
    y += 6;
  }

  if (prescription.followUpDate) {
    const followUp = format(
      new Date(prescription.followUpDate),
      "MMMM d, yyyy"
    );
    doc.setTextColor(15, 76, 129);
    doc.setFont("helvetica", "bold");
    doc.text(`Follow-up:      ${followUp}`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    y += 6;
  }

  y += 10;

  // ── Parse Instructions ──────────────────────────────────
  const raw =
    prescription.instructions || "No instructions provided.";

  // Simple parser for "Medicines ... Advice ..." format
  let medicinesText = "";
  let adviceText = "";

  const medicinesMatch = raw.match(
    /Medicines?\s*([\s\S]*?)(?=Advice|$)/i
  );
  const adviceMatch = raw.match(/Advice\s*([\s\S]*)/i);

  if (medicinesMatch) {
    medicinesText = medicinesMatch[1].trim();
  }
  if (adviceMatch) {
    adviceText = adviceMatch[1].trim();
  }

  // Fallback: if no structure found, treat everything as instructions
  const hasStructure = medicinesText || adviceText;

  // ── Medicines Section ───────────────────────────────────
  if (hasStructure && medicinesText) {
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("MEDICINES", margin, y);

    y += 7;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Split medicines by common separators (period followed by capital letter or "—")
    const medicineItems = medicinesText
      .split(/(?<=\.)\s+(?=[A-Z])/)
      .map((item) => item.trim())
      .filter(Boolean);

    medicineItems.forEach((item) => {
      // Try to split "Name — dosage"
      const parts = item.split(/\s*[—–-]\s*/);
      const name = parts[0]?.trim() || item;
      const dosage = parts.slice(1).join(" — ").trim();

      // Medicine name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(`•  ${name}`, margin, y);
      y += 5;

      // Dosage
      if (dosage) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const dosageLines = doc.splitTextToSize(
          dosage,
          contentWidth - 8
        );
        doc.text(dosageLines, margin + 6, y);
        y += dosageLines.length * 4.5 + 3;
      } else {
        y += 2;
      }
    });

    y += 4;
  }

  // ── Advice Section ──────────────────────────────────────
  if (hasStructure && adviceText) {
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("ADVICE", margin, y);

    y += 7;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Split advice into sentences
    const adviceItems = adviceText
      .split(/(?<=\.)\s+/)
      .map((item) => item.trim())
      .filter(Boolean);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    adviceItems.forEach((item) => {
      const lines = doc.splitTextToSize(`•  ${item}`, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 2;
    });

    y += 4;
  }

  // ── Fallback: unstructured instructions ─────────────────
  if (!hasStructure) {
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PRESCRIPTION INSTRUCTIONS", margin, y);

    y += 7;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    const splitText = doc.splitTextToSize(raw, contentWidth - 8);
    const boxHeight = splitText.length * 5.5 + 12;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y - 4, contentWidth, boxHeight, 3, 3, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(splitText, margin + 4, y + 4);

    y += boxHeight + 8;
  }

  // ── Footer / Disclaimer ─────────────────────────────────
  const footerY = 275;

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);

  doc.text(
    "This is a computer-generated prescription from Medi-Care.",
    pageWidth / 2,
    footerY + 7,
    { align: "center" }
  );
  doc.text(
    "Please consult your doctor for any questions or concerns regarding this prescription.",
    pageWidth / 2,
    footerY + 12,
    { align: "center" }
  );
  doc.text(
    `Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`,
    pageWidth / 2,
    footerY + 17,
    { align: "center" }
  );

  const fileName = `MediCare-Prescription-${prescription.id.slice(0, 8)}-${format(
    new Date(prescription.createdAt),
    "yyyy-MM-dd"
  )}.pdf`;

  doc.save(fileName);
};

  // ── Empty State ─────────────────────────────────────────────
  if (prescriptions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No prescriptions yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Prescriptions from your completed appointments will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ── Prescription Cards ──────────────────────────────────────
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {sortedPrescriptions.map((prescription) => (
        <Card
          key={prescription.id}
          className="flex flex-col overflow-hidden transition-all hover:shadow-md"
        >
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold leading-tight">
                  {prescription.doctor?.name || "Unknown Doctor"}
                </h3>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {prescription.doctor?.email || "No email"}
                </p>
                {prescription.doctor?.designation && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {prescription.doctor.designation}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-4 pt-0">
            {prescription.appointment?.schedule?.startDateTime && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Appointment</span>
                <span className="ml-auto font-medium">
                  {format(
                    new Date(prescription.appointment.schedule.startDateTime),
                    "MMM d, yyyy"
                  )}
                </span>
              </div>
            )}

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Instructions
              </div>
              <div className="rounded-lg bg-muted/60 px-3 py-2.5">
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {prescription.instructions || "No instructions provided."}
                </p>
              </div>
            </div>

            {prescription.followUpDate && (
              <Badge
                variant="secondary"
                className="gap-1.5 border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
              >
                <Calendar className="h-3 w-3" />
                Follow-up:{" "}
                {format(new Date(prescription.followUpDate), "MMM d, yyyy")}
              </Badge>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t bg-muted/30 px-6 py-4">
            <div className="flex w-full items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Prescribed on{" "}
              {format(new Date(prescription.createdAt), "MMM d, yyyy")}
            </div>

            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex-1 gap-1.5"
                onClick={() => handleDownloadPDF(prescription)}
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </Button>

              {prescription.appointment?.id && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 flex-1"
                  asChild
                >
                  <Link
                    href={`/dashboard/my-appointments/${prescription.appointment.id}`}
                  >
                    View Details
                  </Link>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
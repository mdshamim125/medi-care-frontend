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
  TestTube2,
} from "lucide-react";
import Link from "next/link";

interface PatientPrescriptionsListProps {
  prescriptions: IPrescription[];
}

export default function PatientPrescriptionsList({
  prescriptions = [],
}: PatientPrescriptionsListProps) {
  const sortedPrescriptions = [...prescriptions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleDownloadPDF = (prescription: IPrescription) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    const colGap = 6;
    const leftColWidth = contentWidth * 0.42;
    const rightColWidth = contentWidth * 0.58 - colGap;
    const leftX = margin;
    const rightX = margin + leftColWidth + colGap;

    let y = 0;

    // ══════════════════════════════════════════════════════════
    // HEADER BAR
    // ══════════════════════════════════════════════════════════
    doc.setFillColor(15, 76, 129);
    doc.rect(0, 0, pageWidth, 28, "F");

    // Accent line under header
    doc.setFillColor(34, 139, 200);
    doc.rect(0, 28, pageWidth, 1.5, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Medi-Care", margin, 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Your Health, Our Priority", margin, 20);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL PRESCRIPTION", pageWidth - margin, 12, {
      align: "right",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Ref: ${prescription.id.slice(0, 8).toUpperCase()}`,
      pageWidth - margin,
      19,
      { align: "right" },
    );

    y = 38;

    // ══════════════════════════════════════════════════════════
    // DOCTOR + PATIENT META (single row style)
    // ══════════════════════════════════════════════════════════
    doc.setFillColor(245, 248, 252);
    doc.roundedRect(margin, y, contentWidth, 28, 2, 2, "F");

    // Doctor
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("PRESCRIBED BY", margin + 4, y + 6);

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(prescription.doctor?.name || "Unknown Doctor", margin + 4, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    let doctorMeta = "";
    if (prescription.doctor?.designation)
      doctorMeta += prescription.doctor.designation;
    if (prescription.doctor?.email)
      doctorMeta += (doctorMeta ? "  ·  " : "") + prescription.doctor.email;
    doc.text(doctorMeta || "—", margin + 4, y + 19);

    // Dates on the right side of the meta box
    const metaRightX = pageWidth - margin - 4;
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("PRESCRIBED ON", metaRightX, y + 6, { align: "right" });

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      format(new Date(prescription.createdAt), "MMM d, yyyy"),
      metaRightX,
      y + 13,
      { align: "right" },
    );

    if (prescription.followUpDate) {
      doc.setTextColor(15, 76, 129);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(
        `Follow-up: ${format(new Date(prescription.followUpDate), "MMM d, yyyy")}`,
        metaRightX,
        y + 20,
        { align: "right" },
      );
    }

    y += 36;

    // ══════════════════════════════════════════════════════════
    // TWO-COLUMN BODY
    // Left  → Health Issue + Recommended Tests
    // Right → Instructions (Medicines / Advice)
    // ══════════════════════════════════════════════════════════

    const colStartY = y;
    let leftY = y;
    let rightY = y;

    // ── LEFT COLUMN ─────────────────────────────────────────

    // Health Issue
    doc.setFillColor(15, 76, 129);
    doc.roundedRect(leftX, leftY, leftColWidth, 6, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("HEALTH ISSUE", leftX + 3, leftY + 4.2);
    leftY += 9;

    const healthIssue =
      prescription.healthIssue?.trim() || "No health issue recorded.";
    const healthLines = doc.splitTextToSize(healthIssue, leftColWidth - 4);
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(healthLines, leftX + 2, leftY);
    leftY += healthLines.length * 4.2 + 8;

    // Recommended Tests
    doc.setFillColor(15, 76, 129);
    doc.roundedRect(leftX, leftY, leftColWidth, 6, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("RECOMMENDED TESTS", leftX + 3, leftY + 4.2);
    leftY += 9;

    if (prescription.givenTest?.trim()) {
      const testLines = doc.splitTextToSize(
        prescription.givenTest.trim(),
        leftColWidth - 4,
      );
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(testLines, leftX + 2, leftY);
      leftY += testLines.length * 4.2 + 4;
    } else {
      doc.setTextColor(140, 140, 140);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("None prescribed", leftX + 2, leftY);
      leftY += 8;
    }

    // ── RIGHT COLUMN ────────────────────────────────────────

    // Parse instructions
    const raw = prescription.instructions || "No instructions provided.";
    let medicinesText = "";
    let adviceText = "";

    const medicinesMatch = raw.match(/Medicines?\s*([\s\S]*?)(?=Advice|$)/i);
    const adviceMatch = raw.match(/Advice\s*([\s\S]*)/i);

    if (medicinesMatch) medicinesText = medicinesMatch[1].trim();
    if (adviceMatch) adviceText = adviceMatch[1].trim();
    const hasStructure = !!(medicinesText || adviceText);

    // Medicines
    if (hasStructure && medicinesText) {
      doc.setFillColor(15, 76, 129);
      doc.roundedRect(rightX, rightY, rightColWidth, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("MEDICINES", rightX + 3, rightY + 4.2);
      rightY += 9;

      const medicineItems = medicinesText
        .split(/(?<=\.)\s+(?=[A-Z])/)
        .map((item) => item.trim())
        .filter(Boolean);

      medicineItems.forEach((item, idx) => {
        const parts = item.split(/\s*[—–-]\s*/);
        const name = parts[0]?.trim() || item;
        const dosage = parts.slice(1).join(" — ").trim();

        // Light alternating background
        if (idx % 2 === 0) {
          doc.setFillColor(245, 248, 252);
          const nameH = 4.5;
          const dosageH = dosage
            ? doc.splitTextToSize(dosage, rightColWidth - 10).length * 3.8
            : 0;
          doc.roundedRect(
            rightX,
            rightY - 2.5,
            rightColWidth,
            nameH + dosageH + 3,
            1,
            1,
            "F",
          );
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(20, 20, 20);
        doc.text(`${idx + 1}.  ${name}`, rightX + 2, rightY);
        rightY += 4.5;

        if (dosage) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(80, 80, 80);
          const dosageLines = doc.splitTextToSize(dosage, rightColWidth - 10);
          doc.text(dosageLines, rightX + 7, rightY);
          rightY += dosageLines.length * 3.8 + 2;
        } else {
          rightY += 1.5;
        }
      });

      rightY += 5;
    }

    // Advice
    if (hasStructure && adviceText) {
      doc.setFillColor(15, 76, 129);
      doc.roundedRect(rightX, rightY, rightColWidth, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("ADVICE", rightX + 3, rightY + 4.2);
      rightY += 9;

      const adviceItems = adviceText
        .split(/(?<=\.)\s+/)
        .map((item) => item.trim())
        .filter(Boolean);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);

      adviceItems.forEach((item) => {
        const lines = doc.splitTextToSize(`•  ${item}`, rightColWidth - 4);
        doc.text(lines, rightX + 2, rightY);
        rightY += lines.length * 4.2 + 2;
      });

      rightY += 3;
    }

    // Fallback – unstructured
    if (!hasStructure) {
      doc.setFillColor(15, 76, 129);
      doc.roundedRect(rightX, rightY, rightColWidth, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("INSTRUCTIONS", rightX + 3, rightY + 4.2);
      rightY += 9;

      const splitText = doc.splitTextToSize(raw, rightColWidth - 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text(splitText, rightX + 2, rightY);
      rightY += splitText.length * 4.2 + 4;
    }

    // Vertical divider between columns
    const colEndY = Math.max(leftY, rightY);
    doc.setDrawColor(210, 215, 220);
    doc.setLineWidth(0.3);
    doc.line(
      margin + leftColWidth + colGap / 2,
      colStartY,
      margin + leftColWidth + colGap / 2,
      colEndY,
    );

    y = colEndY + 10;

    // ══════════════════════════════════════════════════════════
    // APPOINTMENT DATE (if available)
    // ══════════════════════════════════════════════════════════
    if (prescription.appointment?.schedule?.startDateTime) {
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        `Appointment date: ${format(
          new Date(prescription.appointment.schedule.startDateTime),
          "EEEE, MMMM d, yyyy",
        )}`,
        margin,
        y,
      );
      y += 8;
    }

    // ══════════════════════════════════════════════════════════
    // FOOTER
    // ══════════════════════════════════════════════════════════
    const footerY = pageHeight - 22;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.4);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);

    doc.text(
      "This is a computer-generated prescription from Medi-Care. No signature required.",
      pageWidth / 2,
      footerY + 5,
      { align: "center" },
    );
    doc.text(
      "Please consult your doctor for any questions or concerns regarding this prescription.",
      pageWidth / 2,
      footerY + 10,
      { align: "center" },
    );
    doc.text(
      `Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`,
      pageWidth / 2,
      footerY + 15,
      { align: "center" },
    );

    // Save
    const fileName = `MediCare-Prescription-${prescription.id.slice(0, 8)}-${format(
      new Date(prescription.createdAt),
      "yyyy-MM-dd",
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
          {/* Header – Doctor */}
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
            {/* Two-column layout */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* LEFT */}
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    Health Issue
                  </div>
                  <div className="rounded-lg border bg-muted/50 px-3 py-2.5">
                    <p className="line-clamp-3 text-sm leading-relaxed">
                      {prescription.healthIssue || "Not recorded"}
                    </p>
                  </div>
                </div>

                {prescription.givenTest ? (
                  <div>
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <TestTube2 className="h-3.5 w-3.5" />
                      Recommended Tests
                    </div>
                    <div className="rounded-lg border bg-muted/50 px-3 py-2.5">
                      <p className="line-clamp-3 text-sm leading-relaxed">
                        {prescription.givenTest}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <TestTube2 className="h-3.5 w-3.5" />
                      Recommended Tests
                    </div>
                    <div className="rounded-lg border border-dashed bg-muted/30 px-3 py-2.5">
                      <p className="text-sm italic text-muted-foreground">
                        None prescribed
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Instructions
                </div>
                <div className="h-full min-h-[100px] rounded-lg border bg-muted/50 px-3 py-2.5">
                  <p className="line-clamp-6 text-sm leading-relaxed text-muted-foreground">
                    {prescription.instructions || "No instructions provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-wrap items-center gap-2">
              {prescription.appointment?.schedule?.startDateTime && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(
                    new Date(prescription.appointment.schedule.startDateTime),
                    "MMM d, yyyy",
                  )}
                </div>
              )}

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
            </div>
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

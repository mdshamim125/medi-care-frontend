"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IPatientAppointment } from "@/types/patient.interface";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Minus,
} from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 5;

function statusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "SCHEDULED":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "CANCELED":
    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DoctorPatientAppointmentHistory({
  appointments,
}: {
  appointments: IPatientAppointment[];
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(appointments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageAppointments = appointments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const firstAppointment = appointments.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0;
  const lastAppointment = Math.min(
    currentPage * PAGE_SIZE,
    appointments.length,
  );

  return (
    <>
      <div className="space-y-3 border-t border-slate-100 p-4 lg:hidden">
        {pageAppointments.map((appointment) => (
          <article
            key={appointment.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Appointment date
                </p>
                <p className="mt-1 break-words text-sm font-medium text-slate-800">
                  {appointment.schedule?.startDateTime
                    ? format(
                        new Date(appointment.schedule.startDateTime),
                        "MMM d, yyyy · h:mm a",
                      )
                    : "Date unavailable"}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`shrink-0 whitespace-nowrap ${statusStyle(appointment.status)}`}
              >
                {formatStatus(appointment.status)}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <span className="text-xs font-medium text-slate-500">
                Prescription
              </span>
              {appointment.prescription ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                  <FileCheck2 className="h-4 w-4" />
                  Provided
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                  <Minus className="h-4 w-4" />
                  Not provided
                </span>
              )}
            </div>
          </article>
        ))}
        {appointments.length === 0 && (
          <p className="py-2 text-sm text-slate-500">
            No appointment history available.
          </p>
        )}
      </div>

      <div className="hidden overflow-x-auto border-t border-slate-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block">
        <table className="w-full min-w-[580px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Prescription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="transition-colors hover:bg-slate-50/70"
              >
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                  {appointment.schedule?.startDateTime
                    ? format(
                        new Date(appointment.schedule.startDateTime),
                        "MMM d, yyyy · h:mm a",
                      )
                    : "Date unavailable"}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant="outline"
                    className={`whitespace-nowrap ${statusStyle(appointment.status)}`}
                  >
                    {formatStatus(appointment.status)}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {appointment.prescription ? (
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                      <FileCheck2 className="h-4 w-4" />
                      Provided
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <Minus className="h-4 w-4" />
                      Not provided
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <p className="p-5 text-sm text-slate-500">
            No appointment history available.
          </p>
        )}
      </div>

      {appointments.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {firstAppointment}–{lastAppointment}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {appointments.length}
            </span>{" "}
            appointments
          </p>
          {totalPages > 1 && (
            <nav
              aria-label="Appointment history pages"
              className="flex items-center gap-2"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage <= 1}
                aria-label="Previous appointment page"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <span className="px-2 text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
                disabled={currentPage >= totalPages}
                aria-label="Next appointment page"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </nav>
          )}
        </div>
      )}
    </>
  );
}

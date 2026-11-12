"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPatient } from "@/types/patient.interface";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { doctorPatientColumns } from "./doctorPatientColumns";

interface DoctorPatientsTableProps {
  patients: IPatient[];
}

export default function DoctorPatientsTable({ patients }: DoctorPatientsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [recordStatus, setRecordStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedContact = contact.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        !normalizedSearch ||
        [patient.name, patient.email, patient.contactNumber]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesEmail =
        !normalizedEmail || patient.email.toLowerCase().includes(normalizedEmail);
      const matchesContact =
        !normalizedContact ||
        patient.contactNumber.toLowerCase().includes(normalizedContact);
      const matchesRecordStatus =
        recordStatus === "all" ||
        (recordStatus === "complete" && Boolean(patient.patientHealthData)) ||
        (recordStatus === "missing" && !patient.patientHealthData);

      return (
        matchesSearch &&
        matchesEmail &&
        matchesContact &&
        matchesRecordStatus
      );
    });
  }, [contact, email, patients, recordStatus, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPatients.length / Number(pageSize)),
  );
  const currentPage = Math.min(page, totalPages);
  const pagePatients = filteredPatients.slice(
    (currentPage - 1) * Number(pageSize),
    currentPage * Number(pageSize),
  );
  const hasFilters =
    Boolean(search || email || contact) || recordStatus !== "all";
  const firstItem = filteredPatients.length
    ? (currentPage - 1) * Number(pageSize) + 1
    : 0;
  const lastItem = Math.min(currentPage * Number(pageSize), filteredPatients.length);

  const clearFilters = () => {
    setSearch("");
    setEmail("");
    setContact("");
    setRecordStatus("all");
    setPage(1);
  };

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50/40 px-5 py-4 sm:px-6">
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Filter patients
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Find appointed patients by name, email, contact, or record status.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Search patients"
                placeholder="Search patients..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-10 border-slate-200 bg-white pl-9"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 shrink-0 border-slate-200 bg-white"
              disabled={isPending}
              onClick={() =>
                startTransition(() => {
                  router.refresh();
                })
              }
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <div className="relative min-w-[180px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Filter by email"
                placeholder="Email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setPage(1);
                }}
                className="h-10 border-slate-200 bg-white pl-9"
              />
            </div>
            <div className="relative min-w-[180px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Filter by contact number"
                placeholder="Contact"
                value={contact}
                onChange={(event) => {
                  setContact(event.target.value);
                  setPage(1);
                }}
                className="h-10 border-slate-200 bg-white pl-9"
              />
            </div>
            <Select
              value={recordStatus}
              onValueChange={(value) => {
                setRecordStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                aria-label="Filter by health record status"
                className="h-10 w-full border-slate-200 bg-white sm:w-[190px]"
              >
                <SelectValue placeholder="Health record status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All record statuses</SelectItem>
                <SelectItem value="complete">Record completed</SelectItem>
                <SelectItem value="missing">Record incomplete</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                className="h-10 px-3 text-slate-600"
                onClick={clearFilters}
              >
                <X className="mr-1 h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-0">
        <ManagementTable
          data={pagePatients}
          columns={doctorPatientColumns}
          onView={(patient) =>
            router.push(`/doctor/dashboard/patients/${patient.id}`)
          }
          getRowKey={(patient) => patient.id || patient.email}
          emptyMessage={
            patients.length && hasFilters
              ? "No patients match your filters"
              : "No appointed patients found"
          }
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{firstItem}–{lastItem}</span> of{" "}
          <span className="font-medium text-slate-700">{filteredPatients.length}</span> patients
        </p>
        <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage <= 1}
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
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Select
            value={pageSize}
            onValueChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
          >
            <SelectTrigger
              aria-label="Patients per page"
              className="h-9 w-[76px] border-slate-200"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-slate-500">per page</span>
        </div>
      </div>
    </div>
  );
}

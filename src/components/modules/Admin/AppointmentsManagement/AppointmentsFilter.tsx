"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import RefreshButton from "@/components/shared/RefreshButton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface AppointmentFilters {
  patientEmail: string;
  doctorEmail: string;
  status: string;
  paymentStatus: string;
}

const readFilters = (params: URLSearchParams): AppointmentFilters => ({
  patientEmail: params.get("patientEmail") || "",
  doctorEmail: params.get("doctorEmail") || "",
  status: params.get("status") || "ALL",
  paymentStatus: params.get("paymentStatus") || "ALL",
});

const AppointmentsFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const queryString = searchParams.toString();
  const queryFilters = readFilters(new URLSearchParams(queryString));
  const [draft, setDraft] = useState({
    queryString,
    filters: queryFilters,
  });
  const filters =
    draft.queryString === queryString ? draft.filters : queryFilters;
  const debouncedPatientEmail = useDebounce(filters.patientEmail, 500);
  const debouncedDoctorEmail = useDebounce(filters.doctorEmail, 500);

  useEffect(() => {
    if (
      debouncedPatientEmail !== filters.patientEmail ||
      debouncedDoctorEmail !== filters.doctorEmail
    ) {
      return;
    }

    const params = new URLSearchParams(queryString);
    const filterValues: Record<string, string> = {
      patientEmail: debouncedPatientEmail.trim(),
      doctorEmail: debouncedDoctorEmail.trim(),
      status: filters.status === "ALL" ? "" : filters.status,
      paymentStatus:
        filters.paymentStatus === "ALL" ? "" : filters.paymentStatus,
    };

    let hasFilterChanges = false;
    Object.entries(filterValues).forEach(([key, value]) => {
      if ((params.get(key) || "") === value) {
        return;
      }

      hasFilterChanges = true;
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (!hasFilterChanges) {
      return;
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [
    debouncedDoctorEmail,
    debouncedPatientEmail,
    filters,
    queryString,
    router,
  ]);

  const updateFilter = <K extends keyof AppointmentFilters>(
    key: K,
    value: AppointmentFilters[K],
  ) => {
    setDraft({
      queryString,
      filters: { ...filters, [key]: value },
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patient email..."
            className="pl-10"
            value={filters.patientEmail}
            onChange={(event) =>
              updateFilter("patientEmail", event.target.value)
            }
          />
        </div>
        <RefreshButton />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-full sm:w-[245px]">
            <SelectValue placeholder="Appointment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Appointment Statuses</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="INPROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELED">Canceled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentStatus}
          onValueChange={(value) => updateFilter("paymentStatus", value)}
        >
          <SelectTrigger className="w-full sm:w-[215px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Payment Statuses</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Doctor Email"
            className="pl-10"
            value={filters.doctorEmail}
            onChange={(event) =>
              updateFilter("doctorEmail", event.target.value)
            }
          />
        </div>
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default AppointmentsFilter;

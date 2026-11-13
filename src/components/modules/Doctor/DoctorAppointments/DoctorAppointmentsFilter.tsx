"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";

const DoctorAppointmentsFilter = () => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search patients by name or email..."
          />
        </div>
        <RefreshButton variant="outline" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SelectFilter
          paramName="status"
          placeholder="Appointment status"
          defaultValue="All appointment statuses"
          options={[
            { label: "Scheduled", value: "SCHEDULED" },
            { label: "In progress", value: "INPROGRESS" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Canceled", value: "CANCELED" },
          ]}
        />
        <SelectFilter
          paramName="paymentStatus"
          placeholder="Payment status"
          defaultValue="All payment statuses"
          options={[
            { label: "Paid", value: "PAID" },
            { label: "Unpaid", value: "UNPAID" },
          ]}
        />
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default DoctorAppointmentsFilter;

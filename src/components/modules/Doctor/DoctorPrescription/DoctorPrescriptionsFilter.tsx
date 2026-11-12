"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";

const DoctorPrescriptionsFilter = () => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search patient or health issue..."
          />
        </div>
        <RefreshButton variant="outline" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SelectFilter
          paramName="followUp"
          placeholder="Follow-up"
          defaultValue="All follow-ups"
          options={[
            { label: "Follow-up scheduled", value: "scheduled" },
            { label: "No follow-up", value: "none" },
          ]}
        />
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default DoctorPrescriptionsFilter;

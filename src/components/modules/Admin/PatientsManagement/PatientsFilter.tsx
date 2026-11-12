"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";

const PatientsFilter = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search patients..."
          />
        </div>
        <RefreshButton variant="outline" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[180px] flex-1">
          <SearchFilter paramName="email" placeholder="Email" />
        </div>
        <div className="min-w-[180px] flex-1">
          <SearchFilter paramName="contactNumber" placeholder="Contact" />
        </div>
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default PatientsFilter;
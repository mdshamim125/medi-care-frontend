"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";

const AdminsFilter = () => {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      {/* Row 1: Search and Refresh */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <SearchFilter paramName="searchTerm" placeholder="Search admins..." />
        </div>
        <RefreshButton />
      </div>

      {/* Row 2: Filter Controls */}
      <div className="mt-3 flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center">
        {/* Email Filter */}
        <div className="min-w-0 flex-1">
          <SearchFilter paramName="email" placeholder="Email" />
        </div>

        {/* Contact Number Filter */}
        <div className="min-w-0 flex-1">
          <SearchFilter paramName="contactNumber" placeholder="Contact" />
        </div>

        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default AdminsFilter;

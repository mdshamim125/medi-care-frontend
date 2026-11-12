"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "../ui/input";

interface SearchFilterProps {
  placeholder?: string;
  paramName?: string;
}

const SearchFilter = ({
  placeholder = "Search...",
  paramName = "searchTerm",
}: SearchFilterProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get(paramName) || "";
  const queryString = searchParams.toString();
  const [draft, setDraft] = useState({ searchValue, value: searchValue });
  const value = draft.searchValue === searchValue ? draft.value : searchValue;
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (debouncedValue.trim() !== value.trim()) {
      return;
    }

    const params = new URLSearchParams(queryString);
    const normalizedValue = debouncedValue.trim();
    const currentValue = params.get(paramName) || "";

    if (normalizedValue === currentValue) {
      return;
    }

    if (normalizedValue) {
      params.set(paramName, normalizedValue);
    } else {
      params.delete(paramName);
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [debouncedValue, paramName, queryString, router, value]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => setDraft({ searchValue, value: e.target.value })}
      />
    </div>
  );
};

export default SearchFilter;

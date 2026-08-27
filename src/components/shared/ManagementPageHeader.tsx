"use client";
import { LucideIcon, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface ManagementPageHeaderProps {
  title: string;
  description?: string;
  action?: {
    icon?: LucideIcon;
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

const ManagementPageHeader = ({
  title,
  description,
  action,
  children,
}: ManagementPageHeaderProps) => {
  const Icon = action?.icon || Plus;
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Workspace
        </p>
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && (
        <Button onClick={action.onClick} className="shrink-0 shadow-sm">
          <Icon className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
};

export default ManagementPageHeader;
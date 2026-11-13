"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import { Activity, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import UserDropdown from "./UserDropdown";

interface DashboardNavbarContentProps {
  userInfo: UserInfo;
  navItems?: NavSection[];
  dashboardHome?: string;
}
const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavbarContentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="z-40 shrink-0 border-b bg-background/95 backdrop-blur lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                aria-label="Open dashboard navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 max-w-[calc(100vw-2rem)] p-0"
            >
              <DashboardMobileSidebar
                userInfo={userInfo}
                navItems={navItems || []}
                dashboardHome={dashboardHome || ""}
                onNavigate={() => setIsOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <Link
            href={dashboardHome || "/"}
            className="flex min-w-0 items-center gap-2 font-semibold tracking-tight text-foreground"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-4 w-4" />
            </span>
            <span className="truncate">Medi-Care</span>
          </Link>
        </div>

        <UserDropdown userInfo={userInfo} />
      </div>
    </header>
  );
};

export default DashboardNavbarContent;
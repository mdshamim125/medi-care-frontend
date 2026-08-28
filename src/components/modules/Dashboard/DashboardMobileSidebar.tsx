"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";

interface DashboardMobileSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardMobileSidebar = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardMobileSidebarContentProps) => {
  const pathname = usePathname();
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Link href={dashboardHome}>
          <span className="text-xl font-bold text-primary">Medi Care</span>
        </Link>
      </div>
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-6">
          {navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && (
                <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                  {section.title}
                </h4>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "default"}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
              {sectionIdx < navItems.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Menu at Bottom */}
      <div className="z-10 shrink-0 border-t bg-muted/20 p-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-2.5 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            <span>
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold">{userInfo.name}</p>
            <p className="truncate text-xs capitalize text-muted-foreground">
              {userInfo.role.toLowerCase()}
            </p>
          </div>
          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileSidebar;
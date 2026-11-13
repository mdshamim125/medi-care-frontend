import DashboardNavbarContent from "@/components/modules/Dashboard/DashboardNavbarContent";
import DashboardSidebarContent from "@/components/modules/Dashboard/DashboardSidebarContent";
import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { UserInfo } from "@/types/user.interface";
import React from "react";

export const dynamic = "force-dynamic";

const CommonDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userInfo = (await getUserInfo()) as UserInfo;
  const navItems = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <DashboardSidebarContent
        userInfo={userInfo}
        navItems={navItems}
        dashboardHome={dashboardHome}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardNavbarContent
          userInfo={userInfo}
          navItems={navItems}
          dashboardHome={dashboardHome}
        />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-muted/10 p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default CommonDashboardLayout;

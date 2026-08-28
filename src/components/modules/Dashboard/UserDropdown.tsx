"use client";

import LogoutButton from "@/components/shared/LogoutButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { UserInfo } from "@/types/user.interface";
import {
  Home,
  LayoutDashboard,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserDropdownProps {
  userInfo: UserInfo;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const pathname = usePathname();
  const isDashboardRoute = /^\/(admin|doctor|dashboard)(\/|$)/.test(pathname);
  const dashboardLink = getDefaultDashboardRoute(userInfo.role);

  const getProfilePhoto = (): string | null => {
    let photo: string | File | null | undefined = null;

    if (userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN") {
      photo = userInfo.admin?.profilePhoto;
    } else if (userInfo.role === "DOCTOR") {
      photo = userInfo.doctor?.profilePhoto;
    } else if (userInfo.role === "PATIENT") {
      photo = userInfo.patient?.profilePhoto;
    }

    // Only return a string URL (ignore File objects)
    return typeof photo === "string" ? photo : null;
  };

  const profilePhoto = getProfilePhoto();
  const initials = userInfo.name?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0 overflow-hidden border border-border/60 shadow-sm hover:opacity-90 transition-opacity"
        >
          {profilePhoto ? (
            <Image
              src={profilePhoto}
              alt={userInfo.name || "User"}
              fill
              className="object-cover"
              sizes="36px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
              {initials}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-xl p-0 overflow-hidden"
        sideOffset={8}
      >
        {/* User header */}
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-3 bg-muted/40 px-4 py-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-background shadow-sm">
              {profilePhoto ? (
                <Image
                  src={profilePhoto}
                  alt={userInfo.name || "User"}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-base font-semibold text-primary-foreground">
                  {initials}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold leading-tight">
                {userInfo.name}
              </p>
              <p className="truncate text-xs text-muted-foreground mt-0.5">
                {userInfo.email}
              </p>
              <p className="mt-1 text-[11px] font-medium capitalize text-primary">
                {userInfo.role.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="m-0" />

        <DropdownMenuGroup className="p-1.5">
          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-lg px-3 py-2.5"
          >
            <Link href={isDashboardRoute ? "/" : dashboardLink}>
              {isDashboardRoute ? (
                <Home className="mr-2.5 h-4 w-4 text-muted-foreground" />
              ) : (
                <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
              )}
              {isDashboardRoute ? "Home" : "Dashboard"}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-lg px-3 py-2.5"
          >
            <Link href="/my-profile">
              <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-lg px-3 py-2.5"
          >
            <Link href="/change-password">
              <ShieldCheck className="mr-2.5 h-4 w-4 text-muted-foreground" />
              Change Password
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="m-0" />

        <div className="p-2">
          <LogoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
import { getCookie } from "@/services/auth/tokenHandlers";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { Activity, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import LogoutButton from "./LogoutButton";
import UserDropdown from "../modules/Dashboard/UserDropdown";
import PublicNavLinks from "./PublicNavLinks";

const PublicNavbar = async () => {
  const navItems = [
    { href: "/consultation", label: "Consultation" },
    { href: "#", label: "About Us" },
    { href: "#", label: "Contact Us" },
    { href: "#", label: "Diagnostics" },
    { href: "#", label: "NGOs" },
  ];

  const accessToken = await getCookie("accessToken");
  const userInfo = accessToken ? await getUserInfo() : null;

  const getProfilePhoto = () => {
    if (!userInfo) return null;
    if (userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN") {
      return userInfo.admin?.profilePhoto ?? null;
    }
    if (userInfo.role === "DOCTOR") {
      return userInfo.doctor?.profilePhoto ?? null;
    }
    if (userInfo.role === "PATIENT") {
      return userInfo.patient?.profilePhoto ?? null;
    }
    return null;
  };

  const profilePhoto = getProfilePhoto();
  const initials = userInfo?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Medi-Care
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <PublicNavLinks items={navItems} />
        </nav>

        {/* Desktop Account */}
        <div className="hidden items-center gap-3 md:flex">
          {userInfo ? (
            <UserDropdown userInfo={userInfo} />
          ) : (
            <Link href="/login">
              <Button size="sm" className="rounded-lg px-5 font-medium shadow-sm">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] p-0 sm:w-[340px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="flex h-full flex-col">
                {/* Mobile Header */}
                <div className="flex h-16 items-center border-b px-5">
                  <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                      <Activity className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                      Medi-Care
                    </span>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
                  <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Navigation
                  </p>

                  <PublicNavLinks items={navItems} mobile />
                </nav>

                {/* Mobile Account */}
                <div className="border-t bg-muted/30 p-4">
                  {userInfo ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/60">
                          {profilePhoto ? (
                            <Image
                              src={profilePhoto}
                              alt={userInfo.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
                              {initials}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold leading-tight">
                            {userInfo.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground mt-0.5">
                            {userInfo.email}
                          </p>
                          <p className="mt-0.5 text-[11px] font-medium capitalize text-primary">
                            {userInfo.role.toLowerCase().replace("_", " ")}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Link href="/my-profile">
                          <Button
                            variant="outline"
                            className="w-full justify-start rounded-lg"
                          >
                            My Profile
                          </Button>
                        </Link>

                        <Link href="/change-password">
                          <Button
                            variant="outline"
                            className="w-full justify-start rounded-lg"
                          >
                            Change Password
                          </Button>
                        </Link>

                        <LogoutButton />
                      </div>
                    </div>
                  ) : (
                    <Link href="/login" className="block">
                      <Button className="w-full rounded-lg font-medium">
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
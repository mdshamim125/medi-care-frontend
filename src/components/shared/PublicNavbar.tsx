import { getCookie } from "@/services/auth/tokenHandlers";
import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import LogoutButton from "./LogoutButton";

// Replace this with your actual user-info service
import { getUserInfo } from "@/services/auth/getUserInfo";
import UserDropdown from "../modules/Dashboard/UserDropdown";

const PublicNavbar = async () => {
  const navItems = [
    { href: "/consultation", label: "Consultation" },
    { href: "#", label: "Health Plans" },
    { href: "#", label: "Medicine" },
    { href: "#", label: "Diagnostics" },
    { href: "#", label: "NGOs" },
  ];

  const accessToken = await getCookie("accessToken");

  // Fetch authenticated user information
  const userInfo = accessToken ? await getUserInfo() : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* =====================================================
            LOGO
        ====================================================== */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            M
          </div>

          <span className="text-xl font-bold tracking-tight text-primary">
            MediCare
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* =====================================================
            DESKTOP ACCOUNT AREA
        ====================================================== */}
        <div className="hidden items-center md:flex">
          {userInfo ? (
            <UserDropdown userInfo={userInfo} />
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                className="rounded-lg px-5 font-semibold shadow-sm"
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}
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

            <SheetContent
              side="right"
              className="w-[300px] p-0 sm:w-[380px]"
            >
              {/* Accessibility title */}
              <SheetTitle className="sr-only">
                Navigation Menu
              </SheetTitle>

              <div className="flex h-full flex-col">
                {/* -------------------------------------------------
                    MOBILE HEADER
                -------------------------------------------------- */}
                <div className="flex h-16 items-center border-b px-5">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                      M
                    </div>

                    <span className="text-lg font-bold text-primary">
                      MediCare
                    </span>
                  </Link>
                </div>

                {/* -------------------------------------------------
                    MOBILE NAVIGATION
                -------------------------------------------------- */}
                <nav className="flex-1 space-y-1 px-4 py-6">
                  <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Navigation
                  </p>

                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* -------------------------------------------------
                    MOBILE ACCOUNT
                -------------------------------------------------- */}
                <div className="border-t bg-muted/20 p-4">
                  {userInfo ? (
                    <div className="space-y-3">
                      {/* User information */}
                      <div className="flex items-center gap-3 rounded-xl border bg-background p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {userInfo.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {userInfo.name}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {userInfo.email}
                          </p>

                          <p className="mt-0.5 text-xs font-medium capitalize text-primary">
                            {userInfo.role.toLowerCase()}
                          </p>
                        </div>
                      </div>

                      {/* Profile */}
                      <Link href="/my-profile">
                        <Button
                          variant="outline"
                          className="w-full justify-start rounded-lg"
                        >
                          My Profile
                        </Button>
                      </Link>

                      {/* Change password */}
                      <Link href="/change-password">
                        <Button
                          variant="outline"
                          className="w-full justify-start rounded-lg"
                        >
                          Change Password
                        </Button>
                      </Link>

                      {/* Logout */}
                      <LogoutButton />
                    </div>
                  ) : (
                    <Link href="/login" className="block">
                      <Button className="w-full rounded-lg font-semibold">
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


import { getCookie } from "@/services/auth/tokenHandlers";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { Activity, ArrowRight, Menu } from "lucide-react";
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
    { href: "/", label: "Home" },
    { href: "/consultation", label: "Consultation" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/faq", label: "FAQs" },
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
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.5)] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-7 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-85"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 ring-1 ring-primary/10 transition-transform group-hover:scale-[1.03]">
            <Activity className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <span className="flex flex-col">
            <span className="text-[17px] font-bold leading-tight tracking-tight text-foreground">
              Medi-Care
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-muted-foreground">
              Care that connects
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-2xl border border-border/60 bg-card/75 p-1.5 shadow-sm lg:flex"
        >
          <PublicNavLinks items={navItems} />
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {userInfo ? (
            <>
              <div className="hidden text-right xl:block">
                <p className="max-w-36 truncate text-sm font-semibold leading-tight text-foreground">
                  {userInfo.name}
                </p>
                <p className="mt-1 text-[11px] font-medium capitalize leading-tight text-muted-foreground">
                  {userInfo.role.toLowerCase().replace("_", " ")}
                </p>
              </div>
              <UserDropdown userInfo={userInfo} />
            </>
          ) : (
            <Link href="/login" className="inline-flex">
              <Button className="h-11 gap-2 rounded-xl px-5 font-semibold shadow-md shadow-primary/15 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl border border-border/70 bg-card shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[min(88vw,360px)] border-l border-border/70 bg-background p-0 shadow-2xl"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="flex h-full flex-col">
                <div className="flex h-[76px] items-center border-b border-border/70 px-5">
                  <Link href="/" className="group flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <Activity className="h-[18px] w-[18px]" />
                    </div>
                    <span className="flex flex-col">
                      <span className="text-base font-bold tracking-tight">
                        Medi-Care
                      </span>
                      <span className="mt-1 text-[10px] font-semibold uppercase leading-none tracking-[0.15em] text-muted-foreground">
                        Care that connects
                      </span>
                    </span>
                  </Link>
                </div>

                <nav
                  aria-label="Mobile navigation"
                  className="flex-1 space-y-1 overflow-y-auto px-4 py-6"
                >
                  <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Navigation
                  </p>

                  <PublicNavLinks items={navItems} mobile />
                </nav>

                <div className="border-t border-border/70 bg-muted/30 p-5">
                  {userInfo ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-sm">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border/60">
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
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {userInfo.email}
                          </p>
                          <p className="mt-1 text-[10px] font-semibold capitalize tracking-wide text-primary">
                            {userInfo.role.toLowerCase().replace("_", " ")}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Link href="/my-profile">
                          <Button
                            variant="outline"
                            className="h-10 w-full justify-start rounded-xl"
                          >
                            My Profile
                          </Button>
                        </Link>

                        <Link href="/change-password">
                          <Button
                            variant="outline"
                            className="h-10 w-full justify-start rounded-xl"
                          >
                            Change Password
                          </Button>
                        </Link>

                        <LogoutButton />
                      </div>
                    </div>
                  ) : (
                    <Link href="/login" className="block">
                      <Button className="h-11 w-full justify-between rounded-xl px-4 font-semibold">
                        Sign in
                        <ArrowRight className="h-4 w-4" />
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
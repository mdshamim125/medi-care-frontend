"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

interface PublicNavLinksProps {
  items: NavItem[];
  mobile?: boolean;
}

const PublicNavLinks = ({ items, mobile = false }: PublicNavLinksProps) => {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive =
          item.href !== "#" &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`));

        if (mobile) {
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center justify-between rounded-xl px-3.5 text-sm font-semibold transition-all",
                isActive
                  ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
};

export default PublicNavLinks;
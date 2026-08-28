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
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-accent",
              )}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {item.label}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-[1.15rem] h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </>
  );
};

export default PublicNavLinks;
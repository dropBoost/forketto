'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ToggleDarkMode } from "../ui/toggle-dark-mode";

export default function BreadcrumbManager() {
  
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  return (
    <header className="flex flex-row justify-between h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 bg-primary text-neutral-100! md:rounded-t-2xl">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />

        <Breadcrumb>
          <BreadcrumbList className="text-neutral-100! dark:text-neutral-100">
            {segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/");

              const isLast = index === segments.length - 1;

              const label = segment
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

              return (
                <div key={href} className="flex items-center">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>
                        {label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>
                          {label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>

                  {!isLast && (
                    <BreadcrumbSeparator />
                  )}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center">
        <ToggleDarkMode />
      </div>
    </header>
  );
}
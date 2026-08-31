"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type TPath = {
  pageName: string;
  url: string;
};

export function SiteHeader({ page, path }: { page: string; path?: TPath[] }) {
  const rootPath = { pageName: "Dashboard", url: "/admin" };
  path = path ? [rootPath, ...path] : [rootPath];

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex justify-between w-full px-4 lg:px-6">
        <div className="flex w-full  items-center gap-1  lg:gap-2  ">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {path.map((p, i) => (
                <BreadcrumbItem key={i}>
                  <BreadcrumbLink asChild>
                    <Link href={p.url}>{p.pageName}</Link>
                  </BreadcrumbLink>
                  {i < path.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{page}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <UserNav />
      </div>
    </header>
  );
}

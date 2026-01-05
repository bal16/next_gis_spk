"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex justify-between w-full px-4 lg:px-6">
        <div className="flex w-full  items-center gap-1  lg:gap-2  ">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link
              href="/admin"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="font-medium text-foreground">{name}</span>
          </nav>
        </div>
        <UserNav />
      </div>
    </header>
  );
}

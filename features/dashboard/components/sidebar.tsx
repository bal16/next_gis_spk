"use client";

import { type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BuildingIcon,
  LayoutDashboardIcon,
  SquareFunctionIcon,
  WeightIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarHeader,
  // SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  menu: [
    {
      title: "Overview",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Buildings",
      url: "/admin/buildings",
      icon: BuildingIcon,
    },
    {
      title: "Criteria and Weights",
      url: "/admin/weights",
      icon: WeightIcon,
    },
    {
      title: "Saw Calculation",
      url: "/admin/dss",
      icon: SquareFunctionIcon,
    },
  ],
};

const tourMap: Record<string, string> = {
  "/admin": "nav-overview",
  "/admin/buildings": "nav-buildings",
  "/admin/weights": "nav-weights",
  "/admin/dss": "nav-dss",
};

export function AdminSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" data-tour="admin-sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <Logo /> */}
            <Link href="/">
              <div className="border-b  pb-5">
                <h1 className="text-lg md:text-xl font-bold">
                  SPK Prioritas Perawatan Gedung
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Fakultas Teknik UNNES
                </p>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.menu.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      data-tour={tourMap[item.url]}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* <NavUser /> */}</SidebarFooter>
    </Sidebar>
  );
}

"use client";

import { type ComponentProps } from "react";
import Link from "next/link";
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
      url: "/admin/criterias",
      icon: WeightIcon,
    },
    {
      title: "Saw Calculation",
      url: "/admin/saw",
      icon: SquareFunctionIcon,
    },
  ],
};

export function AdminSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
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
              {data.menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {/* {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )} */}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* <NavUser /> */}</SidebarFooter>
    </Sidebar>
  );
}

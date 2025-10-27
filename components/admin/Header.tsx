"use client";

import { Menu } from "lucide-react";

import { ModeToggle } from "@/components/ModeToggle";
import { UserNav } from "@/components/UserNav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export const AdminHeader = () => {
  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between p-4">
        <SidebarTrigger>
          <Button size="icon" variant="outline">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
};

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { SidebarTrigger } from "../ui/sidebar";

export const AdminHeader = () => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between p-4">
        <SidebarTrigger >
          <Button size="icon" variant="outline">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/auth")}
          >
            <LogIn className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

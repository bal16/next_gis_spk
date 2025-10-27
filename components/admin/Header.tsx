"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Menu } from "lucide-react";

import { logoutAction } from "@/app/actions/auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { ModeToggle } from "@/components/ModeToggle";
import { UserNav } from "@/components/UserNav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminHeader = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user, isLoading: isUserLoading, isAuthenticated } = useCurrentUser();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

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
          {isUserLoading ? (
            <Skeleton className="h-12 w-12 rounded-full" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full bg-background shadow-lg"
                >
                  <Avatar>
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
                  <UserNav />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              onClick={() => router.push("/auth")}
              className="shadow-lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

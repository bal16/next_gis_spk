"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogIn, LogOut, Map } from "lucide-react";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { logoutAction } from "@/features/auth/actions/logoutAction";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/ModeToggle";

const LINK = {
  admin: {
    href: "/admin",
    icon: <LayoutDashboard className="size-4" />,
    label: "Admin",
    dropdownLabel: "Dashboard Admin",
  },
  home: {
    href: "/",
    icon: <Map className="size-4" />,
    label: "Homepage",
    dropdownLabel: "Homepage",
  },
};

function getInitials(name?: string, email?: string): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return trimmed.charAt(0).toUpperCase();
  }
  if (email?.trim()) {
    return email.trim().charAt(0).toUpperCase();
  }
  return "U";
}

export function UserNav({ adminLink = false }: { adminLink?: boolean }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isUserLoading } = useCurrentUser();

  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction();
      } finally {
        // Ensure cache is cleared after server cookies are removed even if logoutAction redirects
        queryClient.removeQueries({ queryKey: ["currentUser"] });
      }
    });
  };

  const handleLogin = () => {
    router.push("/auth");
  };

  if (isUserLoading) {
    return <Skeleton className="size-9 rounded-full" />;
  }

  if (isAuthenticated && user) {
    const initials = getInitials(user.name, user.email);
    const showAdminLink = adminLink && Boolean(user.isAdmin);
    const showHomeLink = !adminLink;
    const showDropdownNav = showAdminLink || showHomeLink;

    return (
      <nav className="flex items-center gap-2.5">
        {showAdminLink ? (
          <NavLink
            href={LINK.admin.href}
            icon={LINK.admin.icon}
            label={LINK.admin.label}
          />
        ) : showHomeLink ? (
          <NavLink
            href={LINK.home.href}
            icon={LINK.home.icon}
            label={LINK.home.label}
          />
        ) : null}

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu pengguna"
              className="ring-border/50 relative size-9 cursor-pointer rounded-full p-0 shadow-lg ring-1"
            >
              <Avatar className="size-9">
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.name || "User avatar"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="z-50 w-60 p-1.5">
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-9 shrink-0">
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={user.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm leading-none font-semibold">
                      {user.name || "Pengguna"}
                    </p>
                    {user.isAdmin && (
                      <Badge
                        variant="secondary"
                        className="px-1.5 py-0 text-[10px] leading-4"
                      >
                        Admin
                      </Badge>
                    )}
                  </div>
                  {user.email && (
                    <p className="text-muted-foreground truncate text-xs leading-none">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>

            {showDropdownNav && (
              <>
                <DropdownMenuSeparator />
                {showAdminLink ? (
                  <DropdownMenuLink
                    href={LINK.admin.href}
                    icon={LINK.admin.icon}
                    label={LINK.admin.dropdownLabel}
                  />
                ) : (
                  <DropdownMenuLink
                    href={LINK.home.href}
                    icon={LINK.home.icon}
                    label={LINK.home.dropdownLabel}
                  />
                )}
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              disabled={isPending}
              className="cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>{isPending ? "Logging out..." : "Logout"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <ModeToggle />
      <LoginButton handleLogin={handleLogin} />
    </div>
  );
}

type LinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

const NavLink = ({ href, icon, label }: LinkProps) => (
  <Link href={href} className="hidden md:flex">
    <Button
      variant="outline"
      className="bg-background hover:bg-accent shadow-lg"
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

const DropdownMenuLink = ({ href, icon, label }: LinkProps) => {
  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link href={href}>
        {icon}
        <span>{label}</span>
      </Link>
    </DropdownMenuItem>
  );
};

const LoginButton = ({ handleLogin }: { handleLogin: () => void }) => {
  return (
    <Button variant="default" onClick={handleLogin} className="shadow-lg">
      <LogIn className="size-4" />
      <span className="hidden sm:inline">Login</span>
    </Button>
  );
};

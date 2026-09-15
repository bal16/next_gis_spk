"use client";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { Settings, LogOut, LogIn, Map } from "lucide-react";

import { logoutAction } from "@/features/auth/actions/logoutAction";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";
import { useQueryClient } from "@tanstack/react-query";

const LINK = {
  admin: {
    href: "/admin",
    icon: <Settings className="mr-2 h-4 w-4" />,
    label: "Admin",
  },
  home: {
    href: "/",
    icon: <Map className="mr-2 h-4 w-4" />,
    label: "Homepage",
  },
};

export function UserNav({ adminLink = false }: { adminLink?: boolean }) {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: isUserLoading, // Ganti nama agar tidak bentrok
  } = useCurrentUser();

  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  // const isAdmin = user?.role === "admin";
  // console.log({ user });

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction();
      } finally {
        // Blok finally memastikan cache selalu dihapus SETELAH cookie di server lenyap,
        // dan tetap dieksekusi meskipun logoutAction() menghentikan proses dengan redirect().
        queryClient.removeQueries({ queryKey: ["currentUser"] });
      }
    });
  };

  const handleLogin = () => {
    router.push("/auth"); // Ganti ke halaman auth Anda
  };

  if (isUserLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (isAuthenticated) {
    return (
      <nav className="flex items-center gap-3">
        {adminLink ? (
          user!.isAdmin && (
            <NavLink
              href={LINK.admin.href}
              icon={LINK.admin.icon}
              label={LINK.admin.label}
            />
          )
        ) : (
          <NavLink
            href={LINK.home.href}
            icon={LINK.home.icon}
            label={LINK.home.label}
          />
        )}

        <ModeToggle />

        {/* Dropdown User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="bg-primary relative h-10 w-10 rounded-full shadow-lg"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="z-50 w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {adminLink ? (
              user!.isAdmin && (
                <DropdownMenuLink
                  href={LINK.admin.href}
                  icon={LINK.admin.icon}
                  label={LINK.admin.label}
                />
              )
            ) : (
              <DropdownMenuLink
                href={LINK.home.href}
                icon={LINK.home.icon}
                label={LINK.home.label}
              />
            )}

            <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
              {isPending ? (
                "Logging out..."
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    );
  }

  return (
    <div className="flex items-center gap-3">
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
      <span className="hidden sm:inline">{label}</span>
    </Button>
  </Link>
);

const DropdownMenuLink = ({ href, icon, label }: LinkProps) => {
  return (
    <DropdownMenuItem asChild>
      <Link href={href} className="md:hidden">
        {icon}
        <span>{label}</span>
      </Link>
    </DropdownMenuItem>
  );
};

const LoginButton = ({ handleLogin }: { handleLogin: () => void }) => {
  return (
    <Button variant="default" onClick={handleLogin} className="shadow-lg">
      <LogIn className="mr-2 h-4 w-4" />
      <span className="hidden sm:inline">Login</span>
    </Button>
  );
};

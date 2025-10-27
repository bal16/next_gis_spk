'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';

import Link from 'next/link';
import { Settings, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export function UserNav({adminLink = false}:{adminLink?: boolean}) {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    isLoading: isUserLoading // Ganti nama agar tidak bentrok
  } = useCurrentUser();
  
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  const handleLogin = () => {
    router.push('/auth'); // Ganti ke halaman auth Anda
  };


  if (isUserLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }
  
  // Tampilkan tombol Admin DAN Dropdown jika login
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        {/* Tombol Admin (jika user adalah admin) */}
        {adminLink && user?.admin && (
          <Link href="/admin">
            <Button
              variant="outline"
              className="bg-background shadow-lg hover:bg-accent"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
        )}
        
        {/* Dropdown User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full bg-background shadow-lg"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50 w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
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
      </div>
    );
  }

  // Jika tidak loading dan tidak login, tampilkan tombol Login
  return (
    <Button
      variant="default"
      onClick={handleLogin}
      className="shadow-lg"
    >
      <LogIn className="mr-2 h-4 w-4" />
      <span className="hidden sm:inline">Login</span>
    </Button>
  );
}
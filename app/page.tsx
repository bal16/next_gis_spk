"use client";

import { useState, useRef, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, LogOut, Search, Settings } from "lucide-react";
import { Building, PriorityFilter } from "@/types/building";

import { logoutAction } from "@/app/actions/auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useBuildings } from "@/hooks/useBuildings";

import {
  MapView,
  SidebarFilters,
  SidebarHeader,
  SidebarSearch,
  RankingTable,
  type MapViewRef,
} from "@/components/home";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mapRef = useRef<MapViewRef>(null);
  const { user, isLoading: isUserLoading, isAuthenticated } = useCurrentUser();
  const { data: buildings, isLoading, error } = useBuildings();
  const [filter, setFilter] = useState<PriorityFilter>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  const filteredBuildings = useMemo(() => {
    if (!buildings) return [];
    return buildings
      .filter((building) => {
        const matchesFilter =
          filter === "Semua" || building.status_prioritas === filter;
        const matchesSearch =
          building.nama_gedung
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          building.kode_gedung
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => b.skor_akhir - a.skor_akhir);
  }, [buildings, filter, searchQuery]);

  const handleBuildingClick = (building: Building) => {
    mapRef.current?.flyToBuilding(building);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fullscreen Map */}
      <div className="absolute inset-0 z-0">
        <MapView ref={mapRef} buildings={filteredBuildings} />
      </div>

      {/* Mobile Bottom Dock - Hidden on Desktop */}
      <div className="md:hidden">
        <Drawer>
          <DrawerTitle>
            <DrawerTrigger asChild>
              <Button
                variant="default"
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 shadow-2xl px-6"
              >
                <Search className="h-4 w-4 mr-2" />
                Lihat Daftar
              </Button>
            </DrawerTrigger>
          </DrawerTitle>
          <DrawerContent className="max-h-[90vh]">
            <div className="overflow-y-auto">
              <SidebarHeader />
              <SidebarSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <SidebarFilters filter={filter} setFilter={setFilter} />
              <div className="p-4">
                <h2 className="text-sm font-semibold mb-3">Daftar Peringkat</h2>
                <RankingTable
                  buildings={filteredBuildings}
                  onBuildingClick={handleBuildingClick}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Admin & USER Controls - Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <ModeToggle />
        {isAuthenticated && user?.admin && (
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

      {/* Desktop Floating Sidebar - Hidden on Mobile */}
      <div className="absolute top-4 left-4 z-10 w-[380px] max-h-[calc(100vh-2rem)] bg-background rounded-lg shadow-xl overflow-hidden flex-col hidden md:flex">
        <SidebarHeader />
        <div className="flex-1 overflow-y-auto">
          <SidebarSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <SidebarFilters filter={filter} setFilter={setFilter} />
          <div className="p-4">
            <h2 className="text-sm font-semibold mb-3">Daftar Peringkat</h2>
            <RankingTable
              buildings={filteredBuildings}
              onBuildingClick={handleBuildingClick}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

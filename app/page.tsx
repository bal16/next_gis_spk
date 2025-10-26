// import Image from "next/image";
"use client";
import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Building, PriorityFilter } from "@/types/building";
import {
  LogIn,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "@/components/ModeToggle";
import { useBuildings } from "@/hooks/useBuildings";
import { MapView, SidebarContent, type MapViewRef } from "@/components/home";
import { IS_AUTHENTICATED, USER } from "@/lib/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* TODO: ui and refactor
1. UI for authenticate and guest USER ✅
2. Refactor sidebar content -> for mobile compatiblity
*/

export default function Home() {
  // const navigate = useNavigate();
  // const { USER, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const mapRef = useRef<MapViewRef>(null);
  const { data: buildings, isLoading, error } = useBuildings();
  const [filter, setFilter] = useState<PriorityFilter>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [, setIsSidebarOpen] = useState(false);

  // const handleLogout = () => {
  //   // For demonstration, this will now navigate to /auth
  //   router.push("/auth");
  // };

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
          <DrawerTrigger asChild>
            <Button
              variant="default"
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 shadow-2xl px-6"
            >
              <Search className="h-4 w-4 mr-2" />
              Lihat Daftar
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">
            <div className="overflow-y-auto">
              <DrawerTitle className="hidden">Docker</DrawerTitle>
              <SidebarContent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filter={filter}
                setFilter={setFilter}
                isLoading={isLoading}
                error={error}
                filteredBuildings={filteredBuildings}
                handleBuildingClick={handleBuildingClick}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Admin & USER Controls - Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <ModeToggle />
        {IS_AUTHENTICATED && USER.admin && (
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

        {IS_AUTHENTICATED ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full bg-background shadow-lg"
              >
                <Avatar>
                  <AvatarImage src={USER?.avatar} alt={USER?.name} />
                  <AvatarFallback>{USER?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{USER?.name}</p>
                  <p className="text-xs text-muted-foreground">{USER?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {}}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
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
        <SidebarContent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          isLoading={isLoading}
          error={error}
          filteredBuildings={filteredBuildings}
          handleBuildingClick={handleBuildingClick}
        />
      </div>
    </div>
  );
}

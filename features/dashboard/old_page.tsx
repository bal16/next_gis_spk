"use client";
import { useState } from "react";
import type { TBuilding } from "@/types/building";
import {
  AdminMainContent,
  AdminHeader,
  AdminSidebar,
} from "@/components/admin";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

type ActiveSection = "dashboard" | "form" | "settings";

export default function Page() {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("dashboard");
  const [selectedBuilding, setSelectedBuilding] = useState<TBuilding | null>(
    null
  );

  const handleEdit = (building: TBuilding) => {
    setSelectedBuilding(building);
    setActiveSection("form");
  };

  const handleAddNew = () => {
    setSelectedBuilding(null);
    setActiveSection("form");
  };

  const handleSave = () => {
    setActiveSection("dashboard");
  };

  const handleCancelForm = () => {
    setActiveSection("dashboard");
  };

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      </Sidebar>
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
            <AdminMainContent
              activeSection={activeSection}
              selectedBuilding={selectedBuilding}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancelForm}
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

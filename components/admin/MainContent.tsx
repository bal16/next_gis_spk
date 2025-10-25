"use client";

import { Building } from "@/types/building";
import { DashboardSection } from "./DashboardSection";
import { BuildingFormSection } from "./BuildingFormSection";
import { SettingsSection } from "./SettingsSection";

interface AdminMainContentProps {
  activeSection: "dashboard" | "form" | "settings";
  buildings: Building[];
  selectedBuilding: Building | null;
  onAddNew: () => void;
  onEdit: (building: Building) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const AdminMainContent = ({
  activeSection,
  buildings,
  selectedBuilding,
  onAddNew,
  onEdit,
  onSave,
  onCancel,
}: AdminMainContentProps) => {
  switch (activeSection) {
    case "form":
      return <BuildingFormSection 
 selectedBuilding={selectedBuilding} onSave={onSave} onCancel={onCancel} />;
    case "settings":
      return <SettingsSection />;
    default:
      return <DashboardSection buildings={buildings} onAddNew={onAddNew} onEdit={onEdit} />;
  }
};
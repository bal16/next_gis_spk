"use client";

import { SidebarContent } from "./SidebarContent";
import { useFilteredBuildings } from "../hooks/useFIlteredBuildings";

const Sidebar = () => {
  const { filteredBuildings, handleBuildingClick } = useFilteredBuildings();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SidebarContent
        buildings={filteredBuildings}
        onBuildingSelect={handleBuildingClick}
      />
    </div>
  );
};

export default Sidebar;

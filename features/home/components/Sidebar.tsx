"use client";

import { SidebarContent } from "./SidebarContent";
import { useFilteredBuildings } from "../hooks/useFIlteredBuildings";

const Sidebar = () => {
  const { filteredBuildings, handleBuildingClick } = useFilteredBuildings();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <SidebarContent
        buildings={filteredBuildings}
        onBuildingSelect={handleBuildingClick}
      />
    </div>
  );
};

export default Sidebar;

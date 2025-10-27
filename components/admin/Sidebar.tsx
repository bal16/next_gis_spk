"use client";

import Link from "next/link";
import { LayoutDashboard, Settings, Map } from "lucide-react";

type ActiveSection = "dashboard" | "form" | "settings";

interface AdminSidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

const NavButton = ({
  section,
  activeSection,
  onClick,
  icon,
  label,
}: {
  section: ActiveSection;
  activeSection: ActiveSection;
  onClick: (section: ActiveSection) => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={() => onClick(section)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
      activeSection === section
        ? "bg-primary text-primary-foreground font-semibold"
        : "hover:bg-muted text-foreground"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export const AdminSidebar = ({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) => {

  return (
    <>
      <div className="p-6 border-b">
        <Link
          href="/"
          className="flex items-center gap-2 hover:text-primary transition-colors font-bold text-lg"
        >
          <Map className="h-6 w-6" />
          <span>SPK Gedung</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <NavButton
            section="dashboard"
            activeSection={activeSection}
            onClick={onSectionChange}
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Manajemen Gedung"
          />
          <NavButton
            section="settings"
            activeSection={activeSection}
            onClick={onSectionChange}
            icon={<Settings className="h-5 w-5" />}
            label="Pengaturan SPK"
          />
        </div>
      </nav>
    </>
  );
};

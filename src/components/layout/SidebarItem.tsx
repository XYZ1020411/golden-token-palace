
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  collapsed: boolean;
  hovered: boolean;
  isActive: boolean;
  onClick: () => void;
}

export const SidebarItem = ({ 
  icon: Icon, 
  label, 
  path, 
  collapsed, 
  hovered, 
  isActive, 
  onClick 
}: SidebarItemProps) => {
  return (
    <Button 
      variant={isActive ? "secondary" : "ghost"} 
      className={`w-full justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {(!collapsed || hovered) && <span className="ml-2">{label}</span>}
    </Button>
  );
};

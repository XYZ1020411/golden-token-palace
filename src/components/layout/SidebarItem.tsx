
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  collapsed: boolean;
  hovered: boolean;
}

export const SidebarItem = ({ to, icon, label, collapsed, hovered }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Button 
      variant={isActive ? "secondary" : "ghost"} 
      className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
      asChild
    >
      <Link to={to}>
        {icon}
        {(!collapsed || hovered) && <span className="ml-2">{label}</span>}
      </Link>
    </Button>
  );
};

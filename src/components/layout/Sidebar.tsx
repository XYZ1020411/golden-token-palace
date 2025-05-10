
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "./SidebarNav";

export const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (!isAuthenticated) return null;
  
  return (
    <aside 
      className={`border-r bg-background transition-all duration-300 ${collapsed ? 'w-12' : 'w-64'} min-h-screen relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`pt-4 ${collapsed && !hovered ? 'px-2' : 'px-6'} space-y-4`}>
        <SidebarNav collapsed={collapsed} hovered={hovered} />
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 right-2" 
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </aside>
  );
};

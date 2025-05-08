import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  LayoutDashboard,
  PartyPopper,
  Target,
  Home,
  Newspaper,
  Wallet,
  User,
  Gift,
  Inbox as InboxIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <aside 
      className={`border-r bg-background transition-all duration-300 ${collapsed ? 'w-12' : 'w-64'} min-h-screen`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`pt-4 ${collapsed && !hovered ? 'px-2' : 'px-6'} space-y-4`}>
        <nav className="flex flex-col space-y-1">
          <Button 
            variant={location.pathname === "/dashboard" ? "secondary" : "ghost"} 
            className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
            asChild
          >
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              {(!collapsed || hovered) && "儀表板"}
            </Link>
          </Button>
          
          <Button 
            variant={location.pathname === "/profile" ? "secondary" : "ghost"} 
            className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
            asChild
          >
            <Link to="/profile">
              <User className="h-4 w-4 mr-2" />
              {(!collapsed || hovered) && "個人資料"}
            </Link>
          </Button>
          
          <Button 
            variant={location.pathname === "/wallet" ? "secondary" : "ghost"} 
            className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
            asChild
          >
            <Link to="/wallet">
              <Wallet className="h-4 w-4 mr-2" />
              {(!collapsed || hovered) && "錢包"}
            </Link>
          </Button>
          
          <Button 
            variant={location.pathname === "/news" ? "secondary" : "ghost"} 
            className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
            asChild
          >
            <Link to="/news">
              <Newspaper className="h-4 w-4 mr-2" />
              {(!collapsed || hovered) && "新聞"}
            </Link>
          </Button>
          
          <Button 
            variant={location.pathname === "/gift-code" ? "secondary" : "ghost"} 
            className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
            asChild
          >
            <Link to="/gift-code">
              <Gift className="h-4 w-4 mr-2" />
              {(!collapsed || hovered) && "禮品兌換"}
            </Link>
          </Button>

          <Button 
            variant={location.pathname === "/inbox" ? "secondary" : "ghost"} 
            className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
            asChild
          >
            <Link to="/inbox">
              <InboxIcon className="h-4 w-4 mr-2" />
              {(!collapsed || hovered) && "站內信"}
            </Link>
          </Button>
          
          {user.role === "admin" && (
            <>
              <Button 
                variant={location.pathname === "/admin" ? "secondary" : "ghost"} 
                className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
                asChild
              >
                <Link to="/admin">
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  {(!collapsed || hovered) && "管理員"}
                </Link>
              </Button>
              
              <Button 
                variant={location.pathname === "/backend" ? "secondary" : "ghost"} 
                className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
                asChild
              >
                <Link to="/backend">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {(!collapsed || hovered) && "後台管理"}
                </Link>
              </Button>
            </>
          )}
          
          <Button 
            variant={location.pathname === "/balloon-game" ? "secondary" : "ghost"} 
            className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
            asChild
          >
            <Link to="/balloon-game">
              <PartyPopper className="h-4 w-4 mr-2" />
              {(!collapsed || hovered) && "射氣球遊戲"}
            </Link>
          </Button>
          
          <Button 
            variant={location.pathname === "/dart-game" ? "secondary" : "ghost"} 
            className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
            asChild
          >
            <Link to="/dart-game">
              <Target className="h-4 w-4 mr-2" />
              {(!collapsed || hovered) && "射飛鏢遊戲"}
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
            onClick={handleLogout}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            {(!collapsed || hovered) && "登出"}
          </Button>
        </nav>
      </div>
    </aside>
  );
};

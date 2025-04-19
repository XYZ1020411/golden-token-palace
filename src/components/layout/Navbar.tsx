
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, LogOut } from "lucide-react";
import { useInfoServices } from "@/context/InfoServicesContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentWeatherAlerts } = useInfoServices();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">黃金令牌管理系統</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Notifications dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {currentWeatherAlerts.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {currentWeatherAlerts.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="px-4 py-2 font-medium">通知</div>
                  {currentWeatherAlerts.length > 0 ? (
                    currentWeatherAlerts.map((alert, index) => (
                      <DropdownMenuItem key={index} className="py-2">
                        <div className="flex flex-col">
                          <span className="font-medium">天氣警報</span>
                          <span className="text-sm text-muted-foreground">{alert}</span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      目前沒有新通知
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-4 py-2 font-medium border-b mb-1">
                    {user?.username}
                    <div className="text-xs font-normal text-muted-foreground">
                      {user?.role === "admin" 
                        ? "管理員" 
                        : user?.role === "vip" 
                          ? "VIP會員" 
                          : "普通會員"}
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">個人資料</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    登出
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">登入</Link>
              </Button>
              <Button asChild>
                <Link to="/register">註冊</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
}

const MainLayout = ({ children, showBackButton }: MainLayoutProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isNotDashboard = location.pathname !== "/dashboard";

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        
        <main className="flex-1 p-4 md:p-6">
          {isAuthenticated && isNotDashboard && showBackButton && (
            <Button 
              variant="outline" 
              className="mb-4 flex items-center gap-1" 
              onClick={handleBackToDashboard}
            >
              <ArrowLeft className="h-4 w-4" />
              返回儀表板
            </Button>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

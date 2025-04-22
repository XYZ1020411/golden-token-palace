
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Gift, CloudSun, User } from "lucide-react";

interface QuickActionsProps {
  userRole: string;
}

const QuickActions = ({ userRole }: QuickActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Button variant="outline" onClick={() => navigate("/wallet")}>
        <CreditCard className="mr-2 h-4 w-4" />
        查看錢包
      </Button>
      
      {userRole === "vip" && (
        <Button variant="outline" onClick={() => navigate("/vip")}>
          <Gift className="mr-2 h-4 w-4" />
          VIP專區
        </Button>
      )}
      
      <Button variant="outline" onClick={() => navigate("/weather")}>
        <CloudSun className="mr-2 h-4 w-4" />
        天氣服務
      </Button>
      
      <Button variant="outline" onClick={() => navigate("/profile")}>
        <User className="mr-2 h-4 w-4" />
        個人資料
      </Button>
    </div>
  );
};

export default QuickActions;


import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@/context/AuthContext";

interface WelcomeSectionProps {
  welcomeMessage: string;
  user: User;
  currentTime: Date;
  isAdmin: boolean;
}

export const WelcomeSection = ({ welcomeMessage, user, currentTime, isAdmin }: WelcomeSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {welcomeMessage} {user?.username || "用戶"}
        </h1>
        <p className="text-muted-foreground">
          {currentTime.toLocaleDateString("zh-TW", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      {isAdmin && (
        <Button variant="outline" onClick={() => navigate("/admin")}>
          管理後台
        </Button>
      )}
    </div>
  );
};

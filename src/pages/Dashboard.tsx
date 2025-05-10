
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { FeatureHighlight } from "@/components/dashboard/FeatureHighlight";
import { FeatureGrid } from "@/components/dashboard/FeatureGrid";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Create welcome message based on time of day
    const hours = new Date().getHours();
    let message = "";
    if (hours < 12) {
      message = "早安！";
    } else if (hours < 18) {
      message = "午安！";
    } else {
      message = "晚安！";
    }
    setWelcomeMessage(message);

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const isAdmin = user?.role === "admin";

  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeSection 
          welcomeMessage={welcomeMessage}
          user={user}
          currentTime={currentTime}
          isAdmin={isAdmin}
        />
        
        <FeatureHighlight />
        
        <FeatureGrid />
      </div>
    </MainLayout>
  );
};

export default Dashboard;

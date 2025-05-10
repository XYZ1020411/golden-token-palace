
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  iconColor: string;
  iconHoverColor: string;
  showBadge?: boolean;
  badgeText?: string;
  onClick?: () => void;
}

export const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  path, 
  iconColor, 
  iconHoverColor,
  showBadge = false,
  badgeText = "",
  onClick
}: FeatureCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="pb-2 relative">
        <div className={`h-8 w-8 mb-2 ${iconColor} group-hover:${iconHoverColor} transition-colors`}>
          {icon}
        </div>
        <CardTitle className={`group-hover:${iconHoverColor} transition-colors`}>{title}</CardTitle>
        {showBadge && <Badge className="absolute top-2 right-2">{badgeText}</Badge>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

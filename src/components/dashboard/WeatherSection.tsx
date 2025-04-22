
import { CloudSun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/context/InfoServicesContext";

interface WeatherSectionProps {
  weatherData: WeatherData[];
}

const WeatherSection = ({ weatherData }: WeatherSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>天氣預報</CardTitle>
          <CloudSun className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>今日主要城市天氣</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {weatherData.slice(0, 5).map((data) => (
            <div key={data.city} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{data.city}</span>
                <span className="text-sm text-muted-foreground">{data.condition}</span>
              </div>
              <div className="text-right">
                <span className="font-bold">{data.temperature}°C</span>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/weather")}>
            查看完整天氣
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherSection;

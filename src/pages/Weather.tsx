
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useInfoServices, WeatherData } from "@/context/InfoServicesContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CloudSun, CloudRain, Cloud, Sun, Wind, AlertTriangle } from "lucide-react";

const Weather = () => {
  const { isAuthenticated } = useAuth();
  const { weatherData, typhoonWarnings } = useInfoServices();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>("台北市");
  const [cityWeather, setCityWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Find weather data for selected city
    const found = weatherData.find(data => data.city === selectedCity);
    setCityWeather(found || null);
  }, [selectedCity, weatherData]);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("雨")) {
      return <CloudRain className="h-24 w-24 text-blue-500" />;
    } else if (condition.includes("多雲")) {
      return <Cloud className="h-24 w-24 text-gray-500" />;
    } else if (condition.includes("晴")) {
      return <Sun className="h-24 w-24 text-yellow-500" />;
    } else {
      return <CloudSun className="h-24 w-24 text-gray-400" />;
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">天氣預報</h1>
          <p className="text-muted-foreground">全台灣即時天氣資訊與預報</p>
        </div>

        {/* City selector */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>選擇城市</CardTitle>
              <CardDescription>查看特定城市的天氣詳情</CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedCity} 
                onValueChange={setSelectedCity}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選擇城市" />
                </SelectTrigger>
                <SelectContent>
                  {weatherData.map(data => (
                    <SelectItem key={data.city} value={data.city}>
                      {data.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Weather alerts */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                天氣警報
              </CardTitle>
              <CardDescription>當前有效的天氣警報資訊</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weatherData.filter(data => data.alert).length > 0 ? (
                  weatherData
                    .filter(data => data.alert)
                    .map(data => (
                      <div key={data.city} className="flex items-center justify-between">
                        <span className="font-medium">{data.city}</span>
                        <Badge variant="destructive">{data.alert}</Badge>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground">目前無天氣警報</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected city weather */}
        {cityWeather && (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex flex-col items-center justify-center p-4">
                  {getWeatherIcon(cityWeather.condition)}
                  <h2 className="text-2xl font-bold mt-2">{cityWeather.city}</h2>
                  <p className="text-lg text-muted-foreground">{cityWeather.condition}</p>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">溫度</div>
                    <div className="text-4xl font-bold">{cityWeather.temperature}°C</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">濕度</div>
                    <div className="text-2xl font-bold">{cityWeather.humidity}%</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">風速</div>
                    <div className="text-2xl font-bold flex items-center">
                      <Wind className="mr-1 h-4 w-4" />
                      {cityWeather.windSpeed} m/s
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">警報</div>
                    <div>
                      {cityWeather.alert ? (
                        <Badge variant="destructive">{cityWeather.alert}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">無</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Typhoon warnings */}
        {typhoonWarnings.length > 0 && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-amber-700 dark:text-amber-300">颱風警報</CardTitle>
              <CardDescription>當前颱風警報資訊</CardDescription>
            </CardHeader>
            <CardContent>
              {typhoonWarnings.map(typhoon => (
                <div key={typhoon.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{typhoon.name}</h3>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      {typhoon.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">位置: </span>
                      <span>{typhoon.location}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">移動方向: </span>
                      <span>{typhoon.direction}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">速度: </span>
                      <span>{typhoon.speed} km/h</span>
                    </div>
                  </div>
                  
                  <div className="text-sm mt-2">
                    <span className="font-medium">影響地區: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {typhoon.affectedAreas.map(area => (
                        <Badge key={area} variant="secondary">{area}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* All cities weather */}
        <Card>
          <CardHeader>
            <CardTitle>全台天氣概況</CardTitle>
            <CardDescription>各主要城市的天氣資訊</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weatherData.map(data => (
                <Button
                  key={data.city}
                  variant="outline"
                  className="h-auto flex justify-between items-center p-4"
                  onClick={() => setSelectedCity(data.city)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold">{data.city}</span>
                    <span className="text-sm text-muted-foreground">{data.condition}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">{data.temperature}°C</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Weather;

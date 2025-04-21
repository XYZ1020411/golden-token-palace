
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchWeatherFromCWA } from "../services/weatherService";

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  alert?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  source: string;
  url?: string;
}

export interface TyphoonInfo {
  id: string;
  name: string;
  status: "形成中" | "海上警報" | "陸上警報" | "解除警報";
  location: string;
  direction: string;
  speed: number;
  affectedAreas: string[];
}

interface InfoServicesContextType {
  weatherData: WeatherData[];
  newsItems: NewsItem[];
  typhoonWarnings: TyphoonInfo[];
  currentWeatherAlerts: string[];
  fetchWeather: (city: string) => Promise<WeatherData | null>;
  fetchNews: () => Promise<boolean>;
}

const mockTyphoonWarnings: TyphoonInfo[] = [
  {
    id: "1",
    name: "米克拉",
    status: "海上警報",
    location: "菲律賓東方海面",
    direction: "西北",
    speed: 20,
    affectedAreas: ["台東縣", "屏東縣", "花蓮縣"]
  }
];

const PUBNEWS_API =
  "https://api.pubnewsapi.com/v1/news?token=pub_77914c9ab741571647f817116519227c8df64&country=tw&language=zh-Hant";

const InfoServicesContext = createContext<InfoServicesContextType | undefined>(undefined);

export const InfoServicesProvider = ({ children }: { children: ReactNode }) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [typhoonWarnings, setTyphoonWarnings] = useState<TyphoonInfo[]>(mockTyphoonWarnings);
  const [currentWeatherAlerts, setCurrentWeatherAlerts] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // --- 網路狀態同步 ---
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // 網路恢復時自動同步
      syncAll();
    };
    const handleOffline = () => {
      setIsOnline(false);
      // 可選：你可以用 toast 通知用戶離線狀態
      // toast({ title: "已離線，部分資料無法即時同步", variant: "destructive" });
      console.warn("網路已斷開，無法即時獲取最新資料。");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // eslint-disable-next-line
  }, []);

  // --- 即時更新邏輯（包含啟動輪詢、手動輪詢、網路恢復）---
  useEffect(() => {
    // 啟動立即同步
    syncAll();

    // 每10分鐘重新同步
    const interval = setInterval(() => {
      if (isOnline) {
        syncAll();
      }
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [isOnline]);

  // 單獨包裝全域同步
  const syncAll = () => {
    fetchWeatherData();
    fetchNews();
    // 若將來要加地震/颱風也可放進來呼叫
  };

  // --- API 同步函數 ---
  const fetchWeatherData = async () => {
    try {
      const data = await fetchWeatherFromCWA();
      if (data.length > 0) {
        setWeatherData(data);
      }
    } catch (error) {
      console.error("獲取天氣資料失敗:", error);
    }
  };

  const fetchNews = async (): Promise<boolean> => {
    try {
      const res = await fetch(PUBNEWS_API);
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        const news: NewsItem[] = json.data.slice(0, 5).map((item: any, idx: number) => ({
          id: item.id ? String(item.id) : String(idx),
          title: item.title || "",
          content: item.description || "",
          date: item.publishedAt || new Date().toISOString(),
          source: item.source || "PubNews",
          url: item.url || "",
        }));
        setNewsItems(news);
        return true;
      }
      return false;
    } catch (error) {
      console.error("獲取新聞失敗：", error);
      return false;
    }
  };

  useEffect(() => {
    const alerts = weatherData
      .filter((data) => data.alert)
      .map((data) => `${data.city}: ${data.alert}`);
    setCurrentWeatherAlerts(alerts);
  }, [weatherData]);

  const fetchWeather = async (city: string): Promise<WeatherData | null> => {
    const cityData = weatherData.find((data) => data.city === city);
    return cityData || null;
  };

  return (
    <InfoServicesContext.Provider
      value={{
        weatherData,
        newsItems,
        typhoonWarnings,
        currentWeatherAlerts,
        fetchWeather,
        fetchNews,
      }}>
      {children}
    </InfoServicesContext.Provider>
  );
};

export const useInfoServices = () => {
  const context = useContext(InfoServicesContext);
  if (context === undefined) {
    throw new Error("useInfoServices must be used within an InfoServicesProvider");
  }
  return context;
};



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

// 先刪除米克拉台風, 留空的台風警報列表
const mockTyphoonWarnings: TyphoonInfo[] = [];

// 修復新聞 API
const PUBNEWS_API =
  "https://api.pubnewsapi.com/v1/news?token=pub_77914c9ab741571647f817116519227c8df64&country=tw&language=zh-Hant";

// 備用新聞，当 API 失敗時顯示
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "台灣數位轉型加速，政府推出新政策",
    content: "台灣政府今日宣布一系列新政策，旨在加速國家的數位轉型進程。這些政策包括增加對科技創新的投資、簡化科技創業的行政流程，以及提供更多數位技能培訓機會。",
    date: new Date().toISOString(),
    source: "科技日報",
  },
  {
    id: "2",
    title: "全球晶片短缺問題持續，台積電增產應對",
    content: "全球晶片短缺問題仍在持續，影響了從汽車製造到電子消費品的多個行業。台積電已宣布將增加產能，預計在未來幾個月內緩解部分供應壓力。",
    date: new Date().toISOString(),
    source: "商業週刊",
  },
  {
    id: "3",
    title: "新研究：每天喝綠茶有助於延長壽命",
    content: "最新醫學研究表明，每天適量飲用綠茶可能有助於延長壽命。研究發現，綠茶中的抗氧化物質可以幫助減少細胞損傷，降低患心臟病和某些癌症的風險。",
    date: new Date().toISOString(),
    source: "健康雜誌",
  }
];

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
      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }
      
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
      } else {
        // 若 API 返回格式不正確，使用備用新聞
        console.warn("News API 返回格式不正確，使用備用新聞");
        setNewsItems(FALLBACK_NEWS);
      }
      return false;
    } catch (error) {
      console.error("獲取新聞失敗：", error);
      // 在 API 失敗時使用備用新聞
      setNewsItems(FALLBACK_NEWS);
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

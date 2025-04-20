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

const mockNewsItems: NewsItem[] = [
  {
    id: "1",
    title: "台灣疫苗接種率持續提升，新政策將於下月實施",
    content: "根據衛福部最新數據，台灣COVID-19疫苗接種率已達95%，衛福部宣布將於下個月推出新的防疫政策...",
    date: "2025-04-18T08:00:00Z",
    source: "台灣健康新聞網"
  },
  {
    id: "2",
    title: "台北市將舉辦大型科技展，展示最新AI技術應用",
    content: "台北市政府宣布將於下個月在南港展覽館舉辦為期一週的科技創新展，將有超過200家企業參展，展示最新的AI技術應用...",
    date: "2025-04-17T10:30:00Z",
    source: "科技日報"
  },
  {
    id: "3",
    title: "台灣經濟第一季度增長超預期，專家樂觀看待全年表現",
    content: "根據經濟部發布的數據，台灣第一季度經濟增長達4.2%，超過先前3.8%的預期，多位專家對全年經濟表現持樂觀態度...",
    date: "2025-04-16T14:15:00Z",
    source: "財經時報"
  },
  {
    id: "4",
    title: "台南將舉辦年度藝術節，邀請國際藝術家參與",
    content: "台南市文化局宣布將於五月份舉辦年度藝術節，活動為期兩週，邀請來自全球各地的藝術家參與，展示多元文化藝術作品...",
    date: "2025-04-15T09:45:00Z",
    source: "文化藝術報"
  },
  {
    id: "5",
    title: "新環保法規將實施，企業須降低碳排放",
    content: "環保署宣布新的環保法規將於下季度開始實施，所有大型企業需降低碳排放量20%，否則將面臨嚴厲罰款...",
    date: "2025-04-14T11:20:00Z",
    source: "環境日報"
  }
];

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

const InfoServicesContext = createContext<InfoServicesContextType | undefined>(undefined);

export const InfoServicesProvider = ({ children }: { children: ReactNode }) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockNewsItems);
  const [typhoonWarnings, setTyphoonWarnings] = useState<TyphoonInfo[]>(mockTyphoonWarnings);
  const [currentWeatherAlerts, setCurrentWeatherAlerts] = useState<string[]>([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await fetchWeatherFromCWA();
        if (data.length > 0) {
          setWeatherData(data);
        }
      } catch (error) {
        console.error('獲取天氣資料失敗:', error);
      }
    };

    fetchWeatherData();

    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const alerts = weatherData
      .filter(data => data.alert)
      .map(data => `${data.city}: ${data.alert}`);
    
    setCurrentWeatherAlerts(alerts);
  }, [weatherData]);

  const fetchWeather = async (city: string): Promise<WeatherData | null> => {
    const cityData = weatherData.find(data => data.city === city);
    return cityData || null;
  };

  const fetchNews = async (): Promise<boolean> => {
    return true;
  };

  return (
    <InfoServicesContext.Provider value={{
      weatherData,
      newsItems,
      typhoonWarnings,
      currentWeatherAlerts,
      fetchWeather,
      fetchNews
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

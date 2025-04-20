
// 中央氣象署 API 服務
// 參考文件: https://opendata.cwa.gov.tw/dist/opendata-swagger.html

interface WeatherForecastResponse {
  success: string;
  records: {
    location: Array<{
      locationName: string;
      weatherElement: Array<{
        elementName: string;
        time: Array<{
          startTime: string;
          endTime: string;
          parameter: {
            parameterName: string;
            parameterUnit?: string;
          };
        }>;
      }>;
    }>;
  };
}

interface WeatherWarningResponse {
  success: string;
  records: {
    hazard: Array<{
      hazardId: string;
      hazardName: string;
      location: string[];
      startTime: string;
      endTime: string;
    }>;
  };
}

interface EarthquakeResponse {
  success: string;
  records: {
    earthquake: Array<{
      earthquakeNo: string;
      location: string;
      originTime: string;
      magnitudeValue: string;
      depth: string;
    }>;
  };
}

interface TyphoonResponse {
  success: string;
  records: {
    typhoon: Array<{
      typhoonNo: string;
      typhoonName: string;
      position: string;
      movingSpeed: string;
      pressure: string;
      radius15: string;
    }>;
  };
}

const CWA_API_ENDPOINT = "https://opendata.cwa.gov.tw/api/v1/rest/datastore";
const CWA_API_KEY = "CWA-6FC4659D-D65C-4612-928C-CC2CCFFBA42A";

const fetchFromCWA = async <T>(endpoint: string): Promise<T> => {
  // 檢查網路連接
  if (!navigator.onLine) {
    throw new Error('目前無網路連接');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 秒超時

    const response = await fetch(
      `${CWA_API_ENDPOINT}/${endpoint}?Authorization=${CWA_API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 請求失敗:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('資料同步超時，請稍後再試');
      }
    }
    throw error;
  }
};

export const fetchWeatherFromCWA = async () => {
  const data = await fetchFromCWA<WeatherForecastResponse>('F-C0032-001');
  
  return data.records.location.map(location => {
    const weatherElements = location.weatherElement;
    const wx = weatherElements.find(el => el.elementName === 'Wx')?.time[0]?.parameter.parameterName || '';
    const minT = weatherElements.find(el => el.elementName === 'MinT')?.time[0]?.parameter.parameterName || '';
    const maxT = weatherElements.find(el => el.elementName === 'MaxT')?.time[0]?.parameter.parameterName || '';
    const pop = weatherElements.find(el => el.elementName === 'PoP')?.time[0]?.parameter.parameterName || '';

    const avgTemp = Math.round((Number(minT) + Number(maxT)) / 2);

    return {
      city: location.locationName,
      temperature: avgTemp,
      condition: wx,
      humidity: Number(pop),
      windSpeed: 0,
      alert: Number(pop) > 70 ? "大雨特報" : undefined
    };
  });
};

export const fetchWeatherWarnings = async () => {
  const data = await fetchFromCWA<WeatherWarningResponse>('W-C0033-001');
  return data.records.hazard;
};

export const fetchEarthquakeInfo = async () => {
  const data = await fetchFromCWA<EarthquakeResponse>('E-A0015-002');
  return data.records.earthquake;
};

export const fetchTyphoonInfo = async () => {
  const data = await fetchFromCWA<TyphoonResponse>('W-C0034-005');
  return data.records.typhoon;
};


// 中央氣象局 API 服務
// 參考文件: https://opendata.cwb.gov.tw/dist/opendata-swagger.html

interface CWBWeatherResponse {
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

const CWB_API_ENDPOINT = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001";
const CWB_API_KEY = "CWB-1234567B-1234-4567-ABCD-123456789012"; // 這是假的 API key，請替換成您的實際 API 金鑰

export const fetchWeatherFromCWB = async () => {
  // 檢查網路連接
  if (!navigator.onLine) {
    throw new Error('目前無網路連接');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 秒超時

    const response = await fetch(
      `${CWB_API_ENDPOINT}?Authorization=${CWB_API_KEY}&format=JSON`,
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

    const data: CWBWeatherResponse = await response.json();
    
    return data.records.location.map(location => {
      // 解析天氣要素
      const weatherElements = location.weatherElement;
      const wx = weatherElements.find(el => el.elementName === 'Wx')?.time[0]?.parameter.parameterName || '';
      const minT = weatherElements.find(el => el.elementName === 'MinT')?.time[0]?.parameter.parameterName || '';
      const maxT = weatherElements.find(el => el.elementName === 'MaxT')?.time[0]?.parameter.parameterName || '';
      const pop = weatherElements.find(el => el.elementName === 'PoP')?.time[0]?.parameter.parameterName || '';

      // 計算平均溫度
      const avgTemp = Math.round((Number(minT) + Number(maxT)) / 2);

      return {
        city: location.locationName,
        temperature: avgTemp,
        condition: wx,
        humidity: Number(pop),
        windSpeed: 0, // 由於 F-C0032-001 API 不提供風速資料，預設為 0
        alert: Number(pop) > 70 ? "大雨特報" : undefined
      };
    });
  } catch (error) {
    console.error('獲取天氣資料失敗:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('資料同步超時，請稍後再試');
      }
    }
    throw error;
  }
};


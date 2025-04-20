
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
const CWB_API_KEY = "YOUR_API_KEY"; // 這裡需要替換成實際的 API 金鑰

export const fetchWeatherFromCWB = async () => {
  try {
    const response = await fetch(
      `${CWB_API_ENDPOINT}?Authorization=${CWB_API_KEY}&format=JSON`
    );
    
    if (!response.ok) {
      throw new Error('無法從中央氣象局獲取資料');
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
    return [];
  }
};


import { supabase } from "@/integrations/supabase/client";

export interface AiAssistantResponse {
  content: string;
  status: 'success' | 'error';
}

export const getAiAssistantResponse = async (
  customerMessage: string
): Promise<AiAssistantResponse> => {
  try {
    // 增加重試機制
    let attempts = 0;
    const maxAttempts = 3;
    let lastError: Error | null = null;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`正在嘗試獲取AI回應 (嘗試 ${attempts + 1}/${maxAttempts})`);
        
        const { data, error } = await supabase.functions.invoke('ai-customer-service', {
          body: { customerMessage },
          headers: {
            "x-timeout-ms": "15000"
          }
        });

        if (error) {
          console.error('Supabase Function Error:', error);
          throw error;
        }

        if (!data || !data.response) {
          throw new Error('無效的 AI 回應數據');
        }

        console.log('AI 回應成功獲取');
        return {
          content: data.response,
          status: 'success'
        };
      } catch (err) {
        console.warn(`AI 回應嘗試 ${attempts + 1}/${maxAttempts} 失敗:`, err);
        lastError = err instanceof Error ? err : new Error(String(err));
        attempts++;
        // 增加重試間隔時間
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
    
    // 所有重試都失敗
    console.error('AI Assistant Error after all retries:', lastError);
    throw lastError;
  } catch (error) {
    console.error('AI Assistant Error:', error);
    return {
      content: '抱歉，AI 助手暫時無法使用。請稍後再試。',
      status: 'error'
    };
  }
};

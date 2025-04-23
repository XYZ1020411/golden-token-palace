
import { supabase } from "@/integrations/supabase/client";

// 移除 interface export，僅保留給型別推斷用
export interface AiAssistantResponse {
  content: string;
  status: 'success' | 'error';
}

export const getAiAssistantResponse = async (
  customerMessage: string
): Promise<AiAssistantResponse> => {
  try {
    // 修正 invoke 寫法
    const { data, error } = await supabase.functions.invoke('ai-customer-service', {
      body: { customerMessage },
      // Supabase v2 invoke API 使用 headers 傳遞 timeout
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

    return {
      content: data.response,
      status: 'success'
    };
  } catch (error) {
    console.error('AI Assistant Error:', error);
    return {
      content: '抱歉，AI 助手暫時無法使用。請稍後再試。',
      status: 'error'
    };
  }
};


import { supabase } from "@/integrations/supabase/client";

interface AiAssistantResponse {
  content: string;
  status: 'success' | 'error';
}

export const getAiAssistantResponse = async (
  customerMessage: string
): Promise<AiAssistantResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-customer-service', {
      body: { customerMessage }
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

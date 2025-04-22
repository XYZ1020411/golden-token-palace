
interface AiAssistantResponse {
  content: string;
  status: 'success' | 'error';
}

export const getAiAssistantResponse = async (
  customerMessage: string
): Promise<AiAssistantResponse> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一個專業的客服人員，負責回答用戶的問題。請以專業、友善且有禮貌的方式回應。'
          },
          {
            role: 'user',
            content: customerMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
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

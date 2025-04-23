
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { customerMessage } = await req.json()
    const openAiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAiKey) {
      throw new Error("OpenAI API Key is not configured")
    }

    if (!customerMessage || typeof customerMessage !== 'string') {
      throw new Error("客戶訊息不正確或為空")
    }

    // Call OpenAI API with improved retry mechanism
    let attempts = 0;
    const maxAttempts = 3;
    let response = null;
    let success = false;
    let lastError = null;

    while (attempts < maxAttempts && !success) {
      try {
        console.log(`嘗試 OpenAI API 請求 (${attempts + 1}/${maxAttempts})`)
        
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: '你是一個專業的客服人員，負責回答用戶的問題。請以專業、友善且有禮貌的方式回應。' +
                        '如果遇到系統相關問題，請表達歉意並承諾會轉交相關部門處理。' +
                        '如果用戶詢問關於商品兌換、點數或VIP功能等問題，可以提供相應的指引。' + 
                        '回應時請保持簡潔且有幫助性。'
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
        
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`非預期的回應格式: ${contentType}`);
          }
          
          success = true;
        } else {
          attempts++;
          const errorText = await response.text();
          lastError = `API 請求失敗 (狀態碼: ${response.status}): ${errorText}`;
          console.error(lastError);
          
          // Add an exponential backoff before retrying
          const delay = Math.pow(2, attempts) * 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        attempts++;
        lastError = `API 請求異常: ${error.message || error}`;
        console.error(lastError);
        
        // Add an exponential backoff before retrying
        const delay = Math.pow(2, attempts) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    if (!success || !response) {
      throw new Error(`AI API 請求失敗，原因: ${lastError}`)
    }

    const data = await response.json();
    console.log("OpenAI API 回應成功");
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('無效的 OpenAI API 回應格式');
    }
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      response: '抱歉，AI 助手暫時無法使用。請稍後再試。'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

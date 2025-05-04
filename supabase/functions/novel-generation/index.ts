
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 直接在代碼中使用API密鑰
const OPENAI_API_KEY = "sk-184a5013c2ea446095874c4a0e5ea720";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { chapterNumber, previousContent } = await req.json();

    // Validate input
    if (!chapterNumber || typeof chapterNumber !== 'number') {
      throw new Error("章節號碼無效");
    }

    // Call OpenAI API
    let attempts = 0;
    const maxAttempts = 3;
    let response = null;
    let success = false;
    let lastError = null;

    while (attempts < maxAttempts && !success) {
      try {
        console.log(`嘗試生成小說章節 ${chapterNumber} (嘗試 ${attempts + 1}/${maxAttempts})`);

        const prompt = `請為一部名為「末日前1個月，我重生喚醒系統」的小說創作第${chapterNumber}章。
這個故事講述主角在末日前一個月重生，被賦予改變未來的能力。
${previousContent ? `前一章節內容概要：${previousContent.substring(0, 500)}...` : ''}
請寫出引人入勝、情節緊湊的章節，長度約1000-1500字，使用繁體中文。
章節應該包含生動的描述、對話和角色發展，推動故事情節向前發展。`;

        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: '你是一位專業小說創作者，擅長撰寫末日重生類型的小說。請創作出引人入勝、充滿張力的小說章節。'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.8,
            max_tokens: 1500
          })
        });
        
        if (response.status === 200) {
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`非預期的回應格式: ${contentType}`);
          }
          
          success = true;
          console.log(`第${chapterNumber}章小說內容生成成功`);
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
      throw new Error(`小說生成失敗，原因: ${lastError}`)
    }

    const data = await response.json();
    console.log("小說章節回應成功解析");
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('無效的 OpenAI API 回應格式');
    }
    
    const novelContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      content: novelContent,
      chapterNumber: chapterNumber
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      content: '很抱歉，無法生成今天的小說章節。請稍後再試。',
      chapterNumber: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

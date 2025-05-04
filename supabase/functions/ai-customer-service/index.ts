
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 系統維護時間 - 每週日下午3點至4點
const maintenanceSchedule = {
  active: true,
  checkInMaintenanceWindow: () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday
    const hour = now.getHours();
    
    // 檢查是否為週日(0)且時間在15:00-16:00之間
    return day === 0 && hour >= 15 && hour < 16;
  },
  message: "系統目前處於定期維護時間（每週日下午3點至4點），期間客服功能可能受到影響。請稍後再試。"
};

// 預設回覆庫
const predefinedResponses = {
  default: "感謝您的提問。我是AI客服助手，很高興為您服務。請問有什麼可以幫助您的嗎？",
  greeting: "您好！歡迎使用我們的客服系統。請問有什麼我可以幫助您的？",
  goodbye: "感謝您的咨詢！如果還有其他問題，隨時可以再來詢問。祝您有愉快的一天！",
  thanks: "不客氣！很高興能夠幫到您。如果還有其他問題，請隨時提問。",
  
  // 常見問題回覆
  account: "關於帳號問題，您可以在「個人資料」頁面進行基本資料修改。如需更改重要資訊如綁定郵箱或手機號，請點擊「安全設置」。忘記密碼請使用登入頁面的「忘記密碼」功能。",
  points: "點數可以通過完成任務、每日登入、參與活動等方式獲取。您可以在「我的錢包」頁面查看當前點數並了解獲取和使用方式。",
  vip: "VIP會員可享有專屬禮包、加速點數獲取、獨家內容和活動等特權。您可以在「VIP專區」了解詳細權益和升級方式。",
  giftcode: "禮包碼可在「禮包兌換」頁面輸入兌換。請確保輸入正確且注意大小寫。部分禮包碼有時效性和使用條件，請留意相關說明。",
  payment: "我們支援多種支付方式，包括信用卡、電子錢包和行動支付。若遇到支付問題，建議檢查網絡連接、卡片餘額，或聯繫您的銀行確認交易狀態。",
  bug: "非常抱歉您遇到了問題。請提供具體情況，如操作步驟、錯誤提示等。我們會記錄並轉交技術團隊處理。您也可以嘗試重新登入或清除瀏覽器緩存。",
  
  // 系統維護相關
  maintenance: "系統目前處於定期維護時間（每週日下午3點至4點），期間部分功能可能無法正常使用。維護結束後所有服務將恢復正常。感謝您的理解與支持。"
};

// 根據用户輸入選擇合適的預設回覆
function selectResponse(message: string): string {
  // 檢查是否在維護時間段內
  if (maintenanceSchedule.active && maintenanceSchedule.checkInMaintenanceWindow()) {
    // 先返回維護訊息，再根據問題內容給出回答
    const maintenanceNotice = maintenanceSchedule.message + "\n\n";
    
    // 然後再提供一般回答
    message = message.toLowerCase();
    
    if (message.includes("你好") || message.includes("嗨") || message.includes("哈囉") || message.includes("早安") || message.includes("午安") || message.includes("晚安")) {
      return maintenanceNotice + predefinedResponses.greeting;
    } else if (message.includes("謝謝") || message.includes("感謝")) {
      return maintenanceNotice + predefinedResponses.thanks;
    } else if (message.includes("帳號") || message.includes("登入") || message.includes("註冊") || message.includes("密碼")) {
      return maintenanceNotice + predefinedResponses.account;
    } else if (message.includes("點數") || message.includes("積分") || message.includes("幣")) {
      return maintenanceNotice + predefinedResponses.points;
    } else if (message.includes("vip") || message.includes("會員")) {
      return maintenanceNotice + predefinedResponses.vip;
    } else if (message.includes("禮包") || message.includes("兌換碼") || message.includes("兌換") || message.includes("code")) {
      return maintenanceNotice + predefinedResponses.giftcode;
    } else if (message.includes("支付") || message.includes("付款") || message.includes("充值") || message.includes("購買")) {
      return maintenanceNotice + predefinedResponses.payment;
    } else if (message.includes("bug") || message.includes("問題") || message.includes("故障") || message.includes("錯誤") || message.includes("無法")) {
      return maintenanceNotice + predefinedResponses.bug;
    } else if (message.includes("維護") || message.includes("更新") || message.includes("升級")) {
      return predefinedResponses.maintenance;
    } else {
      return maintenanceNotice + predefinedResponses.default;
    }
  }
  
  // 非維護時間的一般回應
  message = message.toLowerCase();
  
  if (message.includes("你好") || message.includes("嗨") || message.includes("哈囉") || message.includes("早安") || message.includes("午安") || message.includes("晚安")) {
    return predefinedResponses.greeting;
  } else if (message.includes("謝謝") || message.includes("感謝")) {
    return predefinedResponses.thanks;
  } else if (message.includes("帳號") || message.includes("登入") || message.includes("註冊") || message.includes("密碼")) {
    return predefinedResponses.account;
  } else if (message.includes("點數") || message.includes("積分") || message.includes("幣")) {
    return predefinedResponses.points;
  } else if (message.includes("vip") || message.includes("會員")) {
    return predefinedResponses.vip;
  } else if (message.includes("禮包") || message.includes("兌換碼") || message.includes("兌換") || message.includes("code")) {
    return predefinedResponses.giftcode;
  } else if (message.includes("支付") || message.includes("付款") || message.includes("充值") || message.includes("購買")) {
    return predefinedResponses.payment;
  } else if (message.includes("bug") || message.includes("問題") || message.includes("故障") || message.includes("錯誤") || message.includes("無法")) {
    return predefinedResponses.bug;
  } else if (message.includes("維護") || message.includes("更新") || message.includes("升級")) {
    return predefinedResponses.maintenance;
  } else {
    return predefinedResponses.default;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { customerMessage } = await req.json()

    if (!customerMessage || typeof customerMessage !== 'string') {
      throw new Error("客戶訊息不正確或為空")
    }

    // 不再呼叫 OpenAI API，直接使用預設回覆
    console.log("處理用戶訊息:", customerMessage);
    
    const aiResponse = selectResponse(customerMessage);
    console.log("回應用戶訊息");
    
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: '抱歉，AI 助手暫時無法使用。請稍後再試。'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

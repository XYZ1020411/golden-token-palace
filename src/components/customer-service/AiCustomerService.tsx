
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// 預設回應集
const AI_RESPONSES: {[key: string]: string} = {
  "你好": "您好！很高興為您服務，請問有什麼可以幫助您的嗎？",
  "點數": "您可以在錢包頁面查看您的點數余額，如需了解如何獲取更多點數，請訪問VIP專區。",
  "商品兌換": "您可以在主頁下方的「商品券兌換」區域用點數兌換各種實用商品券。",
  "帳戶": "帳戶相關問題可以在「個人資料」頁面進行管理，包括修改密碼、更新個人信息等。",
  "天氣": "您可以在「天氣服務」頁面查看各地的天氣預報和警報信息。",
  "default": "感謝您的提問！我們的客服人員會盡快處理您的問題。同時，您也可以查看常見問題或使用更具體的關鍵詞來獲取即時幫助。"
};

export const AiCustomerService = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "歡迎使用AI客服，有什麼可以幫助您的嗎？",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // 添加用戶訊息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // 生成 AI 回應
    setTimeout(() => {
      let response = AI_RESPONSES.default;
      
      // 簡單關鍵詞匹配
      for (const keyword in AI_RESPONSES) {
        if (keyword !== "default" && input.includes(keyword)) {
          response = AI_RESPONSES[keyword];
          break;
        }
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    }, 500);
    
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              AI客服助手
            </DialogTitle>
            <DialogDescription>
              有任何問題都可以向我詢問，我會盡力幫助您。
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter className="flex-shrink-0">
            <div className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="輸入您的問題..."
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

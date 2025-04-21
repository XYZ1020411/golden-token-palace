
import { useState, useRef, useEffect } from "react";
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

// AI 問答模擬 - 可擴充
const AI_RESPONSES: { [key: string]: string } = {
  "你好": "您好！很高興為您服務，請問有什麼可以幫助您的嗎？",
  "點數": "您可在錢包頁面查看點數餘額。若要獲得更多點數，歡迎使用 VIP 專區或分享活動獲贈。",
  "條碼": "您在收件夾可查看已兌換商品的條碼。給服務人員掃描條碼即可兌換。",
  "商品": "所有可兌換商品都在首頁『商品券兌換』。完成兌換後在『收件夾』取得條碼。",
  "新聞": "新聞請前往新聞專區，可以瀏覽最新資訊。",
  "天氣": "目前台風資訊已下架，氣象相關請查閱氣象頁。",
  "default": "感謝您的提問！如需真人協助會有專人跟進，或請提供更具體關鍵字。"
};

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

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
  const inputRef = useRef<HTMLInputElement>(null);

  // 修正：Dialog開啟自動 focus，且按 send/enter 能傳送
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // 添加用戶訊息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // 生成 AI 回覆
    setTimeout(() => {
      let response = AI_RESPONSES.default;
      // 支援模糊關鍵詞
      for (const keyword in AI_RESPONSES) {
        if (keyword !== "default" && input.includes(keyword)) {
          response = AI_RESPONSES[keyword];
          break;
        }
      }
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 600);
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
        aria-label="開啟AI客服"
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
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
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
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="輸入您的問題..."
                className="flex-1"
                aria-label="問題輸入"
                autoFocus
              />
              <Button size="icon" onClick={handleSendMessage} aria-label="發送訊息">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

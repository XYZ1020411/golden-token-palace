
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
import { getAiAssistantResponse } from "@/services/aiAssistant";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 修正：Dialog開啟自動 focus，且按 send/enter 能傳送
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // 自動滾動到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // 添加用戶訊息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // 使用 OpenAI API 獲取回應
      const response = await getAiAssistantResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      if (response.status === 'error') {
        toast({
          title: "系統提示",
          description: "AI回覆出現問題，請稍後再試",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("AI回覆錯誤:", error);
      toast({
        title: "系統錯誤",
        description: "無法連接到AI客服，請稍後再試",
        variant: "destructive",
      });
      
      // 添加錯誤訊息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "抱歉，系統暫時無法回應，請稍後再試。",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
              <div ref={messagesEndRef} />
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
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage} 
                aria-label="發送訊息"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

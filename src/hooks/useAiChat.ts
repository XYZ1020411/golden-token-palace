import { useState, useRef } from "react";
import { getAiAssistantResponse } from "@/services/aiAssistant";
import { useToast } from "@/components/ui/use-toast";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  error?: boolean;
}

export function useAiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "歡迎使用AI客服，有什麼可以幫助您的嗎？",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const { toast } = useToast();

  // keep ref for scroll-to-bottom after message sent
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 發送用戶訊息
  const sendMessage = async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // temporary typing id
    const typingId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      {
        id: typingId.toString(),
        content: "AI 助手正在思考回覆...",
        isUser: false,
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await getAiAssistantResponse(input);

      setMessages((prev) => prev.filter((msg) => msg.id !== typingId.toString()));

      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        error: response.status === "error"
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (response.status === "error") {
        setRetryAttempt((prev) => prev + 1);
        if (retryAttempt < 2) {
          toast({
            title: "系統提示",
            description: "AI回覆出現問題，系統將自動重試",
            variant: "default",
          });
        } else {
          toast({
            title: "系統提示",
            description: "AI回覆持續出現問題，請稍後再試",
            variant: "destructive",
          });
          setRetryAttempt(0);
        }
      } else {
        setRetryAttempt(0);
      }
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== typingId.toString()));
      toast({
        title: "系統錯誤",
        description: "無法連接到AI客服，請稍後再試",
        variant: "destructive",
      });
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        content: "抱歉，系統暫時無法回應，請稍後再試。",
        isUser: false,
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    isLoading,
    retryAttempt,
    messagesEndRef,
    sendMessage,
  };
}

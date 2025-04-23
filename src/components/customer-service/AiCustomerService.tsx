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
import { useAuth } from "@/context/AuthContext";
import { useAiChat } from "@/hooks/useAiChat";
import { AiChatMessage } from "./AiChatMessage";

export const AiCustomerService = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const {
    messages, isLoading, messagesEndRef, sendMessage
  } = useAiChat();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
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
                <AiChatMessage message={message} key={message.id} />
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
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="輸入您的問題..."
                className="flex-1"
                aria-label="問題輸入"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={handleSend}
                aria-label="發送訊息"
                disabled={isLoading}
              >
                <Send className={`h-4 w-4 ${isLoading ? "animate-pulse" : ""}`} />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

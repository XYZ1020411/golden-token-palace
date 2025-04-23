
import { AlertCircle, Bot } from "lucide-react";
import React from "react";
import { Message } from "@/hooks/useAiChat";

interface AiChatMessageProps {
  message: Message;
}

export const AiChatMessage: React.FC<AiChatMessageProps> = ({ message }) => (
  <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
    <div
      className={`p-3 rounded-lg max-w-[80%] ${
        message.isUser
          ? "bg-primary text-primary-foreground"
          : message.error
            ? "bg-red-100 text-red-800"
            : "bg-muted"
      }`}
    >
      {message.error && (
        <div className="flex items-center mb-1 text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">錯誤</span>
        </div>
      )}
      <p className="text-sm">{message.content}</p>
      <p className="text-xs opacity-70 mt-1 text-right">
        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  </div>
);

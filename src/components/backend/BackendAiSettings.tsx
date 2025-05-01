
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerSupportMessage } from "@/context/AdminContext";
import { Bot, MessageCircle, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAiAssistantResponse, AiAssistantResponse } from "@/services/aiAssistant";

interface BackendAiSettingsProps {
  supportMessages: CustomerSupportMessage[];
  respondToSupportMessage: (messageId: string, response: string) => boolean;
  markSupportMessageResolved: (messageId: string, resolved: boolean) => boolean;
  getAiAssistantResponse: (customerMessage: string) => Promise<AiAssistantResponse>;
}

export const BackendAiSettings = ({
  supportMessages,
  respondToSupportMessage,
  markSupportMessageResolved,
  getAiAssistantResponse
}: BackendAiSettingsProps) => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredMessages = supportMessages?.filter(message =>
    message.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleAiAssist = async (messageId: string, customerMessage: string) => {
    setIsLoading(true);
    try {
      const aiResponse = await getAiAssistantResponse(customerMessage);
      setResponseText(aiResponse.content);
      setSelectedMessage(messageId);
    } catch (error) {
      console.error("AI助手生成回覆失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespondToMessage = (messageId: string) => {
    if (!responseText.trim()) {
      return;
    }

    const success = respondToSupportMessage(messageId, responseText);
    if (success) {
      setResponseText("");
      setSelectedMessage(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          客戶支援訊息 & AI 設置
        </CardTitle>
        <CardDescription className="flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋客戶訊息..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="ml-2 text-sm">
            共 {supportMessages?.length || 0} 個訊息，
            未解決: {supportMessages?.filter(msg => !msg.resolved).length || 0} 個
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{message.username}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${message.resolved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {message.resolved ? "已解決" : "未解決"}
                    </span>
                  </div>
                </div>
                <div className="text-sm mb-3 bg-muted p-3 rounded-md">
                  {message.message}
                </div>
                {message.adminResponse && (
                  <div className="text-sm mb-3">
                    <div className="font-medium mb-1">回覆:</div>
                    <div className="bg-blue-50 p-3 rounded-md text-blue-700">
                      {message.adminResponse}
                    </div>
                  </div>
                )}
                {/* AI 回覆目前仍放不到資料庫，僅做即時輔助 */}
                {!message.adminResponse && (
                  <div className="space-y-2">
                    {selectedMessage === message.id ? (
                      <>
                        <Textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="輸入回覆內容..."
                          rows={4}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAiAssist(message.id, message.message)}
                            disabled={isLoading}
                          >
                            {isLoading ? "生成中..." : "使用 AI 助手"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                            取消
                          </Button>
                          <Button size="sm" onClick={() => handleRespondToMessage(message.id)}>
                            發送回覆
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message.id)}>
                        回覆
                      </Button>
                    )}
                  </div>
                )}
                <div className="flex justify-end mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markSupportMessageResolved(message.id, !message.resolved)}
                  >
                    標記為{message.resolved ? "未解決" : "已解決"}
                  </Button>
                </div>
              </div>
            ))}
            {filteredMessages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                沒有找到符合搜尋條件的客戶訊息
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

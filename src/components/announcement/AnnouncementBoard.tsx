
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Wifi, WifiOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  importance: "low" | "medium" | "high";
}

export const AnnouncementBoard = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "網路已連接",
        description: "正在同步最新公告...",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "網路已斷開",
        description: "無法接收最新公告",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      // Simulated API call
      const mockAnnouncements: Announcement[] = [
        {
          id: "1",
          title: "系統通知",
          content: "歡迎使用渣打好公司系統",
          date: new Date().toISOString(),
          importance: "high"
        }
      ];
      return mockAnnouncements;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Schedule daily announcement
  useEffect(() => {
    const scheduleAnnouncement = () => {
      const now = new Date();
      const announcementTime = new Date();
      announcementTime.setHours(19, 0, 0, 0); // Set to 7 PM

      if (now > announcementTime) {
        announcementTime.setDate(announcementTime.getDate() + 1);
      }

      const timeUntilAnnouncement = announcementTime.getTime() - now.getTime();

      setTimeout(() => {
        toast({
          title: "每日公告",
          description: "渣打好公司 - 感謝您的支持！",
        });
        scheduleAnnouncement(); // Schedule next day's announcement
      }, timeUntilAnnouncement);
    };

    scheduleAnnouncement();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          系統公告
        </CardTitle>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <Bell className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground">載入中...</p>
          ) : announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="border-l-4 border-primary p-4 bg-muted/50 rounded"
              >
                <h3 className="font-semibold text-lg">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {announcement.content}
                </p>
                <time className="text-xs text-muted-foreground block mt-2">
                  {new Date(announcement.date).toLocaleString()}
                </time>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">暫無公告</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

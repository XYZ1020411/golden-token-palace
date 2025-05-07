
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Book, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateNovelChapter } from "@/services/novelService";
import { useNavigate } from "react-router-dom";

interface Chapter {
  id: number;
  title: string;
  content: string;
  date: string;
  isToday: boolean;
}

const DailyNovel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [hasReadToday, setHasReadToday] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Novel background and initial setup
  const novelBackground = "末日前1個月，我重生喚醒系統";

  useEffect(() => {
    // Redirect to MangaFox since the novel system has been migrated
    navigate("/manga-fox");
  }, [navigate]);

  return (
    <MainLayout showBackButton>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">小說系統已遷移至MangaFox</h1>
          </div>
        </div>
        
        <Card className="bg-white dark:bg-gray-950">
          <CardHeader>
            <CardTitle>系統升級通知</CardTitle>
            <CardDescription>小說功能已更新</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              為了提供更好的閱讀體驗，小說系統已經升級並遷移至MangaFox頁面。
              所有漫畫和小說內容現在都可以在MangaFox中瀏覽和閱讀。
            </p>
            <p className="text-muted-foreground">
              您將在3秒後自動轉向到新的MangaFox頁面，或者您可以點擊下方按鈕立即前往。
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/manga-fox")} className="w-full">
              前往MangaFox
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DailyNovel;

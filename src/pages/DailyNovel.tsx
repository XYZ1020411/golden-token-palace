
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DailyNovel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to MangaFox after 3 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/manga-fox");
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <MainLayout showBackButton>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">小說系統已遷移至小說漫畫系統</h1>
          </div>
        </div>
        
        <Card className="bg-white dark:bg-gray-950">
          <CardHeader>
            <CardTitle>系統升級通知</CardTitle>
            <CardDescription>小說功能已更新</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              為了提供更好的閱讀體驗，小說系統已經升級並遷移至小說漫畫頁面。
              所有漫畫和小說內容現在都可以在小說漫畫系統中瀏覽和閱讀。
            </p>
            <p className="text-muted-foreground">
              您將在3秒後自動轉向到新的小說漫畫頁面，或者您可以點擊下方按鈕立即前往。
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/manga-fox")} className="w-full">
              前往小說漫畫系統
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DailyNovel;

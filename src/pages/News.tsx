
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useInfoServices } from "@/context/InfoServicesContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Clock, ExternalLink, ArrowLeft, RefreshCw } from "lucide-react";

const News = () => {
  const { isAuthenticated } = useAuth();
  const { newsItems, fetchNews } = useInfoServices();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleReturn = () => {
    navigate("/dashboard");
  };
  
  const handleRefresh = async () => {
    try {
      const success = await fetchNews();
      if (success) {
        toast({
          title: "新聞已更新",
          description: "已獲取最新新聞資訊",
        });
      } else {
        toast({
          title: "無法獲取最新新聞",
          description: "使用備份新聞資訊",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "更新失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">新聞資訊</h1>
            <p className="text-muted-foreground">最新新聞與資訊</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              更新
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={handleReturn}
            >
              <ArrowLeft className="h-4 w-4" />
              返回儀表板
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {newsItems.length > 0 ? (
            newsItems.map((news) => (
              <Card key={news.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{news.title}</CardTitle>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {new Date(news.date).toLocaleDateString()} · {news.source}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {news.content}
                  </p>
                  {news.url && (
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline mt-4"
                    >
                      閱讀完整新聞
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">暫無新聞，請稍後再試或點擊更新按鈕</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default News;

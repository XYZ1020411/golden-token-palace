
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useInfoServices } from "@/context/InfoServicesContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, ExternalLink } from "lucide-react";

const News = () => {
  const { isAuthenticated } = useAuth();
  const { newsItems } = useInfoServices();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">新聞資訊</h1>
          <p className="text-muted-foreground">最新新聞與資訊</p>
        </div>

        <div className="space-y-6">
          {newsItems.map((news) => (
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
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default News;

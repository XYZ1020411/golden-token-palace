
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsItem } from "@/context/InfoServicesContext";

interface NewsSectionProps {
  newsItems: NewsItem[];
}

const NewsSection = ({ newsItems }: NewsSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>最新消息</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>最新新聞摘要</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.slice(0, 3).map((news) => (
            <div key={news.id} className="space-y-2">
              <h3 className="font-medium">{news.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {news.content}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{new Date(news.date).toLocaleDateString()} · {news.source}</span>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/news")}>
            查看更多新聞
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsSection;

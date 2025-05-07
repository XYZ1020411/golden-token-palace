
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, BookOpen, RefreshCw, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Novel } from "@/types/novel";
import { formatNumber } from "@/utils/novelUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface NovelCardProps {
  novel: Novel;
  onSelect: (novel: Novel) => void;
  onStartReading: (novel: Novel) => void;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel, onSelect, onStartReading }) => {
  const isMobile = useIsMobile();

  // Calculate how recent the update is
  const getUpdateStatus = () => {
    const lastUpdated = new Date(novel.lastUpdated);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}小時前更新`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}天前更新`;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden" onClick={() => onSelect(novel)}>
        <img 
          src={novel.coverImage} 
          alt={novel.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
        />
        {novel.isNew && (
          <Badge className="absolute top-2 right-2 bg-green-500">最新</Badge>
        )}
        {novel.isHot && (
          <Badge className="absolute top-10 right-2 bg-red-500">熱門</Badge>
        )}
        {novel.isManga && (
          <Badge className="absolute top-2 left-2 bg-blue-500">漫畫</Badge>
        )}
      </div>
      <CardHeader className={`${isMobile ? "p-3" : "pb-2"}`}>
        <CardTitle className="cursor-pointer hover:text-primary" onClick={() => onSelect(novel)}>
          {novel.title}
        </CardTitle>
        <CardDescription>{novel.author}</CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? "p-3" : "pb-2"}`}>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline">{novel.type}</Badge>
          {!isMobile && novel.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-500 mr-1" />
            {novel.rating}
          </div>
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            {formatNumber(novel.chapters)}章
          </div>
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <Clock className="h-3 w-3 mr-1" />
          {getUpdateStatus()}
        </div>
      </CardContent>
      <CardFooter className={isMobile ? "p-3 pt-0" : undefined}>
        <Button className="w-full" onClick={() => onStartReading(novel)}>
          開始閱讀
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NovelCard;

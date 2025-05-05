
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, ThumbsUp, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Novel, NovelChapter } from "@/types/novel";
import { formatNumber } from "@/utils/novelUtils";

interface NovelDetailProps {
  novel: Novel;
  chapters: NovelChapter[];
  onStartReading: (novel: Novel) => void;
  onBackToList: () => void;
  onSelectChapter: (chapter: NovelChapter) => void;
}

const NovelDetail: React.FC<NovelDetailProps> = ({
  novel,
  chapters,
  onStartReading,
  onBackToList,
  onSelectChapter
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img 
                  src={novel.coverImage} 
                  alt={novel.title}
                  className="w-full max-w-xs rounded-lg shadow-md object-cover aspect-[3/4]"
                />
                {novel.isNew && (
                  <Badge className="absolute top-2 right-2 bg-green-500">最新</Badge>
                )}
                {novel.isHot && (
                  <Badge className="absolute top-10 right-2 bg-red-500">熱門</Badge>
                )}
              </div>
              <div className="text-center w-full">
                <Button 
                  className="w-full mb-2" 
                  onClick={() => onStartReading(novel)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  開始閱讀
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onBackToList}
                >
                  返回列表
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{novel.title}</CardTitle>
            <CardDescription>作者: {novel.author}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{novel.type}</Badge>
                {novel.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{novel.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{formatNumber(novel.chapters)}章</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(novel.views)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{formatNumber(novel.likes)}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">內容簡介</h3>
                <p className="text-muted-foreground">{novel.summary}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">最近更新</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{novel.lastUpdated}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-4">章節列表</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {chapters.map(chapter => (
                    <Button 
                      key={chapter.id} 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => onSelectChapter(chapter)}
                    >
                      {chapter.title}
                    </Button>
                  ))}
                  <p className="text-sm text-muted-foreground col-span-2 mt-2">
                    本書共{formatNumber(novel.chapters)}章，持續更新中...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NovelDetail;

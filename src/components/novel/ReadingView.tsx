
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookmarkIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Novel, NovelChapter } from "@/types/novel";
import { formatNumber } from "@/utils/novelUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReadingViewProps {
  novel?: Novel;
  chapter: NovelChapter;
  onBackToNovel: () => void;
}

const ReadingView: React.FC<ReadingViewProps> = ({ novel, chapter, onBackToNovel }) => {
  const isMobile = useIsMobile();

  return (
    <Card className="bg-white dark:bg-gray-950">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={onBackToNovel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回目錄
          </Button>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <BookmarkIcon className="h-4 w-4 mr-2" />
              加入書籤
            </Button>
          </div>
        </div>
        <div className="text-center">
          <CardTitle>{chapter.title}</CardTitle>
          {novel && (
            <CardDescription>{novel.title} · {novel.author}</CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`${isMobile ? "h-[50vh]" : "h-[60vh]"} rounded-md p-4`}>
          <div className="prose dark:prose-invert max-w-none">
            {chapter.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className={`mb-4 ${isMobile ? "text-base" : "text-lg"} leading-relaxed`}>{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={true}>
          上一章
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          <p>觀看次數: {formatNumber(chapter.views)}</p>
          <p>發布日期: {chapter.publishDate}</p>
        </div>
        <Button variant="outline" disabled={true}>
          下一章
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReadingView;

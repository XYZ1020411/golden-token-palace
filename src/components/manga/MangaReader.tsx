
import { Novel, NovelChapter } from "@/types/novel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface MangaReaderProps {
  novel?: Novel;
  chapter: NovelChapter;
  onBackToNovel: () => void;
  onNextChapter?: () => void;
  onPreviousChapter?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const MangaReader = ({ 
  novel, 
  chapter, 
  onBackToNovel,
  onNextChapter,
  onPreviousChapter,
  hasNext = false,
  hasPrevious = false
}: MangaReaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={onBackToNovel}
          className="flex items-center gap-1 px-0 hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          返回資訊頁
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {novel?.title} - {chapter.title}
        </div>
        
        <div className="flex gap-2">
          {hasPrevious && onPreviousChapter && (
            <Button variant="outline" size="icon" onClick={onPreviousChapter}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          {hasNext && onNextChapter && (
            <Button variant="outline" size="icon" onClick={onNextChapter}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">{chapter.title}</h1>
        
        <div className="prose prose-lg mx-auto max-w-prose">
          {novel?.isManga ? (
            // Manga viewer with mock images
            <div className="space-y-4">
              {Array(5).fill(null).map((_, index) => (
                <div key={index} className="w-full">
                  <img
                    src={`https://picsum.photos/800/1200?random=${index + 10}`}
                    alt={`Page ${index + 1}`}
                    className="w-full rounded-lg shadow-md mx-auto"
                  />
                </div>
              ))}
            </div>
          ) : (
            // Novel text content
            <div className="whitespace-pre-line">
              {chapter.content}
            </div>
          )}
        </div>
      </Card>
      
      <div className="flex justify-center gap-4 pt-4">
        {hasPrevious && onPreviousChapter && (
          <Button variant="outline" onClick={onPreviousChapter}>
            <ChevronLeft className="h-4 w-4 mr-2" /> 上一章
          </Button>
        )}
        
        {hasNext && onNextChapter && (
          <Button onClick={onNextChapter}>
            下一章 <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MangaReader;

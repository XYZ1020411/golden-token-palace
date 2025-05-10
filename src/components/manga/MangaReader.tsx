
import { useState } from "react";
import { Novel, NovelChapter } from "@/types/novel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize, Minimize, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);

  const toggleFullscreen = (imageSrc: string | null) => {
    setFullscreenImage(imageSrc);
    setShowControls(imageSrc === null);
  };

  return (
    <div className="space-y-6">
      {showControls && (
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={onBackToNovel}
            className="flex items-center gap-1 px-0 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            返回資訊頁
          </Button>
          
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50">TTKan.co</Badge>
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
      )}
      
      <div className="flex justify-end mb-2">
        <a
          href="https://www.ttkan.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 flex items-center gap-1"
        >
          內容來源: TTKan.co <Link2 className="h-3 w-3" />
        </a>
      </div>
      
      {fullscreenImage ? (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => toggleFullscreen(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen(null);
            }}
          >
            <Minimize className="h-6 w-6" />
          </Button>
          <img 
            src={fullscreenImage} 
            alt="Full screen view" 
            className="max-h-screen max-w-screen-xl mx-auto"
          />
        </div>
      ) : (
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">{chapter.title}</h1>
          
          <div className="prose prose-lg mx-auto max-w-prose">
            {novel?.isManga ? (
              // Manga viewer with mock images
              <div className="space-y-4">
                <div className="bg-blue-50 rounded p-3 mb-6 text-sm text-center">
                  此内容來自TTKan.co，版權歸原作者所有
                </div>
                {Array(5).fill(null).map((_, index) => (
                  <div key={index} className="w-full">
                    <div className="relative group">
                      <img
                        src={`https://picsum.photos/800/1200?random=${index + 10}`}
                        alt={`Page ${index + 1}`}
                        className="w-full rounded-lg shadow-md mx-auto cursor-pointer"
                        onClick={() => toggleFullscreen(`https://picsum.photos/800/1200?random=${index + 10}`)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullscreen(`https://picsum.photos/800/1200?random=${index + 10}`);
                        }}
                      >
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Novel text content
              <>
                <div className="bg-blue-50 rounded p-3 mb-6 text-sm text-center">
                  此内容來自TTKan.co，版權歸原作者所有
                </div>
                <div className="whitespace-pre-line">
                  {chapter.content}
                </div>
              </>
            )}
          </div>
        </Card>
      )}
      
      {showControls && (
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
      )}
    </div>
  );
};

export default MangaReader;

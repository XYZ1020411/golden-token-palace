
import { useState } from "react";
import { Novel } from "@/types/novel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Clock } from "lucide-react";

interface MangaListProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onStartReading: (novel: Novel) => void;
}

const MangaList = ({ novels, onSelectNovel, onStartReading }: MangaListProps) => {
  if (novels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-xl font-medium text-muted-foreground mb-2">沒有找到小說/漫畫</p>
        <p className="text-muted-foreground">請嘗試其他搜索條件</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {novels.map((novel) => (
        <Card 
          key={novel.id} 
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectNovel(novel)}
        >
          <div className="relative pb-[140%]">
            <img 
              src={novel.coverImage} 
              alt={novel.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            
            {novel.isNew && (
              <Badge className="absolute top-2 right-2 bg-blue-500">NEW</Badge>
            )}
            
            {novel.isHot && (
              <Badge className="absolute top-2 left-2 bg-red-500">HOT</Badge>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white">
              <h3 className="font-bold text-sm line-clamp-2">{novel.title}</h3>
              <div className="flex items-center text-xs mt-1 text-gray-200">
                <Star className="h-3 w-3 mr-1" />
                <span>{novel.rating}</span>
                <Eye className="h-3 w-3 ml-2 mr-1" />
                <span>{novel.views}</span>
              </div>
            </div>
            
            <div 
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onStartReading(novel);
              }}
            >
              <button className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                {novel.isManga ? "開始閱讀" : "開始閱讀"}
              </button>
            </div>
          </div>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground truncate">{novel.author}</p>
            <div className="flex items-center justify-between mt-1">
              <Badge variant="outline" className="text-xs">{novel.type}</Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{new Date(novel.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MangaList;

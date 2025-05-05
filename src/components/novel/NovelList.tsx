
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NovelCard from "./NovelCard";
import { Novel } from "@/types/novel";

interface NovelListProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onStartReading: (novel: Novel) => void;
}

const NovelList: React.FC<NovelListProps> = ({ novels, onSelectNovel, onStartReading }) => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4 flex-wrap">
        <TabsTrigger value="all">全部</TabsTrigger>
        <TabsTrigger value="featured">精選</TabsTrigger>
        <TabsTrigger value="new">最新</TabsTrigger>
        <TabsTrigger value="hot">熱門</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {novels.map((novel) => (
            <NovelCard 
              key={novel.id} 
              novel={novel} 
              onSelect={onSelectNovel} 
              onStartReading={onStartReading}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="featured" className="mt-0">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {novels
            .filter(novel => novel.isFeatured)
            .map((novel) => (
              <NovelCard 
                key={novel.id} 
                novel={novel} 
                onSelect={onSelectNovel} 
                onStartReading={onStartReading}
              />
            ))}
        </div>
      </TabsContent>
      
      <TabsContent value="new" className="mt-0">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {novels
            .filter(novel => novel.isNew)
            .map((novel) => (
              <NovelCard 
                key={novel.id} 
                novel={novel} 
                onSelect={onSelectNovel} 
                onStartReading={onStartReading}
              />
            ))}
        </div>
      </TabsContent>
      
      <TabsContent value="hot" className="mt-0">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {novels
            .filter(novel => novel.isHot)
            .map((novel) => (
              <NovelCard 
                key={novel.id} 
                novel={novel} 
                onSelect={onSelectNovel}
                onStartReading={onStartReading}
              />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default NovelList;

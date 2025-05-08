
import { Novel, NovelChapter } from "@/types/novel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowLeft, 
  BookOpen, 
  Star, 
  Eye, 
  ThumbsUp, 
  Clock, 
  Calendar 
} from "lucide-react";

interface MangaDetailProps {
  novel: Novel;
  chapters: NovelChapter[];
  onBackToList: () => void;
  onSelectChapter: (chapter: NovelChapter) => void;
  onStartReading: (novel: Novel) => void;
}

const MangaDetail = ({ 
  novel, 
  chapters, 
  onBackToList, 
  onSelectChapter,
  onStartReading
}: MangaDetailProps) => {
  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBackToList} 
        className="flex items-center gap-1 px-0 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        返回列表
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
          <img 
            src={novel.coverImage} 
            alt={novel.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {novel.isNew && <Badge className="bg-blue-500">NEW</Badge>}
            {novel.isHot && <Badge className="bg-red-500">HOT</Badge>}
            {novel.isFeatured && <Badge className="bg-purple-500">精選</Badge>}
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold">{novel.title}</h1>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{novel.type}</Badge>
            {novel.tags.map((tag, i) => (
              <Badge key={i} variant="secondary">{tag}</Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-2 border rounded-lg">
              <Star className="h-5 w-5 text-yellow-500 mb-1" />
              <span className="text-sm text-muted-foreground">評分</span>
              <span className="font-bold">{novel.rating}</span>
            </div>
            <div className="flex flex-col items-center p-2 border rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-sm text-muted-foreground">章節</span>
              <span className="font-bold">{novel.chapters}</span>
            </div>
            <div className="flex flex-col items-center p-2 border rounded-lg">
              <Eye className="h-5 w-5 text-purple-500 mb-1" />
              <span className="text-sm text-muted-foreground">閱讀</span>
              <span className="font-bold">{novel.views.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center p-2 border rounded-lg">
              <ThumbsUp className="h-5 w-5 text-red-500 mb-1" />
              <span className="text-sm text-muted-foreground">讚</span>
              <span className="font-bold">{novel.likes.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>作者: {novel.author}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>更新: {new Date(novel.lastUpdated).toLocaleDateString()}</span>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">簡介</h3>
            <p className="text-muted-foreground whitespace-pre-line">{novel.summary}</p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={() => onStartReading(novel)}>
              開始閱讀
            </Button>
            <Button variant="outline">加入收藏</Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>章節列表</CardTitle>
          <CardDescription>共 {chapters.length} 章</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {chapters.map((chapter) => (
              <Button 
                key={chapter.id}
                variant="outline"
                className="justify-start overflow-hidden"
                onClick={() => onSelectChapter(chapter)}
              >
                <span className="truncate">{chapter.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MangaDetail;

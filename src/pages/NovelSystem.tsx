
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, BookOpen, BookmarkIcon, Star, ThumbsUp, Clock, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Novel {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  tags: string[];
  rating: number;
  chapters: number;
  views: number;
  likes: number;
  summary: string;
  lastUpdated: string;
  isNew: boolean;
  isHot: boolean;
  isFeatured: boolean;
}

interface NovelChapter {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  views: number;
}

const mockNovels: Novel[] = [
  {
    id: "1",
    title: "仙劍奇俠傳：雲海浮華",
    author: "軒轅劍",
    coverImage: "https://source.unsplash.com/random/300x400/?fantasy",
    tags: ["仙俠", "奇幻", "武俠"],
    rating: 4.8,
    chapters: 120,
    views: 564892,
    likes: 45328,
    summary: "六界風雲變幻，天下英雄薈萃。一名普通少年因機緣巧合得到上古神劍，從此踏上修仙之路，在危機四伏的世界中逐漸成長，最終成為守護世界和平的強者。",
    lastUpdated: "2025-04-30",
    isNew: false,
    isHot: true,
    isFeatured: true
  },
  {
    id: "2",
    title: "霧雨江南：都市修真",
    author: "夢溪筆談",
    coverImage: "https://source.unsplash.com/random/300x400/?city,night",
    tags: ["都市", "修真", "都市異能"],
    rating: 4.6,
    chapters: 245,
    views: 423651,
    likes: 32541,
    summary: "在繁華都市中隱藏著無數不為人知的秘密。年輕醫生林風意外獲得古老醫術傳承，能夠看到常人無法看到的事物，從此踏上驚險刺激的都市修真之旅。",
    lastUpdated: "2025-05-01",
    isNew: false,
    isHot: true,
    isFeatured: false
  },
  {
    id: "3",
    title: "星際漫遊：2199",
    author: "銀河使者",
    coverImage: "https://source.unsplash.com/random/300x400/?space",
    tags: ["科幻", "未來", "星際"],
    rating: 4.5,
    chapters: 78,
    views: 305687,
    likes: 24789,
    summary: "2199年，人類已經殖民多個星系。當一支神秘外星艦隊出現在太陽系邊緣，年輕艦長林宇和他的船員必須面對人類有史以來最大的威脅。",
    lastUpdated: "2025-05-02",
    isNew: true,
    isHot: false,
    isFeatured: true
  },
  {
    id: "4",
    title: "獵魔傳說",
    author: "暗夜獵手",
    coverImage: "https://source.unsplash.com/random/300x400/?dark,forest",
    tags: ["玄幻", "獵魔", "冒險"],
    rating: 4.7,
    chapters: 156,
    views: 387452,
    likes: 29874,
    summary: "在一個魔物肆虐的世界中，獵魔人艾爾文憑藉祖傳的獵魔技藝和智慧，與各種強大的魔物周旋。在獵殺魔物的過程中，他逐漸揭開了魔物出現背後的驚天陰謀。",
    lastUpdated: "2025-05-03",
    isNew: true,
    isHot: true,
    isFeatured: false
  },
  {
    id: "5",
    title: "龍與魔法師",
    author: "法師協會",
    coverImage: "https://source.unsplash.com/random/300x400/?dragon",
    tags: ["魔法", "奇幻", "冒險"],
    rating: 4.4,
    chapters: 92,
    views: 254789,
    likes: 18965,
    summary: "少年安德魯在一次意外中發現自己擁有罕見的龍語魔法天賦，能夠與傳說中的龍族溝通。在魔法師學院的學習過程中，他發現了一個關於龍族滅絕的驚人秘密。",
    lastUpdated: "2025-05-01",
    isNew: false,
    isHot: false,
    isFeatured: true
  },
];

const mockChapters: NovelChapter[] = [
  {
    id: "1-1",
    title: "第一章：神秘的劍客",
    content: "山間霧氣繚繞，一名背負長劍的神秘人影緩步而行。他的步伐輕盈，仿佛與山林融為一體。這位年輕的劍客名叫李沉，出身於江湖中赫赫有名的青雲劍派，卻因為一場陰謀被逐出師門。\n\n如今的他，獨自游走於各大門派之間，尋找著當年真相。山路崎嶇，李沉順著小徑來到了一座古老的村莊——霧隱村。這裡常年被濃霧籠罩，據說隱藏著不少武林秘辛。\n\n「客官，獨自上山可要小心啊。」村口的老者提醒道，「最近山上出現了不少怪事。」\n\n李沉微微一笑，拱手致謝：「多謝提醒，老丈。不知可有客棧借宿？」\n\n「往前走，有家醉仙樓，是這附近最好的客棧了。」老者指了指前方。\n\n李沉點頭致謝，朝醉仙樓走去。就在此時，遠處傳來一陣打斗聲，李沉眉頭一皺，手按劍柄，迅速朝聲音來源處奔去...",
    publishDate: "2025-04-01",
    views: 45628
  },
  {
    id: "1-2",
    title: "第二章：醉仙樓風波",
    content: "醉仙樓內，觥籌交錯，熙熙攘攘的人群中，各種江湖傳言此起彼伏。\n\n李沉坐在角落，靜靜地品著一杯清酒，耳朵卻敏銳地捕捉著周圍的對話。最近，關於一把傳說中的神劍「天衛」的消息格外引人注目。據說，誰能得到這把劍，誰就能成為武林至尊。\n\n「聽說青雲劍派的掌門已經派出多名高手尋找天衛劍了。」一位豪客喝得滿臉通紅，大聲說道。\n\n李沉的手微微一顫，青雲劍派——那個曾視為家的地方，如今卻是他最不願提及的痛。\n\n就在此時，門外傳來一陣喧嘩，一群黑衣人魚貫而入，為首的是一位面色陰冷的中年男子。\n\n「聽說有人在尋找天衛劍？」中年人環顧四周，目光最終落在了李沉身上，「哦？這不是青雲劍派被逐出的叛徒李沉嗎？」\n\n整個酒樓瞬間安靜下來，所有人的目光都聚焦在了李沉身上。李沉緩緩放下酒杯，站起身來，「葉師兄，好久不見。」\n\n「別叫我師兄，叛徒！」葉霜劍眼中閃過一絲寒光，「師父已經下令，見你即殺！」\n\n話音未落，葉霜劍已經拔劍而出，直刺李沉咽喉！",
    publishDate: "2025-04-05",
    views: 42156
  },
];

const NovelSystem = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<NovelChapter | null>(null);
  const [readingMode, setReadingMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>(mockNovels);
  
  // Filter novels based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = mockNovels.filter(
        novel => novel.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                novel.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                novel.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredNovels(filtered);
    } else {
      setFilteredNovels(mockNovels);
    }
  }, [searchTerm]);
  
  const handleSelectNovel = (novel: Novel) => {
    setSelectedNovel(novel);
    setReadingMode(false);
    setSelectedChapter(null);
  };
  
  const handleStartReading = (novel: Novel) => {
    setSelectedNovel(novel);
    setSelectedChapter(mockChapters[0]);
    setReadingMode(true);
  };
  
  const handleSelectChapter = (chapter: NovelChapter) => {
    setSelectedChapter(chapter);
    setReadingMode(true);
  };
  
  const handleBackToList = () => {
    setSelectedNovel(null);
    setSelectedChapter(null);
    setReadingMode(false);
  };
  
  const handleBackToNovel = () => {
    setReadingMode(false);
    setSelectedChapter(null);
  };
  
  // Format number for display
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '萬';
    }
    return num.toString();
  };

  return (
    <MainLayout showBackButton>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">小說系統</h1>
          </div>
        </div>

        {readingMode && selectedChapter ? (
          // Reading mode - display chapter content
          <Card className="bg-white dark:bg-gray-950">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={handleBackToNovel}>
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
                <CardTitle>{selectedChapter.title}</CardTitle>
                {selectedNovel && (
                  <CardDescription>{selectedNovel.title} · {selectedNovel.author}</CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] rounded-md p-4">
                <div className="prose dark:prose-invert max-w-none">
                  {selectedChapter.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled={selectedChapter.id === mockChapters[0].id}>
                上一章
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <p>觀看次數: {formatNumber(selectedChapter.views)}</p>
                <p>發布日期: {selectedChapter.publishDate}</p>
              </div>
              <Button variant="outline" disabled={selectedChapter.id === mockChapters[mockChapters.length - 1].id}>
                下一章
              </Button>
            </CardFooter>
          </Card>
        ) : selectedNovel ? (
          // Novel detail view
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img 
                        src={selectedNovel.coverImage} 
                        alt={selectedNovel.title}
                        className="w-full max-w-xs rounded-lg shadow-md object-cover aspect-[3/4]"
                      />
                      {selectedNovel.isNew && (
                        <Badge className="absolute top-2 right-2 bg-green-500">最新</Badge>
                      )}
                      {selectedNovel.isHot && (
                        <Badge className="absolute top-10 right-2 bg-red-500">熱門</Badge>
                      )}
                    </div>
                    <div className="text-center">
                      <Button 
                        className="w-full mb-2" 
                        onClick={() => handleStartReading(selectedNovel)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        開始閱讀
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleBackToList}
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
                  <CardTitle>{selectedNovel.title}</CardTitle>
                  <CardDescription>作者: {selectedNovel.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedNovel.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{selectedNovel.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{selectedNovel.chapters}章</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(selectedNovel.views)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{formatNumber(selectedNovel.likes)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">內容簡介</h3>
                      <p className="text-muted-foreground">{selectedNovel.summary}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">最近更新</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{selectedNovel.lastUpdated}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">章節列表</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mockChapters.map(chapter => (
                          <Button 
                            key={chapter.id} 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleSelectChapter(chapter)}
                          >
                            {chapter.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Novel list view
          <>
            <div className="mb-4">
              <Input 
                placeholder="搜尋小說名稱、作者或標籤..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="featured">精選</TabsTrigger>
                <TabsTrigger value="new">最新</TabsTrigger>
                <TabsTrigger value="hot">熱門</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredNovels.map((novel) => (
                    <Card key={novel.id} className="overflow-hidden">
                      <div className="relative aspect-[3/4] overflow-hidden" onClick={() => handleSelectNovel(novel)}>
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
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="cursor-pointer hover:text-primary" onClick={() => handleSelectNovel(novel)}>
                          {novel.title}
                        </CardTitle>
                        <CardDescription>{novel.author}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {novel.tags.map(tag => (
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
                            {novel.chapters}章
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleStartReading(novel)}>
                          開始閱讀
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="featured" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredNovels
                    .filter(novel => novel.isFeatured)
                    .map((novel) => (
                      <Card key={novel.id} className="overflow-hidden">
                        <div className="relative aspect-[3/4] overflow-hidden" onClick={() => handleSelectNovel(novel)}>
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
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="cursor-pointer hover:text-primary" onClick={() => handleSelectNovel(novel)}>
                            {novel.title}
                          </CardTitle>
                          <CardDescription>{novel.author}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {novel.tags.map(tag => (
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
                              {novel.chapters}章
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => handleStartReading(novel)}>
                            開始閱讀
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="new" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredNovels
                    .filter(novel => novel.isNew)
                    .map((novel) => (
                      <Card key={novel.id} className="overflow-hidden">
                        <div className="relative aspect-[3/4] overflow-hidden" onClick={() => handleSelectNovel(novel)}>
                          <img 
                            src={novel.coverImage} 
                            alt={novel.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                          />
                          <Badge className="absolute top-2 right-2 bg-green-500">最新</Badge>
                          {novel.isHot && (
                            <Badge className="absolute top-10 right-2 bg-red-500">熱門</Badge>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="cursor-pointer hover:text-primary" onClick={() => handleSelectNovel(novel)}>
                            {novel.title}
                          </CardTitle>
                          <CardDescription>{novel.author}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {novel.tags.map(tag => (
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
                              {novel.chapters}章
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => handleStartReading(novel)}>
                            開始閱讀
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="hot" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredNovels
                    .filter(novel => novel.isHot)
                    .map((novel) => (
                      <Card key={novel.id} className="overflow-hidden">
                        <div className="relative aspect-[3/4] overflow-hidden" onClick={() => handleSelectNovel(novel)}>
                          <img 
                            src={novel.coverImage} 
                            alt={novel.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                          />
                          {novel.isNew && (
                            <Badge className="absolute top-2 right-2 bg-green-500">最新</Badge>
                          )}
                          <Badge className="absolute top-10 right-2 bg-red-500">熱門</Badge>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="cursor-pointer hover:text-primary" onClick={() => handleSelectNovel(novel)}>
                            {novel.title}
                          </CardTitle>
                          <CardDescription>{novel.author}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {novel.tags.map(tag => (
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
                              {novel.chapters}章
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => handleStartReading(novel)}>
                            開始閱讀
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default NovelSystem;

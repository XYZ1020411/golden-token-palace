
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LinkIcon, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Novel, NovelChapter } from "@/types/novel";
import { mockNovels, mockChapters } from "@/data/mockNovelsData";
import { checkMaintenanceTime, isAdminUser, connectToWordPress, searchMangaOnGoogle, importNovelFromGoogle } from "@/utils/novelUtils";
import MaintenanceNotice from "@/components/maintenance/MaintenanceNotice";
import NovelFilter from "@/components/novel/NovelFilter";
import NovelList from "@/components/novel/NovelList";
import NovelDetail from "@/components/novel/NovelDetail";
import ReadingView from "@/components/novel/ReadingView";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MangaFox = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<NovelChapter | null>(null);
  const [readingMode, setReadingMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [novelsList, setNovelsList] = useState<Novel[]>(mockNovels);
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>(mockNovels);
  const [novelTypes, setNovelTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  const [showWordPressDialog, setShowWordPressDialog] = useState(false);
  const [wordpressUrl, setWordpressUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isAdmin = isAdminUser(user?.role);
  
  // Extract all novel types
  useEffect(() => {
    const types = Array.from(new Set(novelsList.map(novel => novel.type)));
    setNovelTypes(types);
  }, [novelsList]);
  
  // Check maintenance time - updated to 6PM-8PM daily
  useEffect(() => {
    const checkMaintenanceSchedule = () => {
      setIsInMaintenance(checkMaintenanceTime());
    };
    
    checkMaintenanceSchedule();
    const interval = setInterval(checkMaintenanceSchedule, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Redirect to login if user is not authenticated and in maintenance (except admins)
  useEffect(() => {
    if (isInMaintenance && !isAuthenticated && !isAdmin) {
      navigate("/login");
    }
  }, [isInMaintenance, isAuthenticated, isAdmin, navigate]);

  // Set up realtime subscription for admin content changes
  useEffect(() => {
    // Create a channel for listening to manga data changes
    const channel = supabase
      .channel('manga-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'manga' 
        },
        (payload) => {
          toast({
            title: "同步更新",
            description: "管理員已更新漫畫資料，系統已自動同步",
          });
          
          // Refresh the manga list
          handleSyncFromServer();
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Filter novels based on search term and selected type
  useEffect(() => {
    let filtered = novelsList;
    
    if (searchTerm) {
      filtered = filtered.filter(
        novel => novel.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                novel.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                novel.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedType) {
      filtered = filtered.filter(novel => novel.type === selectedType);
    }
    
    setFilteredNovels(filtered);
  }, [searchTerm, selectedType, novelsList]);

  // Sync content from server
  const handleSyncFromServer = async () => {
    setIsRefreshing(true);
    try {
      // In a real implementation, this would fetch data from Supabase
      // For now, we'll simulate a server call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate getting updated data
      const updatedNovels = [...mockNovels];
      
      // Add a new manga to simulate updates
      const randomId = Math.random().toString(36).substring(2, 10);
      updatedNovels.unshift({
        id: randomId,
        title: `New Manga ${randomId.substring(0, 4)}`,
        author: "Server Sync",
        coverImage: `https://picsum.photos/400/600?random=${randomId}`,
        tags: ["漫畫", "同步更新"],
        rating: 4.5,
        chapters: Math.floor(Math.random() * 50) + 1,
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        summary: "這是一個從伺服器同步的新漫畫。",
        lastUpdated: new Date().toISOString(),
        isNew: true,
        isHot: Math.random() > 0.5,
        isFeatured: false,
        type: "漫畫",
        isManga: true
      });
      
      setNovelsList(updatedNovels);
      
      toast({
        title: "同步成功",
        description: "已從伺服器同步最新漫畫資料",
      });
    } catch (error) {
      toast({
        title: "同步失敗",
        description: `無法從伺服器同步資料: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
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

  const handleAddNovel = (novel: Novel) => {
    setNovelsList(prev => [novel, ...prev]);
  };

  const handleConnectToWordPress = async () => {
    if (!wordpressUrl) {
      toast({
        title: "請輸入WordPress網址",
        description: "WordPress網址不能為空",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      const result = await connectToWordPress(wordpressUrl);
      
      if (result.success) {
        toast({
          title: "連接成功!",
          description: result.message,
        });
        setShowWordPressDialog(false);
      } else {
        toast({
          title: "連接失敗",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "連接錯誤",
        description: `發生錯誤: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // If in maintenance mode and not admin, show maintenance notice
  if (isInMaintenance && !isAdmin) {
    return (
      <MainLayout showBackButton>
        <MaintenanceNotice featureName="MangaFox" />
      </MainLayout>
    );
  }

  return (
    <MainLayout showBackButton>
      {isInMaintenance && isAdmin && <MaintenanceNotice featureName="MangaFox" isAdmin />}
      
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">MangaFox</h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSyncFromServer}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '同步中...' : '同步更新'}
            </Button>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => setShowWordPressDialog(true)}
                className="flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                連接WordPress
              </Button>
            )}
          </div>
        </div>

        {readingMode && selectedChapter ? (
          // Reading mode
          <ReadingView 
            novel={selectedNovel || undefined} 
            chapter={selectedChapter} 
            onBackToNovel={handleBackToNovel} 
          />
        ) : selectedNovel ? (
          // Novel detail view
          <NovelDetail 
            novel={selectedNovel}
            chapters={mockChapters}
            onStartReading={handleStartReading}
            onBackToList={handleBackToList}
            onSelectChapter={handleSelectChapter}
          />
        ) : (
          // Novel list view
          <>
            <NovelFilter 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              novelTypes={novelTypes}
              isMobile={isMobile}
              onAddNovel={handleAddNovel}
            />
            
            <NovelList 
              novels={filteredNovels} 
              onSelectNovel={handleSelectNovel}
              onStartReading={handleStartReading}
            />
          </>
        )}
      </div>

      {/* WordPress連接對話框 */}
      <Dialog open={showWordPressDialog} onOpenChange={setShowWordPressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>連接到WordPress</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="wpUrl">WordPress網址</Label>
            <Input 
              id="wpUrl" 
              value={wordpressUrl} 
              onChange={e => setWordpressUrl(e.target.value)} 
              placeholder="https://yoursite.wordpress.com"
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              輸入您的WordPress網站URL，系統將會自動連接並同步內容。
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWordPressDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConnectToWordPress} disabled={isConnecting}>
              {isConnecting ? "連接中..." : "連接"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MangaFox;

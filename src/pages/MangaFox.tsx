
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LinkIcon, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Novel, NovelChapter } from "@/types/novel";
import { mockNovels, mockChapters } from "@/data/mockNovelsData";
import { checkMaintenanceTime, isAdminUser } from "@/utils/novelUtils";
import { fetchNovelsFromTTKan, setupTTKanSyncListener, fetchNovelChaptersFromTTKan } from "@/services/ttkanService";
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
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [ttkanUrl, setTtkanUrl] = useState("https://www.ttkan.co");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [chapters, setChapters] = useState<NovelChapter[]>([]);
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

  // Initial data load and TTKan sync setup
  useEffect(() => {
    // Only do initial fetch if not in maintenance or if user is admin
    if (!isInMaintenance || (isAuthenticated && isAdmin)) {
      if (isFirstLoad) {
        handleSyncFromTTKan();
        setIsFirstLoad(false);
      }

      // Set up TTKan sync listener
      const cleanupListener = setupTTKanSyncListener((updatedNovels) => {
        setNovelsList(prevNovels => {
          // Only update if we got new novels
          if (updatedNovels && updatedNovels.length > 0) {
            toast({
              title: "同步成功",
              description: `已從TTKan同步最新小說資料 (${updatedNovels.length}本)`
            });
            return updatedNovels;
          }
          return prevNovels;
        });
      });

      // Set up realtime subscription for content changes
      const channel = supabase
        .channel('content-updates')
        .on(
          'postgres_changes',
          { 
            event: '*',
            schema: 'public',
            table: 'customer_support' 
          },
          (payload) => {
            try {
              if (payload.eventType === 'INSERT') {
                const notification = payload.new;
                
                if (notification.message && 
                   (notification.message.includes('漫畫') || 
                    notification.message.includes('小說') || 
                    notification.message.includes('TTKan'))) {
                  toast({
                    title: "內容已更新",
                    description: `系統已更新內容，正在同步最新資料`,
                  });
                  
                  // Automatically sync content when changes are detected
                  handleSyncFromTTKan();
                }
              }
            } catch (err) {
              console.error("Error processing realtime update:", err);
            }
          }
        )
        .subscribe();

      return () => {
        cleanupListener();
        supabase.removeChannel(channel);
      };
    }
  }, [isInMaintenance, isAuthenticated, isAdmin, isFirstLoad]);
  
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

  // Load chapters when a novel is selected
  useEffect(() => {
    if (selectedNovel && !readingMode) {
      const loadChapters = async () => {
        try {
          const novelChapters = await fetchNovelChaptersFromTTKan(selectedNovel.id);
          setChapters(novelChapters);
        } catch (error) {
          console.error("無法載入章節:", error);
          toast({
            title: "載入失敗",
            description: "無法從TTKan載入章節，使用本地章節",
            variant: "destructive"
          });
          setChapters(mockChapters);
        }
      };
      
      loadChapters();
    }
  }, [selectedNovel, readingMode]);

  // Sync content from TTKan
  const handleSyncFromTTKan = async () => {
    setIsRefreshing(true);
    try {
      const ttkanNovels = await fetchNovelsFromTTKan();
      
      if (ttkanNovels && ttkanNovels.length > 0) {
        setNovelsList(ttkanNovels);
        
        toast({
          title: "同步成功",
          description: `已從TTKan同步最新小說/漫畫資料 (${ttkanNovels.length}本)`,
        });
        
        // Notify admin about the sync
        try {
          await supabase
            .from('customer_support')
            .insert([{
              message: `小說/漫畫資料已同步：從TTKan同步了 ${ttkanNovels.length} 本內容`,
              user_id: (await supabase.auth.getUser()).data.user?.id || 'system'
            }]);
        } catch (error) {
          console.error("無法發送同步通知:", error);
        }
      } else {
        toast({
          title: "同步提示",
          description: "沒有發現新的內容更新"
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      
      toast({
        title: "同步失敗",
        description: `無法從TTKan同步資料: ${error}`,
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
    if (chapters && chapters.length > 0) {
      setSelectedChapter(chapters[0]);
    } else {
      setSelectedChapter(mockChapters[0]);
    }
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

  const handleAddNovel = async (novel: Novel) => {
    // Add to local state first for immediate feedback
    setNovelsList(prev => [novel, ...prev]);
    
    try {
      // Notify admin about the new novel
      await supabase
        .from('customer_support')
        .insert([{
          message: `新增小說/漫畫: ${novel.title}`,
          user_id: (await supabase.auth.getUser()).data.user?.id || 'system'
        }]);
        
    } catch (error) {
      console.error("Error adding novel:", error);
    }
  };

  const handleConnectToTTKan = async () => {
    if (!ttkanUrl) {
      toast({
        title: "請輸入TTKan網址",
        description: "TTKan網址不能為空",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Here we would normally validate the connection with real API
      // For now, just simulate a connection and trigger the sync
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "連接成功!",
        description: `已成功連接到TTKan網站，正在同步數據...`,
      });
      
      // Trigger a sync after connecting
      await handleSyncFromTTKan();
      
      setShowConnectionDialog(false);
    } catch (error) {
      toast({
        title: "連接失敗",
        description: `無法連接到TTKan: ${error}`,
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
            <h1 className="text-3xl font-bold tracking-tight">小說漫畫系統</h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSyncFromTTKan}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '同步中...' : '從TTKan同步'}
            </Button>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => setShowConnectionDialog(true)}
                className="flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                連接TTKan
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
            chapters={chapters.length > 0 ? chapters : mockChapters}
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
              onSyncContent={handleSyncFromTTKan}
              isSyncing={isRefreshing}
            />
            
            <NovelList 
              novels={filteredNovels} 
              onSelectNovel={handleSelectNovel}
              onStartReading={handleStartReading}
            />
          </>
        )}
      </div>

      {/* TTKan連接對話框 */}
      <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>連接到TTKan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="ttkanUrl">TTKan網址</Label>
            <Input 
              id="ttkanUrl" 
              value={ttkanUrl} 
              onChange={e => setTtkanUrl(e.target.value)} 
              placeholder="https://www.ttkan.co"
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              輸入TTKan網站URL，系統將會自動連接並同步內容。
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectionDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConnectToTTKan} disabled={isConnecting}>
              {isConnecting ? "連接中..." : "連接"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MangaFox;

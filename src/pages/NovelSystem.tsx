
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Novel, NovelChapter } from "@/types/novel";
import { mockNovels, mockChapters } from "@/data/mockNovelsData";
import { checkMaintenanceTime } from "@/utils/novelUtils";
import MaintenanceNotice from "@/components/maintenance/MaintenanceNotice";
import NovelFilter from "@/components/novel/NovelFilter";
import NovelList from "@/components/novel/NovelList";
import NovelDetail from "@/components/novel/NovelDetail";
import ReadingView from "@/components/novel/ReadingView";

const NovelSystem = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<NovelChapter | null>(null);
  const [readingMode, setReadingMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>(mockNovels);
  const [novelTypes, setNovelTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  const isMobile = useIsMobile();
  
  // Extract all novel types
  useEffect(() => {
    const types = Array.from(new Set(mockNovels.map(novel => novel.type)));
    setNovelTypes(types);
  }, []);
  
  // Check maintenance time - updated to 6PM-8PM daily
  useEffect(() => {
    const checkMaintenanceSchedule = () => {
      setIsInMaintenance(checkMaintenanceTime());
    };
    
    checkMaintenanceSchedule();
    const interval = setInterval(checkMaintenanceSchedule, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Filter novels based on search term and selected type
  useEffect(() => {
    let filtered = mockNovels;
    
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
  }, [searchTerm, selectedType]);
  
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

  return (
    <MainLayout showBackButton>
      {isInMaintenance ? (
        <MaintenanceNotice featureName="小說系統" />
      ) : (
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
              />
              
              <NovelList 
                novels={filteredNovels} 
                onSelectNovel={handleSelectNovel}
                onStartReading={handleStartReading}
              />
            </>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default NovelSystem;

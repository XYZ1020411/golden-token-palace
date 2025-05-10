
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Plus, RefreshCw, Filter, ExternalLink } from "lucide-react";
import { Novel } from "@/types/novel";
import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MangaFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  novelTypes: string[];
  isMobile: boolean;
  onAddNovel?: (novel: Novel) => void;
  onSyncContent: () => void;
  isSyncing: boolean;
  isAdmin?: boolean;
  showOnlyManga?: boolean;
  onShowMangaChange?: (value: boolean) => void;
}

const MangaFilter = ({ 
  searchTerm, 
  onSearchChange, 
  selectedType, 
  onTypeChange, 
  novelTypes,
  isMobile,
  onAddNovel,
  onSyncContent,
  isSyncing,
  isAdmin = false,
  showOnlyManga = false,
  onShowMangaChange
}: MangaFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">資料來源:</span>
          <a 
            href="https://openlibrary.org/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            Open Library <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索作品名稱、作者或標籤"
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="全部分類" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>分類</SelectLabel>
                <SelectItem value="all">全部分類</SelectItem>
                {novelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {onShowMangaChange && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">進階篩選</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="manga-only" 
                      checked={showOnlyManga}
                      onCheckedChange={(checked) => {
                        onShowMangaChange(checked === true);
                      }}
                    />
                    <Label htmlFor="manga-only">僅顯示漫畫</Label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          <Button 
            variant="outline" 
            onClick={onSyncContent}
            disabled={isSyncing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isMobile ? '' : (isSyncing ? '同步中' : '從OpenLibrary同步')}
          </Button>
          
          {isAdmin && onAddNovel && (
            <Button 
              variant="default"
              onClick={() => onAddNovel({
                id: `new-${Date.now()}`,
                title: "新作品",
                author: "未知作者",
                coverImage: `https://picsum.photos/400/600?random=${Math.random()}`,
                tags: ["新作"],
                rating: 0,
                chapters: 0,
                views: 0,
                likes: 0,
                summary: "",
                lastUpdated: new Date().toISOString(),
                isNew: true,
                isHot: false,
                isFeatured: false,
                type: "小說",
                isManga: false
              })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {isMobile ? '' : '新增作品'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaFilter;


import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { searchMangaOnGoogle } from "@/utils/novelUtils";

interface NovelFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  novelTypes: string[];
  isMobile: boolean;
}

const NovelFilter: React.FC<NovelFilterProps> = ({ 
  searchTerm, 
  onSearchChange, 
  selectedType, 
  onTypeChange, 
  novelTypes,
  isMobile
}) => {
  const handleGoogleSearch = () => {
    searchMangaOnGoogle(searchTerm);
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/2">
          <Input 
            placeholder="搜尋小說名稱、作者或標籤..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/3">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="選擇小說類型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部類型</SelectItem>
              {novelTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleGoogleSearch}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          在Google搜尋漫畫
        </Button>
      </div>
      {searchTerm && (
        <p className="text-sm text-muted-foreground">
          找不到想看的漫畫？點擊「在Google搜尋漫畫」按鈕在Google上尋找更多結果。
        </p>
      )}
    </div>
  );
};

export default NovelFilter;

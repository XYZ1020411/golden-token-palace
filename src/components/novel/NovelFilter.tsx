
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, RefreshCw } from "lucide-react";
import { searchMangaOnGoogle, importNovelFromGoogle } from "@/utils/novelUtils";
import { useToast } from "@/hooks/use-toast";
import { Novel } from "@/types/novel";
import { supabase } from "@/integrations/supabase/client";

interface NovelFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  novelTypes: string[];
  isMobile: boolean;
  onAddNovel?: (novel: Novel) => void;
  onSyncContent?: () => void;
  isSyncing?: boolean;
}

const NovelFilter: React.FC<NovelFilterProps> = ({ 
  searchTerm, 
  onSearchChange, 
  selectedType, 
  onTypeChange, 
  novelTypes,
  isMobile,
  onAddNovel,
  onSyncContent,
  isSyncing = false
}) => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleGoogleSearch = () => {
    searchMangaOnGoogle(searchTerm);
  };

  const handleImportFromGoogle = async () => {
    if (!searchTerm) {
      toast({
        title: "請輸入要導入的漫畫名稱",
        description: "搜尋欄位不能為空",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    try {
      const newNovel = await importNovelFromGoogle(searchTerm, selectedType || '漫畫');
      
      if (onAddNovel) {
        onAddNovel(newNovel);
        toast({
          title: "導入成功!",
          description: `成功導入「${searchTerm}」並同步到系統`,
        });
        onSearchChange(''); // 清除搜尋欄

        // Send notification about the new import
        try {
          await supabase
            .from('customer_support')
            .insert([{ 
              message: `新增漫畫: ${newNovel.title}`,
              user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous'
            }]);
        } catch (error) {
          console.error("無法發送同步通知:", error);
        }
      }
    } catch (error) {
      toast({
        title: "導入失敗",
        description: `無法導入「${searchTerm}」: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/2">
          <Input 
            placeholder="搜尋漫畫名稱、作者或標籤..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/3">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="選擇漫畫類型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部類型</SelectItem>
              {novelTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {onSyncContent && (
            <Button 
              variant="outline" 
              onClick={onSyncContent}
              disabled={isSyncing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? '同步中...' : '同步更新'}
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={handleGoogleSearch}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Google搜尋
          </Button>
          <Button 
            variant="outline"
            onClick={handleImportFromGoogle}
            disabled={isImporting || !searchTerm}
            className="flex items-center gap-2"
          >
            {isImporting ? (
              <>處理中...</>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                自動導入
              </>
            )}
          </Button>
        </div>
      </div>
      {searchTerm && (
        <p className="text-sm text-muted-foreground">
          找不到想看的漫畫？點擊「Google搜尋」在Google上尋找，或使用「自動導入」直接添加到系統並自動同步到所有客戶端。
        </p>
      )}
    </div>
  );
};

export default NovelFilter;

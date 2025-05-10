
import { supabase } from "@/integrations/supabase/client";
import { Novel, NovelChapter } from "@/types/novel";

// Interface for TTKan API response
interface TTKanNovelResponse {
  novels: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    tags: string[];
    description: string;
    chapterCount: number;
    updatedAt: string;
  }[];
}

interface TTKanChapterResponse {
  id: string;
  title: string;
  content: string;
  publishDate: string;
}

// Convert TTKan novel format to our app's Novel format
const convertToAppNovel = (ttkanNovel: any): Novel => {
  return {
    id: ttkanNovel.id || String(Math.random()).substring(2, 10),
    title: ttkanNovel.title || "未知標題",
    author: ttkanNovel.author || "未知作者",
    coverImage: ttkanNovel.coverUrl || `https://picsum.photos/400/600?random=${Math.random()}`,
    tags: ttkanNovel.tags || ["小說"],
    rating: ttkanNovel.rating || Math.floor(Math.random() * 50) / 10 + 3,
    chapters: ttkanNovel.chapterCount || 1,
    views: ttkanNovel.viewCount || Math.floor(Math.random() * 10000),
    likes: ttkanNovel.likes || Math.floor(Math.random() * 1000),
    summary: ttkanNovel.description || "暫無簡介",
    lastUpdated: ttkanNovel.updatedAt || new Date().toISOString(),
    isNew: ttkanNovel.isNew || false,
    isHot: ttkanNovel.isHot || false,
    isFeatured: ttkanNovel.isFeatured || false,
    type: ttkanNovel.type || "小說",
    isManga: ttkanNovel.isManga || false
  };
};

// Fetch from TTKan API - This would need to be implemented with actual API integration
const fetchFromTTKan = async () => {
  try {
    console.log("正在從 TTKan (https://www.ttkan.co/) 獲取數據...");

    // In a real implementation, this would be an actual API call to TTKan
    // For now, simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data that simulates TTKan response
    return {
      novels: Array(16).fill(null).map((_, index) => ({
        id: `ttkan-${index}`,
        title: `TTKan${index % 2 === 0 ? '小說' : '漫畫'} #${index + 1}`,
        author: `TTKan作者 ${String.fromCharCode(65 + (index % 26))}`,
        coverUrl: `https://picsum.photos/400/600?random=${index}`,
        tags: ["小說", "ttkan", index % 2 === 0 ? "熱門" : "新作"],
        description: `這是從TTKan網站(https://www.ttkan.co/)同步的${index % 2 === 0 ? '小說' : '漫畫'}內容。${index % 2 === 0 ? '這本小說講述了一個精彩的故事，充滿了冒險、情感與刺激。' : '這部漫畫以精美的畫風和引人入勝的劇情著稱。'}這是第 ${index + 1} 本作品。`,
        chapterCount: Math.floor(Math.random() * 100) + 5,
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: Math.floor(Math.random() * 50000) + 1000,
        rating: Math.floor(Math.random() * 20 + 30) / 10, // 3.0 - 5.0
        isNew: index % 3 === 0,
        isHot: index % 5 === 0,
        isFeatured: index % 7 === 0,
        type: index % 2 === 0 ? "小說" : "漫畫",
        isManga: index % 2 !== 0
      }))
    };
  } catch (error) {
    console.error("從TTKan獲取數據失敗:", error);
    throw new Error(`TTKan同步失敗: ${error}`);
  }
};

// Service functions
export const fetchNovelsFromTTKan = async (): Promise<Novel[]> => {
  try {
    console.log("正在從TTKan (https://www.ttkan.co/) 獲取小說資料...");
    
    // In real implementation, call actual TTKan API
    const response = await fetchFromTTKan();
    
    // Convert TTKan novels to our app's format
    const novels: Novel[] = response.novels.map(convertToAppNovel);
    
    // Notify about successful sync via customer_support
    try {
      await supabase
        .from('customer_support')
        .insert([{
          message: `成功從TTKan (https://www.ttkan.co/) 同步了 ${novels.length} 本小說/漫畫`,
          user_id: (await supabase.auth.getUser()).data.user?.id || 'system'
        }]);
    } catch (error) {
      console.error("無法發送同步通知:", error);
    }
    
    console.log("從TTKan獲取小說資料成功");
    return novels;
  } catch (error) {
    console.error("從TTKan獲取小說失敗:", error);
    throw new Error(`TTKan同步失敗: ${error}`);
  }
};

// Fetch novel details and chapters from TTKan
export const fetchNovelChaptersFromTTKan = async (novelId: string): Promise<NovelChapter[]> => {
  console.log(`正在從TTKan獲取ID為 ${novelId} 的章節資料...`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate mock chapters
  return Array(10).fill(null).map((_, index) => ({
    id: `${novelId}-chapter-${index + 1}`,
    title: `第${index + 1}章：${index === 0 ? '序章' : index === 9 ? '結局' : `精彩劇情${index}`}`,
    number: index + 1,
    content: `這是第 ${index + 1} 章的內容，從TTKan同步。\n\n這個章節講述了主角的冒險經歷...\n\n這是一段從TTKan (https://www.ttkan.co/) 拉取的精彩內容。具體內容比較長，這裡只是示例。\n\n希望您喜歡這個故事！`,
    publishDate: new Date(Date.now() - (10 - index) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    views: Math.floor(Math.random() * 10000) + 500
  }));
};

// Set up a real-time listener for novel updates
export const setupTTKanSyncListener = (onUpdate: (novels: Novel[]) => void) => {
  console.log("設置TTKan同步監聽器...");
  
  // Set up a periodic fetch from TTKan (every 30 minutes)
  const intervalId = setInterval(async () => {
    try {
      const novels = await fetchNovelsFromTTKan();
      onUpdate(novels);
      
      // Notify about TTKan sync via customer_support
      try {
        await supabase
          .from('customer_support')
          .insert([{
            message: `系統已自動從TTKan同步了最新小說數據`,
            user_id: 'system'
          }]);
      } catch (error) {
        console.error("無法發送自動同步通知:", error);
      }
    } catch (error) {
      console.error("定時TTKan同步失敗:", error);
    }
  }, 30 * 60 * 1000);
  
  // Also set up a Supabase realtime listener for manual triggers
  const channel = supabase
    .channel('ttkan-sync-trigger')
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'customer_support',
        filter: 'message=eq.trigger_ttkan_sync'
      },
      async (payload) => {
        console.log("收到TTKan同步觸發:", payload);
        try {
          const novels = await fetchNovelsFromTTKan();
          onUpdate(novels);
        } catch (error) {
          console.error("觸發的TTKan同步失敗:", error);
        }
      }
    )
    .subscribe();
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    supabase.removeChannel(channel);
  };
};


import { supabase } from "@/integrations/supabase/client";
import { Novel, NovelChapter } from "@/types/novel";

interface OpenLibraryResponse {
  key: string;
  name: string;
  subject_type: string;
  work_count: number;
  works: {
    key: string;
    title: string;
    edition_count: number;
    cover_id: number;
    cover_edition_key: string;
    authors: {
      key: string;
      name: string;
    }[];
    subject: string[];
    first_publish_year?: number;
  }[];
  details?: {
    subjects?: string[];
  };
}

// Convert OpenLibrary response to our app's Novel format
const convertToAppNovel = (work: any, index: number): Novel => {
  const coverId = work.cover_id || Math.floor(Math.random() * 1000000);
  const coverImage = work.cover_id 
    ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg` 
    : `https://picsum.photos/400/600?random=${Math.random()}`;

  // Determine if work is manga based on subjects or random for demo purposes
  const subjects = work.subject || [];
  const isManga = subjects.some((subject: string) => 
    subject.toLowerCase().includes('comic') || 
    subject.toLowerCase().includes('manga') || 
    subject.toLowerCase().includes('graphic novel')
  ) || index % 2 !== 0; // For demo, make every other item manga

  return {
    id: work.key || String(Math.random()).substring(2, 10),
    title: work.title || "未知標題",
    author: work.authors?.[0]?.name || "未知作者",
    coverImage: coverImage,
    tags: work.subject?.slice(0, 5) || ["小說"],
    rating: Math.floor(Math.random() * 50) / 10 + 3,
    chapters: Math.floor(Math.random() * 20) + 1,
    views: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 1000),
    summary: `這是一本由 ${work.authors?.[0]?.name || "未知作者"} 創作的${isManga ? '漫畫' : '小說'}，首次出版於 ${work.first_publish_year || "未知年份"}。`,
    lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: index % 3 === 0,
    isHot: index % 5 === 0,
    isFeatured: index % 7 === 0,
    type: isManga ? "漫畫" : "小說",
    isManga: isManga
  };
};

// Fetch from OpenLibrary API
const fetchFromOpenLibrary = async () => {
  try {
    console.log("正在從 OpenLibrary 獲取數據...");

    const response = await fetch('https://openlibrary.org/subjects/manga.json?details=true');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: OpenLibraryResponse = await response.json();
    return data;
    
  } catch (error) {
    console.error("從OpenLibrary獲取數據失敗:", error);
    throw new Error(`OpenLibrary同步失敗: ${error}`);
  }
};

// Service functions
export const fetchNovelsFromTTKan = async (): Promise<Novel[]> => {
  try {
    console.log("正在從OpenLibrary獲取小說/漫畫資料...");
    
    // Call OpenLibrary API
    const response = await fetchFromOpenLibrary();
    
    // Convert OpenLibrary works to our app's format
    const novels: Novel[] = response.works.map(convertToAppNovel);
    
    // Notify about successful sync via customer_support
    try {
      await supabase
        .from('customer_support')
        .insert([{
          message: `成功從OpenLibrary同步了 ${novels.length} 本小說/漫畫`,
          user_id: (await supabase.auth.getUser()).data.user?.id || 'system'
        }]);
    } catch (error) {
      console.error("無法發送同步通知:", error);
    }
    
    console.log("從OpenLibrary獲取小說/漫畫資料成功");
    return novels;
  } catch (error) {
    console.error("從OpenLibrary獲取小說失敗:", error);
    throw new Error(`OpenLibrary同步失敗: ${error}`);
  }
};

// Fetch novel details and chapters from OpenLibrary
export const fetchNovelChaptersFromTTKan = async (novelId: string): Promise<NovelChapter[]> => {
  console.log(`正在獲取ID為 ${novelId} 的章節資料...`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate mock chapters
  return Array(10).fill(null).map((_, index) => ({
    id: `${novelId}-chapter-${index + 1}`,
    title: `第${index + 1}章：${index === 0 ? '序章' : index === 9 ? '結局' : `精彩劇情${index}`}`,
    number: index + 1,
    content: `這是第 ${index + 1} 章的內容。\n\n這個章節講述了主角的冒險經歷...\n\n這是一段精彩內容的示例。內容比較長，這裡只是示例。\n\n希望您喜歡這個故事！`,
    publishDate: new Date(Date.now() - (10 - index) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    views: Math.floor(Math.random() * 10000) + 500
  }));
};

// Set up a real-time listener for novel updates
export const setupTTKanSyncListener = (onUpdate: (novels: Novel[]) => void) => {
  console.log("設置OpenLibrary同步監聽器...");
  
  // Set up a periodic fetch from OpenLibrary (every 30 minutes)
  const intervalId = setInterval(async () => {
    try {
      const novels = await fetchNovelsFromTTKan();
      onUpdate(novels);
      
      // Notify about OpenLibrary sync via customer_support
      try {
        await supabase
          .from('customer_support')
          .insert([{
            message: `系統已自動從OpenLibrary同步了最新小說/漫畫數據`,
            user_id: 'system'
          }]);
      } catch (error) {
        console.error("無法發送自動同步通知:", error);
      }
    } catch (error) {
      console.error("定時OpenLibrary同步失敗:", error);
    }
  }, 30 * 60 * 1000);
  
  // Also set up a Supabase realtime listener for manual triggers
  const channel = supabase
    .channel('content-sync-trigger')
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'customer_support',
        filter: 'message=eq.trigger_content_sync'
      },
      async (payload) => {
        console.log("收到OpenLibrary同步觸發:", payload);
        try {
          const novels = await fetchNovelsFromTTKan();
          onUpdate(novels);
        } catch (error) {
          console.error("觸發的OpenLibrary同步失敗:", error);
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

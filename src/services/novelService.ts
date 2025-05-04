
import { supabase } from "@/integrations/supabase/client";

export interface NovelChapterResponse {
  content: string;
  chapterNumber: number;
  status: 'success' | 'error';
}

export const generateNovelChapter = async (
  chapterNumber: number,
  previousContent?: string
): Promise<NovelChapterResponse> => {
  try {
    console.log(`正在生成第${chapterNumber}章小說內容`);
    
    const { data, error } = await supabase.functions.invoke('novel-generation', {
      body: { chapterNumber, previousContent }
    });

    if (error) {
      console.error('小說生成錯誤:', error);
      throw error;
    }

    if (!data || !data.content) {
      throw new Error('無效的小說內容回應');
    }

    console.log(`第${chapterNumber}章小說內容成功生成`);
    return {
      content: data.content,
      chapterNumber: data.chapterNumber || chapterNumber,
      status: 'success'
    };
  } catch (error) {
    console.error('小說生成服務錯誤:', error);
    return {
      content: '很抱歉，無法生成今天的小說章節。請稍後再試。',
      chapterNumber: chapterNumber,
      status: 'error'
    };
  }
};

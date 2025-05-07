
export const formatNumber = (num: number) => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(0) + '億';
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '萬';
  }
  return num.toString();
};

export const checkMaintenanceTime = () => {
  const now = new Date();
  const hour = now.getHours();
  
  // 每天晚上6點到晚上8點進行維護
  return hour >= 18 && hour < 20;
};

/**
 * Search for manga using Google search
 * @param searchTerm The manga title to search for
 */
export const searchMangaOnGoogle = (searchTerm: string) => {
  if (!searchTerm) return;
  
  // Prepare the search query with manga specific terms
  const encodedQuery = encodeURIComponent(`${searchTerm} 漫畫 manga`);
  const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
  
  // Open search in a new tab
  window.open(searchUrl, '_blank', 'noopener,noreferrer');
};

/**
 * 檢查是否是系統管理員
 * @param userRole 用戶角色
 * @returns 是否為管理員
 */
export const isAdminUser = (userRole?: string) => {
  return userRole === 'admin';
};

/**
 * 從Google搜尋結果導入小說/漫畫
 * @param title 標題
 * @param type 類型 (漫畫/小說)
 * @returns 新增的小說/漫畫對象
 */
export const importNovelFromGoogle = async (title: string, type: string = '漫畫') => {
  try {
    console.log(`嘗試從Google導入: ${title} (${type})`);
    
    // 這裡會是實際的API調用來抓取搜尋結果
    // 目前使用模擬數據
    const randomId = Math.random().toString(36).substring(2, 10);
    const now = new Date();
    
    // 模擬延遲，模擬網絡請求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 創建新的小說/漫畫對象
    const newNovel = {
      id: randomId,
      title: title,
      author: '自動導入',
      coverImage: 'https://picsum.photos/400/600?random=' + randomId, // 隨機圖片
      tags: [type, '自動導入'],
      rating: 0,
      chapters: 0,
      views: 0,
      likes: 0,
      summary: `這是一個從Google自動導入的${type}。描述尚未完成，請管理員更新。`,
      lastUpdated: now.toISOString(),
      isNew: true,
      isHot: false,
      isFeatured: false,
      type: type,
      isManga: type === '漫畫'
    };
    
    console.log('成功導入:', newNovel);
    
    // 在實際應用中，這裡會將數據同步到伺服器
    syncToServer(newNovel);
    
    return newNovel;
  } catch (error) {
    console.error('導入失敗:', error);
    throw new Error(`導入${type}失敗: ${error}`);
  }
};

/**
 * 連接到WordPress
 * @param wpUrl WordPress網站URL
 * @returns 連接狀態
 */
export const connectToWordPress = async (wpUrl: string) => {
  try {
    console.log(`嘗試連接到WordPress: ${wpUrl}`);
    
    // 模擬API調用
    // 實際實現會使用WordPress REST API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: `成功連接到WordPress網站: ${wpUrl}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('WordPress連接失敗:', error);
    return {
      success: false,
      message: `無法連接到WordPress: ${error}`,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * 同步數據到伺服器
 * @param data 要同步的數據
 */
export const syncToServer = async (data: any) => {
  try {
    console.log('正在同步數據到伺服器:', data);
    
    // 模擬API調用，實際實現會使用Supabase或其他後端
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 這裡可以放置實際的同步邏輯
    // 例如：supabase.from('manga').insert(data)
    
    console.log('數據同步成功');
    return {
      success: true,
      message: '數據已同步到伺服器',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('數據同步失敗:', error);
    return {
      success: false,
      message: `無法同步數據: ${error}`,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * 從伺服器獲取更新
 */
export const getUpdatesFromServer = async () => {
  try {
    console.log('從伺服器獲取更新');
    
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模擬數據
    const updates = {
      newItems: 5,
      updatedItems: 3,
      timestamp: new Date().toISOString()
    };
    
    console.log('成功獲取更新:', updates);
    return {
      success: true,
      data: updates,
      message: '成功獲取最新內容更新',
      timestamp: updates.timestamp
    };
  } catch (error) {
    console.error('獲取更新失敗:', error);
    return {
      success: false,
      data: null,
      message: `無法獲取更新: ${error}`,
      timestamp: new Date().toISOString()
    };
  }
};

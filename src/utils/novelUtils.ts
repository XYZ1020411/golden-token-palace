
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


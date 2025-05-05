
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

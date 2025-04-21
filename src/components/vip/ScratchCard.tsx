
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface ScratchCardProps {
  isRevealed: boolean;
  onReveal: () => void;
  reward: number | null;
  isLoading: boolean;
}

export const ScratchCard = ({ isRevealed, onReveal, reward, isLoading }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [percentScratched, setPercentScratched] = useState(0);
  const [isInit, setIsInit] = useState(false);
  
  // Canvas 設置和繪圖函數
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || isRevealed) return;
    
    const init = () => {
      if (!canvas) return;
      // 設置畫布尺寸
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      
      // 填充灰色覆蓋層
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, width, height);
      
      // 繪製刮刮樂圖案
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#94a3b8';
      
      // 繪製圖案
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 5; j++) {
          ctx.fillText('?', width / 10 * i + width / 20, height / 5 * j + height / 10);
        }
      }
      
      setIsInit(true);
    };
    
    init();
    
    // 監聽 resize 事件重新初始化
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
  }, [isRevealed]);
  
  // 處理滑鼠/觸控事件
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !isInit || isRevealed) return;
    
    let lastX = 0;
    let lastY = 0;
    
    const calculatePercentScratched = () => {
      if (!ctx) return 0;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelData = imageData.data;
      let transparentPixels = 0;
      
      // 計算透明像素數量 (每4個元素代表一個像素的 RGBA)
      for (let i = 3; i < pixelData.length; i += 4) {
        if (pixelData[i] < 50) transparentPixels++;
      }
      
      const totalPixels = canvas.width * canvas.height;
      const percent = (transparentPixels / totalPixels) * 100;
      
      // 當刮開 50% 自動完成
      if (percent > 50 && !isRevealed) {
        onReveal();
      }
      
      return percent;
    };
    
    const scratch = (x: number, y: number) => {
      if (!ctx) return;
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // 繪製連接線
      if (lastX && lastY) {
        ctx.lineWidth = 40;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      
      lastX = x;
      lastY = y;
      
      // 計算刮開百分比
      setPercentScratched(calculatePercentScratched());
    };
    
    // 滑鼠事件
    const handleMouseDown = (e: MouseEvent) => {
      setIsScratching(true);
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      scratch(lastX, lastY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isScratching) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      scratch(x, y);
    };
    
    const handleMouseUp = () => {
      setIsScratching(false);
      lastX = 0;
      lastY = 0;
    };
    
    // 觸控事件
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      setIsScratching(true);
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      lastX = touch.clientX - rect.left;
      lastY = touch.clientY - rect.top;
      scratch(lastX, lastY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isScratching) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      scratch(x, y);
    };
    
    const handleTouchEnd = () => {
      setIsScratching(false);
      lastX = 0;
      lastY = 0;
    };
    
    // 註冊事件監聽器
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isInit, isScratching, isRevealed, onReveal]);
  
  // 格式化數字
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("zh-TW").format(num);
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[350px] mx-auto">
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">準備中...</p>
        </div>
      ) : (
        <>
          <div className="relative w-full aspect-[4/3] mb-4">
            {/* 刮刮樂畫布 */}
            {!isRevealed && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full rounded-lg cursor-pointer touch-none z-10"
              />
            )}
            
            {/* 獎品顯示區域 */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
              {isRevealed && reward !== null ? (
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2 animate-bounce">
                    {formatNumber(reward)}
                  </div>
                  <p className="text-xl">恭喜獲得獎勵！</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Gift className="h-16 w-16 text-amber-500 mb-2" />
                  <p className="text-lg font-medium text-center">
                    {isRevealed ? "準備刮獎..." : "刮開查看獎勵"}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {!isRevealed && (
            <div className="w-full mt-2">
              <p className="text-sm text-center text-muted-foreground mb-2">
                {percentScratched > 0 
                  ? `已刮開 ${Math.min(100, Math.round(percentScratched))}%, 刮開50%即可揭曉結果` 
                  : "用滑鼠或手指刮開灰色區域"}
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onReveal}
              >
                直接揭曉結果
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

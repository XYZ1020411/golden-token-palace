
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const DartGame = () => {
  const { user, isAuthenticated } = useAuth();
  const { addTransaction } = useWallet();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [targetPosition, setTargetPosition] = useState(50);
  const [targetWidth, setTargetWidth] = useState(10); // Target width (percentage of total width)
  const [middleZoneWidth, setMiddleZoneWidth] = useState(30); // Middle zone width (percentage)
  const [playerPosition, setPlayerPosition] = useState(0);
  const [aimPosition, setAimPosition] = useState(0);
  const [reward, setReward] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [difficulty, setDifficulty] = useState(1); // 1-5, higher = harder
  const [movingTarget, setMovingTarget] = useState(false);
  const [targetDirection, setTargetDirection] = useState(1); // 1 = right, -1 = left
  const [targetSpeed, setTargetSpeed] = useState(0.5); // Speed of target movement
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const targetMovementRef = useRef<NodeJS.Timeout | null>(null);
  const [gameStats, setGameStats] = useState({
    totalPlays: 0,
    totalRewards: 0,
    bullseyeRate: 0,
    averageReward: 0,
  });

  useEffect(() => {
    // 這裡可以從後端加載遊戲統計數據
    setGameStats({
      totalPlays: 873,
      totalRewards: 6235000,
      bullseyeRate: 8,
      averageReward: 7142,
    });
  }, []);

  // Effect for moving target when game is in hard mode
  useEffect(() => {
    if (isPlaying && movingTarget) {
      // Start target movement
      targetMovementRef.current = setInterval(() => {
        setTargetPosition(current => {
          // Calculate new position
          const newPosition = current + (targetDirection * targetSpeed);
          
          // Reverse direction if hitting boundaries
          if (newPosition <= 15 || newPosition >= 85) {
            setTargetDirection(dir => -dir);
            return current; // Return current position this frame
          }
          
          return newPosition;
        });
      }, 16); // Update at 60fps
      
      // Cleanup function
      return () => {
        if (targetMovementRef.current) {
          clearInterval(targetMovementRef.current);
          targetMovementRef.current = null;
        }
      };
    }
  }, [isPlaying, movingTarget, targetDirection, targetSpeed]);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleStartGame = () => {
    setIsPlaying(true);
    setShowResults(false);
    setPlayerPosition(0);
    setAimPosition(50);
    
    // Set difficulty based on previous play count
    const newDifficulty = Math.min(5, Math.floor(gameStats.totalPlays / 100) + 1);
    setDifficulty(newDifficulty);
    
    // Adjust target width based on difficulty
    setTargetWidth(Math.max(4, 10 - (newDifficulty - 1) * 1.2));
    setMiddleZoneWidth(Math.max(10, 30 - (newDifficulty - 1) * 4));
    
    // Set moving target for difficulty 3+
    setMovingTarget(newDifficulty >= 3);
    setTargetSpeed(0.5 + ((newDifficulty - 3) * 0.3));
    
    // 隨機設置目標位置
    const newTargetPosition = Math.floor(Math.random() * 70) + 15; // 15-85之間的隨機位置
    setTargetPosition(newTargetPosition);
  };
  
  const handleThrowDart = () => {
    if (!isPlaying) return;
    
    // 用目前的準星位置作為飛鏢最終位置
    setPlayerPosition(aimPosition);
    handleGameEnd(aimPosition);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPlaying || !isDragging || !gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // 將指針位置轉換為百分比 (0-100)
    let position = (x / width) * 100;
    position = Math.max(0, Math.min(100, position)); // 確保值在0-100之間
    
    setAimPosition(position);
  };
  
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isPlaying) return;
    setIsDragging(true);
    handlePointerMove(e);
  };
  
  const handlePointerUp = () => {
    if (!isPlaying || !isDragging) return;
    setIsDragging(false);
    handleThrowDart();
  };

  const handleGameEnd = (finalPosition: number) => {
    // Stop the target movement
    if (targetMovementRef.current) {
      clearInterval(targetMovementRef.current);
      targetMovementRef.current = null;
    }
    
    // 計算飛鏢與靶心的距離來決定獎勵
    const distance = Math.abs(finalPosition - targetPosition);
    let userReward = 0;
    let hitZone = '';
    
    const halfTargetWidth = targetWidth / 2;
    const halfMiddleZoneWidth = middleZoneWidth / 2;
    
    if (distance <= halfTargetWidth) {
      // 紅心
      userReward = 50000;
      hitZone = '紅心';
    } else if (distance <= halfMiddleZoneWidth) {
      // 中間圈
      userReward = 20000;
      hitZone = '中間圈';
    } else {
      // 外圈
      userReward = 5000;
      hitZone = '外圈';
    }
    
    setReward(userReward);
    
    // 增加交易記錄
    addTransaction({
      amount: userReward,
      type: "system",
      description: `射飛鏢遊戲獎勵 (${hitZone})`,
    });
    
    // 更新遊戲統計
    const isBullseye = distance <= halfTargetWidth;
    setGameStats(prev => {
      const newTotalPlays = prev.totalPlays + 1;
      const newTotalRewards = prev.totalRewards + userReward;
      const newBullseyeCount = isBullseye ? prev.bullseyeRate * prev.totalPlays / 100 + 1 : prev.bullseyeRate * prev.totalPlays / 100;
      return {
        totalPlays: newTotalPlays,
        totalRewards: newTotalRewards,
        bullseyeRate: Math.round((newBullseyeCount / newTotalPlays) * 100),
        averageReward: Math.floor(newTotalRewards / newTotalPlays),
      };
    });
    
    setIsPlaying(false);
    setShowResults(true);
    
    toast({
      title: "射飛鏢結果",
      description: `您擊中了${hitZone}，獲得 ${userReward.toLocaleString()} 點獎勵！`,
    });
  };

  return (
    <MainLayout showBackButton>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">射飛鏢遊戲</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                射飛鏢遊戲
              </CardTitle>
              <CardDescription>
                瞄準靶心，最高可獲得 50,000 點獎勵！
                {difficulty > 1 && (
                  <span className="ml-2 font-medium text-amber-600">
                    當前難度: {difficulty}/5
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div 
                  ref={gameAreaRef}
                  className="h-24 w-full bg-gradient-to-r from-blue-700 via-purple-600 to-blue-700 relative rounded-full overflow-hidden cursor-crosshair"
                  style={{ touchAction: "none" }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                >
                  {/* 靶心位置標記 */}
                  <div 
                    className="absolute h-full bg-red-500 z-10 transition-all duration-200" 
                    style={{ 
                      left: `${targetPosition - (targetWidth/2)}%`,
                      width: `${targetWidth}%`
                    }}
                  >
                    <div className="h-full w-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-white animate-pulse" />
                    </div>
                  </div>
                  
                  {/* 中間圈位置標記 */}
                  <div 
                    className="absolute h-full bg-amber-500 opacity-50 transition-all duration-200" 
                    style={{ 
                      left: `${targetPosition - (middleZoneWidth/2)}%`,
                      width: `${middleZoneWidth}%`
                    }}
                  ></div>
                  
                  {/* 玩家的準星位置 */}
                  {isPlaying && !showResults && (
                    <div 
                      className="absolute h-full w-1 bg-white z-20"
                      style={{ left: `${aimPosition}%`, transition: isDragging ? "none" : "left 0.1s linear" }}
                    >
                      <div className="absolute w-8 h-8 bg-white rounded-full -left-4 -top-4 border-2 border-black flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-black"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* 玩家的飛鏢位置 */}
                  {showResults && (
                    <div 
                      className="absolute h-full w-1 bg-black dark:bg-white z-30"
                      style={{ left: `${playerPosition}%` }}
                    >
                      <div className="absolute w-4 h-12 -top-6 -left-2 bg-gray-800 transform rotate-45"></div>
                    </div>
                  )}
                </div>
                
                {showResults ? (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <h3 className="text-2xl font-bold mb-2">結果</h3>
                    <p className="text-3xl font-bold mb-4">獲得 {reward.toLocaleString()} 點</p>
                    
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleStartGame}
                    >
                      再玩一次
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    {isPlaying ? (
                      <div className="text-center">
                        <p className="text-lg mb-2">滑動設定準星位置，鬆開發射！</p>
                        <Button 
                          className="w-full mt-2" 
                          size="lg" 
                          onClick={handleThrowDart}
                        >
                          發射飛鏢
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full" 
                        size="lg" 
                        onClick={handleStartGame}
                      >
                        開始遊戲
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>遊戲統計</CardTitle>
              <CardDescription>
                您的遊戲數據與獎勵統計
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">總遊玩次數</p>
                  <p className="text-2xl font-bold">{gameStats.totalPlays.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">總發出獎勵</p>
                  <p className="text-2xl font-bold">{gameStats.totalRewards.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">紅心命中率</p>
                  <p className="text-2xl font-bold">{gameStats.bullseyeRate}%</p>
                  <Progress value={gameStats.bullseyeRate} className="mt-2" />
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">平均獎勵</p>
                  <p className="text-2xl font-bold">{gameStats.averageReward.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>遊戲規則</CardTitle>
            <CardDescription>如何玩射飛鏢遊戲</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>射飛鏢是一個考驗準確性的遊戲，您可以通過它獲得不同等級的獎勵：</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>點擊「開始遊戲」按鈕開始遊戲</li>
                <li>滑動手指設定準星位置</li>
                <li>鬆開手指或點擊「發射飛鏢」按鈕發射</li>
                <li>根據飛鏢與靶心的距離決定獎勵：
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>擊中紅心（中心）：50,000 點</li>
                    <li>擊中中間圈：20,000 點</li>
                    <li>擊中外圈：5,000 點</li>
                  </ul>
                </li>
                <li>遊戲難度會隨遊玩次數增加：
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>難度增加時，紅心和中間圈會變小</li>
                    <li>難度3以上，靶心會開始移動</li>
                    <li>難度4-5，靶心移動速度加快</li>
                  </ul>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DartGame;

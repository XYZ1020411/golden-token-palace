
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { PartyPopper } from 'lucide-react';

const BalloonGame = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameActive, setGameActive] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [balloons, setBalloons] = useState<Array<{ id: number; x: number; y: number; speed: number; size: number; color: string }>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameConfig, setGameConfig] = useState({
    minReward: 1000,
    maxReward: 10000,
    difficulty: 2 // 1-5
  });
  
  // Check authentication
  useEffect(() => {
    if (!user) {
      toast({
        title: "請先登入",
        description: "您需要登入才能玩射氣球遊戲",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);
  
  // Fetch game configuration
  useEffect(() => {
    // In a real app, this would fetch from backend
    // For now, we'll use static config
    setGameConfig({
      minReward: 1000,
      maxReward: 10000,
      difficulty: 2
    });
  }, []);
  
  // Game timer
  useEffect(() => {
    if (gameActive && !gameEnded) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setGameEnded(true);
            setGameActive(false);
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameActive, gameEnded]);
  
  // Balloon generator
  useEffect(() => {
    if (gameActive && !gameEnded) {
      const spawnRate = 1500 - (gameConfig.difficulty * 200); // Faster spawn at higher difficulty
      
      const interval = setInterval(() => {
        const newBalloon = {
          id: Date.now(),
          x: Math.random() * 80 + 10, // position from 10% to 90% of width
          y: 100, // start at bottom
          speed: (Math.random() + 0.5) * (gameConfig.difficulty / 2), // randomize speed based on difficulty
          size: Math.floor(Math.random() * 20) + 30, // size between 30px and 50px
          color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)` // random hue
        };
        
        setBalloons(prevBalloons => [...prevBalloons, newBalloon]);
      }, spawnRate);
      
      return () => clearInterval(interval);
    }
  }, [gameActive, gameEnded, gameConfig.difficulty]);
  
  // Balloon movement
  useEffect(() => {
    if (gameActive && !gameEnded) {
      const movementInterval = setInterval(() => {
        setBalloons(prevBalloons => 
          prevBalloons
            .map(balloon => ({
              ...balloon,
              y: balloon.y - balloon.speed
            }))
            .filter(balloon => balloon.y > -10) // remove balloons that are off screen
        );
      }, 50);
      
      return () => clearInterval(movementInterval);
    }
  }, [gameActive, gameEnded]);
  
  const startGame = () => {
    setGameActive(true);
    setGameEnded(false);
    setBalloons([]);
    setScore(0);
    setTimeLeft(30);
    
    toast({
      title: "遊戲開始！",
      description: "快點擊氣球獲得獎勵！"
    });
  };
  
  const handleBalloonClick = (balloonId: number) => {
    // Find and remove the clicked balloon
    setBalloons(prevBalloons => prevBalloons.filter(b => b.id !== balloonId));
    
    // Calculate points earned based on game config
    const pointsEarned = Math.floor(
      Math.random() * (gameConfig.maxReward - gameConfig.minReward) + gameConfig.minReward
    );
    
    // Update score
    setScore(prevScore => prevScore + pointsEarned);
    
    // Show toast for points
    toast({
      title: "得分！",
      description: `+${pointsEarned} 點`,
    });
  };
  
  const claimRewards = () => {
    // In a real app, this would call an API to add points to user account
    toast({
      title: "獎勵已領取",
      description: `您獲得了 ${score} 點！`,
    });
    
    // After claiming, reset game state
    setGameActive(false);
    setGameEnded(false);
    setBalloons([]);
    setScore(0);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex justify-center items-center gap-2">
              <PartyPopper className="h-6 w-6" />
              射氣球遊戲
              <PartyPopper className="h-6 w-6" />
            </CardTitle>
            <CardDescription>
              點擊飛起的氣球獲得獎勵點數
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-between">
              <div className="text-xl font-bold">得分: {score}</div>
              {gameActive && <div className="text-xl font-bold">時間: {timeLeft}秒</div>}
            </div>
            
            {/* Game Area */}
            <div 
              className="relative w-full border rounded-lg bg-sky-50 overflow-hidden"
              style={{height: "400px"}}
            >
              {gameActive && !gameEnded ? (
                <>
                  {balloons.map(balloon => (
                    <div
                      key={balloon.id}
                      onClick={() => handleBalloonClick(balloon.id)}
                      style={{
                        position: "absolute",
                        left: `${balloon.x}%`,
                        bottom: `${balloon.y}%`,
                        width: `${balloon.size}px`,
                        height: `${balloon.size * 1.2}px`,
                        backgroundColor: balloon.color,
                        borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                        cursor: "pointer",
                        transition: "bottom 0.1s linear",
                      }}
                      className="balloon hover:scale-110 active:scale-90"
                    >
                      <div 
                        style={{
                          position: "absolute",
                          bottom: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "1px",
                          height: "20px",
                          backgroundColor: "#888",
                        }}
                      ></div>
                    </div>
                  ))}
                </>
              ) : gameEnded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6 bg-white/80 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">遊戲結束！</h2>
                    <p className="text-xl mb-4">您的得分: <span className="font-bold">{score}</span></p>
                    <div className="flex gap-2">
                      <Button onClick={claimRewards}>領取獎勵</Button>
                      <Button onClick={startGame} variant="outline">再玩一次</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Button size="lg" onClick={startGame}>開始遊戲</Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">遊戲規則</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>點擊飛行中的氣球獲得獎勵點數</li>
                <li>每個氣球獎勵 {gameConfig.minReward} - {gameConfig.maxReward} 點</li>
                <li>遊戲時間 30 秒</li>
                <li>點擊越多氣球，獲得越多獎勵</li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BalloonGame;

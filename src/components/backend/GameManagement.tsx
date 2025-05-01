
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { PartyPopper, Target, RefreshCw } from "lucide-react";

export const GameManagement = () => {
  // Balloon Game Settings
  const [balloonGameActive, setBalloonGameActive] = useState(true);
  const [balloonMinReward, setBalloonMinReward] = useState(1000);
  const [balloonMaxReward, setBalloonMaxReward] = useState(10000);
  const [balloonGameDifficulty, setBalloonGameDifficulty] = useState(2); // 1-5
  
  // Dart Game Settings
  const [dartGameActive, setDartGameActive] = useState(true);
  const [dartCenterReward, setDartCenterReward] = useState(50000);
  const [dartMiddleReward, setDartMiddleReward] = useState(20000);
  const [dartOuterReward, setDartOuterReward] = useState(5000);
  const [dartGameDifficulty, setDartGameDifficulty] = useState(3); // 1-5
  
  const handleSaveBalloonSettings = () => {
    // In a real application, this would update the settings in the database
    toast({
      title: "射氣球遊戲設置已保存",
      description: `獎勵範圍: ${balloonMinReward} - ${balloonMaxReward} 點, 難度: ${balloonGameDifficulty}`,
    });
  };
  
  const handleSaveDartSettings = () => {
    // In a real application, this would update the settings in the database
    toast({
      title: "射飛鏢遊戲設置已保存",
      description: `中心/中間/外圈獎勵: ${dartCenterReward}/${dartMiddleReward}/${dartOuterReward} 點, 難度: ${dartGameDifficulty}`,
    });
  };
  
  const handleResetStatistics = (game) => {
    toast({
      title: `${game === 'balloon' ? '射氣球' : '射飛鏢'}遊戲統計已重置`,
      description: "所有統計數據已重置為零",
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="balloon">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="balloon" className="flex items-center gap-2">
            <PartyPopper className="h-4 w-4" />
            射氣球遊戲
          </TabsTrigger>
          <TabsTrigger value="dart" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            射飛鏢遊戲
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="balloon" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>射氣球遊戲設置</CardTitle>
              <CardDescription>
                管理射氣球遊戲的參數和獎勵
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="balloon-active">遊戲狀態</Label>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="balloon-active" 
                      checked={balloonGameActive}
                      onCheckedChange={setBalloonGameActive}
                    />
                    <span>{balloonGameActive ? '啟用' : '停用'}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="balloon-min-reward">最小獎勵點數</Label>
                    <Input
                      id="balloon-min-reward"
                      type="number"
                      value={balloonMinReward}
                      onChange={(e) => setBalloonMinReward(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="balloon-max-reward">最大獎勵點數</Label>
                    <Input
                      id="balloon-max-reward"
                      type="number"
                      value={balloonMaxReward}
                      onChange={(e) => setBalloonMaxReward(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="balloon-difficulty">遊戲難度</Label>
                      <span className="text-sm">
                        {balloonGameDifficulty === 1 ? '簡單' :
                         balloonGameDifficulty === 2 ? '較簡單' :
                         balloonGameDifficulty === 3 ? '中等' :
                         balloonGameDifficulty === 4 ? '較難' : '困難'}
                      </span>
                    </div>
                    <Slider
                      id="balloon-difficulty"
                      min={1}
                      max={5}
                      step={1}
                      value={[balloonGameDifficulty]}
                      onValueChange={(value) => setBalloonGameDifficulty(value[0])}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">遊戲統計</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">總遊玩次數</p>
                      <p className="text-2xl font-bold">1,245</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">總發出獎勵</p>
                      <p className="text-2xl font-bold">7,356,000</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">平均獎勵</p>
                      <p className="text-2xl font-bold">5,908</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">最高獎勵</p>
                      <p className="text-2xl font-bold">10,000</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={handleSaveBalloonSettings} className="flex-1">
                      保存設置
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleResetStatistics('balloon')}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      重置統計
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>射飛鏢遊戲設置</CardTitle>
              <CardDescription>
                管理射飛鏢遊戲的參數和獎勵
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dart-active">遊戲狀態</Label>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="dart-active" 
                      checked={dartGameActive}
                      onCheckedChange={setDartGameActive}
                    />
                    <span>{dartGameActive ? '啟用' : '停用'}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dart-center-reward">中心獎勵點數 (紅心)</Label>
                    <Input
                      id="dart-center-reward"
                      type="number"
                      value={dartCenterReward}
                      onChange={(e) => setDartCenterReward(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dart-middle-reward">中間獎勵點數</Label>
                    <Input
                      id="dart-middle-reward"
                      type="number"
                      value={dartMiddleReward}
                      onChange={(e) => setDartMiddleReward(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dart-outer-reward">外圈獎勵點數</Label>
                    <Input
                      id="dart-outer-reward"
                      type="number"
                      value={dartOuterReward}
                      onChange={(e) => setDartOuterReward(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="dart-difficulty">遊戲難度</Label>
                      <span className="text-sm">
                        {dartGameDifficulty === 1 ? '簡單' :
                         dartGameDifficulty === 2 ? '較簡單' :
                         dartGameDifficulty === 3 ? '中等' :
                         dartGameDifficulty === 4 ? '較難' : '困難'}
                      </span>
                    </div>
                    <Slider
                      id="dart-difficulty"
                      min={1}
                      max={5}
                      step={1}
                      value={[dartGameDifficulty]}
                      onValueChange={(value) => setDartGameDifficulty(value[0])}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">遊戲統計</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">總遊玩次數</p>
                      <p className="text-2xl font-bold">873</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">總發出獎勵</p>
                      <p className="text-2xl font-bold">6,235,000</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">紅心命中率</p>
                      <p className="text-2xl font-bold">8%</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">平均獎勵</p>
                      <p className="text-2xl font-bold">7,142</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={handleSaveDartSettings} className="flex-1">
                      保存設置
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleResetStatistics('dart')}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      重置統計
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

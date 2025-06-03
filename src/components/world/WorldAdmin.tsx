
import { useState } from "react";
import { World } from "@/types/world";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Users, Globe, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorldAdminProps {
  worlds: World[];
  onCreateWorld: (world: Omit<World, "id" | "createdAt" | "updatedAt" | "items">) => Promise<boolean>;
  onUpdateWorld: (worldId: string, updates: Partial<World>) => Promise<boolean>;
  onDeleteWorld: (worldId: string) => Promise<boolean>;
}

const WorldAdmin = ({ worlds, onCreateWorld, onUpdateWorld, onDeleteWorld }: WorldAdminProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredWorlds = worlds.filter(world =>
    world.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    world.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    world.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteWorld = async (worldId: string, worldName: string) => {
    try {
      await onDeleteWorld(worldId);
      toast({
        title: "刪除成功",
        description: `世界 "${worldName}" 已被刪除`,
      });
    } catch (error) {
      toast({
        title: "刪除失敗",
        description: "無法刪除世界，請稍後再試",
        variant: "destructive",
      });
    }
  };

  const toggleWorldVisibility = async (world: World) => {
    try {
      await onUpdateWorld(world.id, { isPublic: !world.isPublic });
      toast({
        title: "更新成功",
        description: `世界 "${world.name}" 已${world.isPublic ? "設為私人" : "設為公開"}`,
      });
    } catch (error) {
      toast({
        title: "更新失敗",
        description: "無法更新世界設定",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">世界管理</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="搜尋世界..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorlds.map((world) => (
          <Card key={world.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-2">{world.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {world.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {world.isPublic ? (
                    <Globe className="h-4 w-4 text-green-500" />
                  ) : (
                    <Users className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {world.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {world.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{world.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>創建者: {world.creator}</div>
                  <div>項目數量: {world.items.length}</div>
                  <div>創建時間: {new Date(world.createdAt).toLocaleDateString()}</div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleWorldVisibility(world)}
                  >
                    {world.isPublic ? "設為私人" : "設為公開"}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>確認刪除</AlertDialogTitle>
                        <AlertDialogDescription>
                          確定要刪除世界 "{world.name}" 嗎？此操作無法復原，所有相關內容都將被永久刪除。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteWorld(world.id, world.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          刪除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorlds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">沒有找到符合條件的世界</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">統計資訊</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{worlds.length}</div>
            <div className="text-sm text-muted-foreground">總世界數</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {worlds.filter(w => w.isPublic).length}
            </div>
            <div className="text-sm text-muted-foreground">公開世界</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {worlds.reduce((sum, w) => sum + w.items.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">總項目數</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {new Set(worlds.map(w => w.creator)).size}
            </div>
            <div className="text-sm text-muted-foreground">創建者數量</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldAdmin;

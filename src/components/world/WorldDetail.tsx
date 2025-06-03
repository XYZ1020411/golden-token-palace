
import { World, WorldItem, WORLD_CATEGORIES } from "@/types/world";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Plus, Globe, Users, Clock } from "lucide-react";
import { useState } from "react";
import WorldItemEditor from "./WorldItemEditor";

interface WorldDetailProps {
  world: World;
  onBack: () => void;
  onEdit: () => void;
  onCreateItem: (worldId: string, item: Omit<WorldItem, "id" | "createdAt" | "updatedAt">) => Promise<boolean>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const WorldDetail = ({ 
  world, 
  onBack, 
  onEdit, 
  onCreateItem,
  selectedCategory,
  onCategoryChange 
}: WorldDetailProps) => {
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WorldItem | null>(null);

  const categories = Object.keys(WORLD_CATEGORIES) as Array<keyof typeof WORLD_CATEGORIES>;
  
  const filteredItems = selectedCategory 
    ? world.items.filter(item => item.category === selectedCategory)
    : world.items;

  const handleCreateItem = async (item: Omit<WorldItem, "id" | "createdAt" | "updatedAt">) => {
    const success = await onCreateItem(world.id, item);
    if (success) {
      setShowItemEditor(false);
    }
    return success;
  };

  if (showItemEditor) {
    return (
      <WorldItemEditor
        worldId={world.id}
        item={selectedItem || undefined}
        onSave={handleCreateItem}
        onCancel={() => {
          setShowItemEditor(false);
          setSelectedItem(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{world.name}</h1>
            <p className="text-muted-foreground">{world.description}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            編輯世界
          </Button>
          <Button onClick={() => setShowItemEditor(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增項目
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>世界資訊</CardTitle>
            <div className="flex items-center gap-2">
              {world.isPublic && (
                <Badge variant="secondary">
                  <Globe className="h-3 w-3 mr-1" />
                  公開
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">創建者: {world.creator}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">創建時間: {new Date(world.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">項目數量: {world.items.length}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {world.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="">全部</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {WORLD_CATEGORIES[category]}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Badge variant="outline">
                      {WORLD_CATEGORIES[item.category]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>作者: {item.author}</span>
                      <span>瀏覽: {item.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {selectedCategory ? `暫無${WORLD_CATEGORIES[selectedCategory as keyof typeof WORLD_CATEGORIES]}相關項目` : "暫無項目"}
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setShowItemEditor(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                創建第一個項目
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorldDetail;

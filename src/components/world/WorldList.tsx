
import { World, WORLD_CATEGORIES } from "@/types/world";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, Users, Clock, Eye } from "lucide-react";

interface WorldListProps {
  worlds: World[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSelectWorld: (world: World) => void;
  isMobile: boolean;
}

const WorldList = ({ 
  worlds, 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  onSelectWorld,
  isMobile 
}: WorldListProps) => {
  const filteredWorlds = worlds.filter(world => {
    const matchesSearch = world.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         world.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         world.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="搜尋世界..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="選擇分類" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部分類</SelectItem>
            {Object.entries(WORLD_CATEGORIES).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorlds.map((world) => (
          <Card 
            key={world.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectWorld(world)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-2">{world.name}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">
                    {world.description}
                  </CardDescription>
                </div>
                {world.isPublic && (
                  <Globe className="h-4 w-4 text-green-500 ml-2" />
                )}
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
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{world.collaborators.length + 1}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{world.items.length} 項目</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(world.updatedAt).toLocaleDateString()}</span>
                  </div>
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
    </div>
  );
};

export default WorldList;

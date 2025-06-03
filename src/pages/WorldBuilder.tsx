
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { World, WorldItem, WORLD_CATEGORIES } from "@/types/world";
import { checkMaintenanceTime, isAdminUser } from "@/utils/novelUtils";
import MaintenanceNotice from "@/components/maintenance/MaintenanceNotice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorldList from "@/components/world/WorldList";
import WorldDetail from "@/components/world/WorldDetail";
import WorldEditor from "@/components/world/WorldEditor";
import WorldAdmin from "@/components/world/WorldAdmin";

const WorldBuilder = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [selectedItem, setSelectedItem] = useState<WorldItem | null>(null);
  const [editingMode, setEditingMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const isMobile = useIsMobile();
  const isAdmin = isAdminUser(user?.role);

  useEffect(() => {
    const checkMaintenanceSchedule = () => {
      setIsInMaintenance(checkMaintenanceTime());
    };
    
    checkMaintenanceSchedule();
    const interval = setInterval(checkMaintenanceSchedule, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isInMaintenance && !isAuthenticated && !isAdmin) {
      navigate("/login");
    }
  }, [isInMaintenance, isAuthenticated, isAdmin, navigate]);

  // Mock data initialization
  useEffect(() => {
    const mockWorlds: World[] = [
      {
        id: "1",
        name: "阿爾法星系",
        description: "一個充滿魔法與科技的奇幻世界",
        creator: "世界建造師",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        tags: ["奇幻", "科技", "魔法"],
        collaborators: [],
        items: [
          {
            id: "1",
            title: "魔法使用法規",
            category: "law",
            description: "規範魔法使用的基本法律",
            content: "第一條：任何人不得在公共場所使用破壞性魔法...",
            author: "法律顧問",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ["魔法", "法律"],
            likes: 25,
            views: 150,
            images: [],
            isPublic: true,
            worldId: "1"
          }
        ]
      }
    ];
    setWorlds(mockWorlds);
  }, []);

  const handleCreateWorld = async (world: Omit<World, "id" | "createdAt" | "updatedAt" | "items">) => {
    const newWorld: World = {
      ...world,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: []
    };
    
    setWorlds(prev => [newWorld, ...prev]);
    return true;
  };

  const handleUpdateWorld = async (worldId: string, updates: Partial<World>) => {
    setWorlds(prev => 
      prev.map(world => 
        world.id === worldId 
          ? { ...world, ...updates, updatedAt: new Date().toISOString() }
          : world
      )
    );
    return true;
  };

  const handleDeleteWorld = async (worldId: string) => {
    setWorlds(prev => prev.filter(world => world.id !== worldId));
    if (selectedWorld?.id === worldId) {
      setSelectedWorld(null);
    }
    return true;
  };

  const handleCreateItem = async (worldId: string, item: Omit<WorldItem, "id" | "createdAt" | "updatedAt">) => {
    const newItem: WorldItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWorlds(prev => 
      prev.map(world => 
        world.id === worldId 
          ? { 
              ...world, 
              items: [newItem, ...world.items],
              updatedAt: new Date().toISOString()
            }
          : world
      )
    );

    if (selectedWorld?.id === worldId) {
      setSelectedWorld(prev => prev ? {
        ...prev,
        items: [newItem, ...prev.items]
      } : null);
    }

    return true;
  };

  if (isInMaintenance && !isAdmin) {
    return (
      <MainLayout showBackButton>
        <MaintenanceNotice featureName="世界建造器" />
      </MainLayout>
    );
  }

  return (
    <MainLayout showBackButton>
      {isInMaintenance && isAdmin && <MaintenanceNotice featureName="世界建造器" isAdmin />}
      
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">建立你自己的世界</h1>
          </div>
          
          <div className="flex gap-2">
            {isAdmin && (
              <Button
                variant={showAdmin ? "default" : "outline"}
                onClick={() => setShowAdmin(!showAdmin)}
              >
                {showAdmin ? "返回建造" : "管理後台"}
              </Button>
            )}
            
            {!showAdmin && !selectedWorld && (
              <Button 
                onClick={() => setEditingMode(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                創建世界
              </Button>
            )}
          </div>
        </div>

        {showAdmin && isAdmin ? (
          <WorldAdmin 
            worlds={worlds}
            onCreateWorld={handleCreateWorld}
            onUpdateWorld={handleUpdateWorld}
            onDeleteWorld={handleDeleteWorld}
          />
        ) : editingMode ? (
          <WorldEditor
            world={selectedWorld || undefined}
            onSave={selectedWorld ? 
              (updates) => handleUpdateWorld(selectedWorld.id, updates) :
              handleCreateWorld
            }
            onCancel={() => {
              setEditingMode(false);
              setSelectedWorld(null);
            }}
          />
        ) : selectedWorld ? (
          <WorldDetail
            world={selectedWorld}
            onBack={() => setSelectedWorld(null)}
            onEdit={() => setEditingMode(true)}
            onCreateItem={handleCreateItem}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        ) : (
          <WorldList
            worlds={worlds}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSelectWorld={setSelectedWorld}
            isMobile={isMobile}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default WorldBuilder;

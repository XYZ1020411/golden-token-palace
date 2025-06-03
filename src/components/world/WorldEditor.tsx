
import { useState } from "react";
import { World } from "@/types/world";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface WorldEditorProps {
  world?: World;
  onSave: (world: Omit<World, "id" | "createdAt" | "updatedAt" | "items">) => Promise<boolean>;
  onCancel: () => void;
}

const WorldEditor = ({ world, onSave, onCancel }: WorldEditorProps) => {
  const [name, setName] = useState(world?.name || "");
  const [description, setDescription] = useState(world?.description || "");
  const [isPublic, setIsPublic] = useState(world?.isPublic || false);
  const [tags, setTags] = useState<string[]>(world?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    setSaving(true);
    
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        isPublic,
        tags,
        creator: world?.creator || "當前用戶",
        collaborators: world?.collaborators || []
      });
    } catch (error) {
      console.error("保存失敗:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{world ? "編輯世界" : "創建新世界"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">世界名稱</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="輸入世界名稱"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">世界描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述您的世界..."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">公開世界</Label>
          </div>

          <div className="space-y-2">
            <Label>標籤</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="添加標籤"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                添加
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? "保存中..." : "保存"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorldEditor;

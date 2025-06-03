
import { useState } from "react";
import { WorldItem, WORLD_CATEGORIES } from "@/types/world";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface WorldItemEditorProps {
  worldId: string;
  item?: WorldItem;
  onSave: (item: Omit<WorldItem, "id" | "createdAt" | "updatedAt">) => Promise<boolean>;
  onCancel: () => void;
}

const WorldItemEditor = ({ worldId, item, onSave, onCancel }: WorldItemEditorProps) => {
  const [title, setTitle] = useState(item?.title || "");
  const [category, setCategory] = useState<string>(item?.category || "");
  const [description, setDescription] = useState(item?.description || "");
  const [content, setContent] = useState(item?.content || "");
  const [tags, setTags] = useState<string[]>(item?.tags || []);
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
    
    if (!title.trim() || !category || !content.trim()) {
      return;
    }

    setSaving(true);
    
    try {
      await onSave({
        title: title.trim(),
        category: category as any,
        description: description.trim(),
        content: content.trim(),
        tags,
        author: item?.author || "當前用戶",
        worldId,
        likes: item?.likes || 0,
        views: item?.views || 0,
        images: item?.images || [],
        isPublic: item?.isPublic ?? true
      });
    } catch (error) {
      console.error("保存失敗:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{item ? "編輯項目" : "創建新項目"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">項目標題</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入項目標題"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">分類</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WORLD_CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">簡短描述</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="簡短描述這個項目"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">詳細內容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="詳細描述項目內容..."
              rows={10}
              required
            />
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
            <Button type="submit" disabled={saving || !title.trim() || !category || !content.trim()}>
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

export default WorldItemEditor;

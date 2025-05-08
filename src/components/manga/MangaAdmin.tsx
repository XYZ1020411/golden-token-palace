
import { useState } from "react";
import { Novel, NovelChapter } from "@/types/novel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Plus, RefreshCw, LinkIcon, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MangaAdminProps {
  novels: Novel[];
  onAddNovel: (novel: Novel) => void;
  onUpdateNovel: (novel: Novel) => void;
  onDeleteNovel: (id: string) => void;
  onSyncContent: () => void;
  isSyncing: boolean;
}

const MangaAdmin = ({
  novels,
  onAddNovel,
  onUpdateNovel,
  onDeleteNovel,
  onSyncContent,
  isSyncing,
}: MangaAdminProps) => {
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedNovel, setEditedNovel] = useState<Partial<Novel>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredNovels = novels.filter(
    (novel) =>
      novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      novel.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (novel: Novel) => {
    setSelectedNovel(novel);
    setEditedNovel({ ...novel });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (novel: Novel) => {
    setSelectedNovel(novel);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editedNovel.title || !editedNovel.author) {
      toast({
        title: "錯誤",
        description: "標題和作者為必填項",
        variant: "destructive",
      });
      return;
    }

    if (selectedNovel) {
      // Update existing novel
      onUpdateNovel({ ...selectedNovel, ...editedNovel } as Novel);
      toast({
        title: "更新成功",
        description: `已更新『${editedNovel.title}』`,
      });
    } else {
      // Create new novel
      const newNovel: Novel = {
        id: `new-${Date.now()}`,
        title: editedNovel.title || "新作品",
        author: editedNovel.author || "未知作者",
        coverImage:
          editedNovel.coverImage ||
          `https://picsum.photos/400/600?random=${Math.random()}`,
        tags: editedNovel.tags || ["新作"],
        rating: editedNovel.rating || 0,
        chapters: editedNovel.chapters || 0,
        views: editedNovel.views || 0,
        likes: editedNovel.likes || 0,
        summary: editedNovel.summary || "",
        lastUpdated: new Date().toISOString(),
        isNew: editedNovel.isNew || false,
        isHot: editedNovel.isHot || false,
        isFeatured: editedNovel.isFeatured || false,
        type: editedNovel.type || "小說",
        isManga: editedNovel.isManga || false,
      };
      onAddNovel(newNovel);
      toast({
        title: "新增成功",
        description: `已新增『${newNovel.title}』`,
      });
    }

    setIsDialogOpen(false);
    setSelectedNovel(null);
    setEditedNovel({});
  };

  const handleDeleteConfirm = () => {
    if (selectedNovel) {
      onDeleteNovel(selectedNovel.id);
      toast({
        title: "刪除成功",
        description: `已刪除『${selectedNovel.title}』`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedNovel(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>漫畫小說管理</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onSyncContent}
              disabled={isSyncing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "同步中..." : "同步內容"}
            </Button>
            <Button
              onClick={() => {
                setSelectedNovel(null);
                setEditedNovel({});
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              新增作品
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-72">
              <Input
                placeholder="搜尋作品或作者"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              共 {filteredNovels.length} 筆資料
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead className="w-[150px]">封面</TableHead>
                  <TableHead>標題</TableHead>
                  <TableHead>作者</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>章節數</TableHead>
                  <TableHead>瀏覽數</TableHead>
                  <TableHead>更新時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNovels.map((novel) => (
                  <TableRow key={novel.id}>
                    <TableCell className="font-medium">{novel.id.substring(0, 6)}</TableCell>
                    <TableCell>
                      <img
                        src={novel.coverImage}
                        alt={novel.title}
                        className="h-16 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{novel.title}</div>
                      <div className="flex gap-1 mt-1">
                        {novel.isNew && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                            NEW
                          </span>
                        )}
                        {novel.isHot && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                            HOT
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{novel.author}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {novel.type}
                      </span>
                    </TableCell>
                    <TableCell>{novel.chapters}</TableCell>
                    <TableCell>{novel.views.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(novel.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(novel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(novel)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredNovels.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      無資料
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedNovel ? "編輯作品" : "新增作品"}</DialogTitle>
            <DialogDescription>
              {selectedNovel
                ? "修改作品資訊並保存更改"
                : "填寫作品資訊以新增到系統"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">標題</label>
                <Input
                  value={editedNovel.title || ""}
                  onChange={(e) =>
                    setEditedNovel({ ...editedNovel, title: e.target.value })
                  }
                  placeholder="作品標題"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">作者</label>
                <Input
                  value={editedNovel.author || ""}
                  onChange={(e) =>
                    setEditedNovel({ ...editedNovel, author: e.target.value })
                  }
                  placeholder="作品作者"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">封面圖片URL</label>
                <Input
                  value={editedNovel.coverImage || ""}
                  onChange={(e) =>
                    setEditedNovel({ ...editedNovel, coverImage: e.target.value })
                  }
                  placeholder="http://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">類型</label>
                <Select
                  value={editedNovel.type || "小說"}
                  onValueChange={(value) =>
                    setEditedNovel({ ...editedNovel, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="小說">小說</SelectItem>
                    <SelectItem value="漫畫">漫畫</SelectItem>
                    <SelectItem value="輕小說">輕小說</SelectItem>
                    <SelectItem value="網絡小說">網絡小說</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">標籤 (逗號分隔)</label>
                <Input
                  value={(editedNovel.tags || []).join(", ")}
                  onChange={(e) =>
                    setEditedNovel({
                      ...editedNovel,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                  placeholder="奇幻, 冒險, 動作"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">簡介</label>
                <Textarea
                  value={editedNovel.summary || ""}
                  onChange={(e) =>
                    setEditedNovel({ ...editedNovel, summary: e.target.value })
                  }
                  rows={5}
                  placeholder="作品簡介..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">章節數</label>
                  <Input
                    type="number"
                    value={editedNovel.chapters || 0}
                    onChange={(e) =>
                      setEditedNovel({
                        ...editedNovel,
                        chapters: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">評分</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editedNovel.rating || 0}
                    onChange={(e) =>
                      setEditedNovel({
                        ...editedNovel,
                        rating: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">特殊標記</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isNew"
                      checked={editedNovel.isNew || false}
                      onChange={(e) =>
                        setEditedNovel({ ...editedNovel, isNew: e.target.checked })
                      }
                    />
                    <label htmlFor="isNew" className="text-sm">
                      新作
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isHot"
                      checked={editedNovel.isHot || false}
                      onChange={(e) =>
                        setEditedNovel({ ...editedNovel, isHot: e.target.checked })
                      }
                    />
                    <label htmlFor="isHot" className="text-sm">
                      熱門
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={editedNovel.isFeatured || false}
                      onChange={(e) =>
                        setEditedNovel({
                          ...editedNovel,
                          isFeatured: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="isFeatured" className="text-sm">
                      精選
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isManga"
                      checked={editedNovel.isManga || false}
                      onChange={(e) =>
                        setEditedNovel({
                          ...editedNovel,
                          isManga: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="isManga" className="text-sm">
                      漫畫形式
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setEditedNovel({});
              }}
            >
              取消
            </Button>
            <Button onClick={handleSaveChanges}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
            <DialogDescription>
              您確定要刪除「{selectedNovel?.title}」嗎？此操作不可撤銷。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              確認刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MangaAdmin;

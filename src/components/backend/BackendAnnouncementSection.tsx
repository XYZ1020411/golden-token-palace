
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAnnouncement } from "@/context/AdminContext";
import { Bell, FileText, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface BackendAnnouncementSectionProps {
  announcements: SystemAnnouncement[];
  addAnnouncement: (announcement: Omit<SystemAnnouncement, "id" | "date">) => void;
  deleteAnnouncement: (id: string) => boolean;
  updateAnnouncement: (id: string, updates: Partial<Omit<SystemAnnouncement, "id" | "date">>) => boolean;
}

export const BackendAnnouncementSection = ({
  announcements,
  addAnnouncement,
  deleteAnnouncement,
  updateAnnouncement
}: BackendAnnouncementSectionProps) => {
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    importance: "medium",
    showToRoles: ["admin", "vip", "regular"]
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddAnnouncement = () => {
    addAnnouncement({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      importance: newAnnouncement.importance as "low" | "medium" | "high",
      showToRoles: newAnnouncement.showToRoles as ("admin" | "vip" | "regular")[]
    });
    
    setNewAnnouncement({
      title: "",
      content: "",
      importance: "medium",
      showToRoles: ["admin", "vip", "regular"]
    });
  };

  const handleRoleCheckboxChange = (role: "admin" | "vip" | "regular") => {
    if (newAnnouncement.showToRoles.includes(role)) {
      setNewAnnouncement({
        ...newAnnouncement,
        showToRoles: newAnnouncement.showToRoles.filter(r => r !== role)
      });
    } else {
      setNewAnnouncement({
        ...newAnnouncement,
        showToRoles: [...newAnnouncement.showToRoles, role]
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            系統公告
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                新增公告
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增公告</DialogTitle>
                <DialogDescription>
                  發布新的系統公告
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>標題</Label>
                  <Input
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    placeholder="請輸入公告標題"
                  />
                </div>
                <div className="space-y-2">
                  <Label>內容</Label>
                  <Textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    placeholder="請輸入公告內容"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>重要程度</Label>
                  <Select
                    value={newAnnouncement.importance}
                    onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, importance: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>顯示給</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="admin"
                        checked={newAnnouncement.showToRoles.includes("admin")}
                        onCheckedChange={() => handleRoleCheckboxChange("admin")}
                      />
                      <Label htmlFor="admin" className="text-sm">管理員</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vip"
                        checked={newAnnouncement.showToRoles.includes("vip")}
                        onCheckedChange={() => handleRoleCheckboxChange("vip")}
                      />
                      <Label htmlFor="vip" className="text-sm">VIP用戶</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="regular"
                        checked={newAnnouncement.showToRoles.includes("regular")}
                        onCheckedChange={() => handleRoleCheckboxChange("regular")}
                      />
                      <Label htmlFor="regular" className="text-sm">普通用戶</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddAnnouncement}>發布公告</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋公告..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="ml-2 text-sm">共 {announcements.length} 個公告</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-4 border rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{announcement.title}</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteAnnouncement(announcement.id)}
                >
                  刪除
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(announcement.date).toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    顯示給：
                    <span className="text-primary">
                      {announcement.showToRoles.map(role => 
                        role === "admin" ? "管理員" : role === "vip" ? "VIP會員" : "普通會員"
                      ).join(", ")}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    重要程度：
                    <span className={
                      announcement.importance === "high" 
                        ? "text-red-500" 
                        : announcement.importance === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                    }>
                      {announcement.importance === "high" ? "高" : announcement.importance === "medium" ? "中" : "低"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              沒有找到符合搜尋條件的公告
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

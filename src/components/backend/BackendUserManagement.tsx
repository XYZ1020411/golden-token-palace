
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@/context/AuthContext";
import { Users, UserPlus, Search } from "lucide-react";

interface BackendUserManagementProps {
  users: User[];
  addUser: (username: string, password: string, role: UserRole) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
}

export const BackendUserManagement = ({
  users,
  addUser,
  deleteUser,
  updateUser
}: BackendUserManagementProps) => {
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "regular" });
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddUser = async () => {
    const success = await addUser(newUser.username, newUser.password, newUser.role as UserRole);
    if (success) {
      setNewUser({ username: "", password: "", role: "regular" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            用戶列表
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                新增用戶
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增用戶</DialogTitle>
                <DialogDescription>
                  創建新的系統用戶帳號
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>用戶名</Label>
                  <Input
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>密碼</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>角色</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">普通用戶</SelectItem>
                      <SelectItem value="vip">VIP用戶</SelectItem>
                      <SelectItem value="admin">管理員</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUser}>創建用戶</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋用戶..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="ml-2 text-sm">共 {users.length} 個用戶</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-muted-foreground">
                  {user.role === "admin" 
                    ? "管理員" 
                    : user.role === "vip" 
                      ? "VIP會員" 
                      : "普通會員"}
                </div>
                {user.role === "vip" && (
                  <div className="text-xs text-muted-foreground mt-1">
                    VIP 等級: {user.vipLevel}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  點數: {user.points.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="輸入點數"
                  className="w-32"
                  defaultValue={user.points}
                  onChange={(e) => {
                    const points = parseInt(e.target.value) || 0;
                    e.currentTarget.dataset.points = points.toString();
                  }}
                />
                <Button 
                  size="sm"
                  onClick={() => {
                    const pointsInput = document.querySelector(`[data-points]`) as HTMLInputElement;
                    const points = parseInt(pointsInput?.dataset.points || "0");
                    if (points > 0) {
                      updateUser(user.id, { points });
                    }
                  }}
                >
                  更新
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteUser(user.id)}
                >
                  刪除
                </Button>
              </div>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              沒有找到符合搜尋條件的用戶
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

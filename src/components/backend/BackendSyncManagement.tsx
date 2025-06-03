
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Users, Database, Wifi } from "lucide-react";

interface SyncUser {
  id: string;
  username: string;
  points: number;
  role: string;
  is_online: boolean;
  last_sync_at: string;
  sync_version: number;
}

export const BackendSyncManagement = () => {
  const [syncUsers, setSyncUsers] = useState<SyncUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [pointsAdjustment, setPointsAdjustment] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const loadSyncUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          points,
          role,
          user_sync_status (
            is_online,
            last_sync_at,
            sync_version
          )
        `);

      if (error) throw error;

      const formattedUsers = data?.map(user => {
        const syncStatus = Array.isArray(user.user_sync_status) 
          ? user.user_sync_status[0] 
          : user.user_sync_status;
        
        return {
          id: user.id,
          username: user.username || '未知用戶',
          points: user.points || 0,
          role: user.role || 'user',
          is_online: syncStatus?.is_online || false,
          last_sync_at: syncStatus?.last_sync_at || '',
          sync_version: syncStatus?.sync_version || 0
        };
      }) || [];

      setSyncUsers(formattedUsers);
    } catch (error) {
      console.error("載入同步用戶失敗:", error);
      toast({
        title: "載入失敗",
        description: "無法載入同步用戶資料",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const adjustUserPoints = async (userId: string) => {
    const adjustment = pointsAdjustment[userId];
    if (!adjustment) return;

    try {
      // 更新用戶點數
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points: adjustment })
        .eq('id', userId);

      if (updateError) throw updateError;

      // 記錄交易
      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert([{
          user_id: userId,
          amount: adjustment,
          transaction_type: 'admin_adjust',
          description: `管理員調整點數至 ${adjustment}`,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (transactionError) throw transactionError;

      toast({
        title: "調整成功",
        description: `已將用戶點數調整至 ${adjustment}`,
      });

      // 重新載入資料
      await loadSyncUsers();
      setPointsAdjustment(prev => ({ ...prev, [userId]: 0 }));
    } catch (error) {
      console.error("調整點數失敗:", error);
      toast({
        title: "調整失敗",
        description: "無法調整用戶點數",
        variant: "destructive"
      });
    }
  };

  const forceSync = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_sync_status')
        .update({
          last_sync_at: new Date().toISOString(),
          sync_version: Date.now()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "強制同步成功",
        description: "已強制觸發用戶同步",
      });

      await loadSyncUsers();
    } catch (error) {
      console.error("強制同步失敗:", error);
      toast({
        title: "同步失敗",
        description: "無法強制同步用戶",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadSyncUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            網路同步管理
          </CardTitle>
          <Button onClick={loadSyncUsers} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            重新整理
          </Button>
        </div>
        <CardDescription>
          管理所有用戶的網路同步狀態和點數
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{syncUsers.length}</div>
                    <div className="text-sm text-muted-foreground">總用戶數</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {syncUsers.filter(u => u.is_online).length}
                    </div>
                    <div className="text-sm text-muted-foreground">線上用戶</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {syncUsers.reduce((sum, u) => sum + (u.points || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">總點數</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">用戶同步狀態</h3>
            {syncUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {user.is_online ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <Wifi className="h-4 w-4 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.role === "admin" ? "管理員" : user.role === "vip" ? "VIP會員" : "普通會員"}
                      </div>
                    </div>
                  </div>
                  <Badge variant={user.is_online ? "default" : "secondary"}>
                    {user.is_online ? "線上" : "離線"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      點數: {user.points?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      版本: v{user.sync_version}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="調整點數"
                      className="w-24"
                      value={pointsAdjustment[user.id] || ''}
                      onChange={(e) => setPointsAdjustment(prev => ({
                        ...prev,
                        [user.id]: parseInt(e.target.value) || 0
                      }))}
                    />
                    <Button
                      size="sm"
                      onClick={() => adjustUserPoints(user.id)}
                      disabled={!pointsAdjustment[user.id]}
                    >
                      調整
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => forceSync(user.id)}
                    >
                      同步
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {syncUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                暫無同步用戶資料
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

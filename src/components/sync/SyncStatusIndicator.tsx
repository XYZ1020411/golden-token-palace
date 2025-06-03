
import React from "react";
import { useSync } from "@/context/SyncContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wifi, WifiOff, RefreshCw, Users, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale";

const SyncStatusIndicator = () => {
  const { syncStatus, syncUserData, enableAutoSync, setEnableAutoSync, onlineUsers } = useSync();

  const formatLastSync = (lastSyncAt: string | null) => {
    if (!lastSyncAt) return "從未同步";
    
    try {
      return formatDistanceToNow(new Date(lastSyncAt), {
        addSuffix: true,
        locale: zhTW
      });
    } catch (error) {
      return "時間格式錯誤";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            網路同步狀態
          </CardTitle>
          <Badge variant={syncStatus.isOnline ? "default" : "secondary"}>
            {syncStatus.isOnline ? "已連線" : "離線"}
          </Badge>
        </div>
        <CardDescription>
          管理您的帳號資料同步設定
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">上次同步:</span>
          </div>
          <span className="text-sm font-medium">
            {formatLastSync(syncStatus.lastSyncAt)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">線上用戶:</span>
          </div>
          <span className="text-sm font-medium">{onlineUsers.length}</span>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-sync" className="text-sm font-medium">
            自動同步
          </Label>
          <Switch
            id="auto-sync"
            checked={enableAutoSync}
            onCheckedChange={setEnableAutoSync}
          />
        </div>

        <Button
          onClick={syncUserData}
          disabled={syncStatus.isSyncing}
          className="w-full"
          variant="outline"
        >
          {syncStatus.isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              同步中...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              立即同步
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          同步版本: v{syncStatus.syncVersion}
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncStatusIndicator;

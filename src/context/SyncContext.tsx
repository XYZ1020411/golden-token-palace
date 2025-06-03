
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "sonner";

interface SyncStatus {
  isOnline: boolean;
  lastSyncAt: string | null;
  syncVersion: number;
  isSyncing: boolean;
}

interface UserData {
  id: string;
  username: string;
  points: number;
  role: string;
  vip_level?: number;
}

interface SyncContextType {
  syncStatus: SyncStatus;
  syncUserData: () => Promise<void>;
  enableAutoSync: boolean;
  setEnableAutoSync: (enabled: boolean) => void;
  onlineUsers: string[];
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: false,
    lastSyncAt: null,
    syncVersion: 1,
    isSyncing: false
  });
  const [enableAutoSync, setEnableAutoSync] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // 同步用戶資料到 Supabase
  const syncUserData = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    
    try {
      // 獲取當前 Supabase 用戶
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        console.log("未找到認證用戶");
        return;
      }

      // 檢查或建立用戶檔案
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!existingProfile) {
        // 建立新的用戶檔案
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: authUser.user.id,
            username: user.username,
            points: user.points,
            role: user.role,
            vip_level: user.vipLevel || 0,
            display_name: user.username
          }]);

        if (insertError) throw insertError;
        console.log("建立新用戶檔案成功");
      } else {
        // 更新現有用戶檔案
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: user.username,
            points: user.points,
            role: user.role,
            vip_level: user.vipLevel || 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', authUser.user.id);

        if (updateError) throw updateError;
        console.log("更新用戶檔案成功");
      }

      // 更新同步狀態
      const { error: syncError } = await supabase
        .from('user_sync_status')
        .upsert({
          user_id: authUser.user.id,
          last_sync_at: new Date().toISOString(),
          sync_version: syncStatus.syncVersion + 1,
          is_online: true
        });

      if (syncError) throw syncError;

      setSyncStatus(prev => ({
        ...prev,
        lastSyncAt: new Date().toISOString(),
        syncVersion: prev.syncVersion + 1,
        isOnline: true
      }));

      toast.success("同步成功！");
    } catch (error) {
      console.error("同步失敗:", error);
      toast.error("同步失敗");
    } finally {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [isAuthenticated, user, syncStatus.syncVersion]);

  // 設置即時監聽
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncChannel = supabase.channel('user-sync')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_sync_status'
      }, (payload) => {
        console.log("同步狀態變更:", payload);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        console.log("用戶檔案變更:", payload);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = syncChannel.presenceState();
        const users = Object.keys(state);
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        console.log("用戶上線:", key);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        console.log("用戶離線:", key);
      });

    syncChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED' && user) {
        await syncChannel.track({
          user_id: user.id,
          username: user.username,
          online_at: new Date().toISOString()
        });
      }
    });

    setChannel(syncChannel);

    return () => {
      if (syncChannel) {
        syncChannel.unsubscribe();
      }
    };
  }, [isAuthenticated, user]);

  // 自動同步
  useEffect(() => {
    if (!enableAutoSync || !isAuthenticated) return;

    const interval = setInterval(() => {
      syncUserData();
    }, 30000); // 每30秒同步一次

    return () => clearInterval(interval);
  }, [enableAutoSync, isAuthenticated, syncUserData]);

  // 初始同步
  useEffect(() => {
    if (isAuthenticated && user) {
      syncUserData();
    }
  }, [isAuthenticated, user, syncUserData]);

  const value = {
    syncStatus,
    syncUserData,
    enableAutoSync,
    setEnableAutoSync,
    onlineUsers
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
};

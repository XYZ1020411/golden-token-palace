
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// User types
export type UserRole = "vip" | "regular" | "admin";

export interface UserProfile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  points: number;
  vip_level: number;
  created_at?: string;
  updated_at?: string;
}

// Custom User type that extends Supabase User with our app-specific properties
export interface User extends SupabaseUser {
  username: string;
  role: UserRole;
  points: number;
  vipLevel: number;
  lastCheckIn?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 獲取用戶配置文件
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
    
    // Update our custom user object with profile data
    if (data && user) {
      setUser({
        ...user,
        username: data.username,
        role: data.vip_level > 0 ? "vip" : "regular",
        points: data.points || 0,
        vipLevel: data.vip_level || 0
      });
    }
  };

  // 監聽身份驗證狀態變化
  useEffect(() => {
    // 檢查當前會話
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Create our extended user object with default values
        const extendedUser = {
          ...session.user,
          username: '',
          role: 'regular' as UserRole,
          points: 0,
          vipLevel: 0
        };
        setUser(extendedUser);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // 設置身份驗證監聽器
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Create our extended user object with default values
        const extendedUser = {
          ...session.user,
          username: '',
          role: 'regular' as UserRole,
          points: 0,
          vipLevel: 0
        };
        setUser(extendedUser);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 登入
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // 註冊
  const register = async (email: string, password: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    return { error };
  };

  // 登出
  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  // 更新配置文件
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      // Also update the user object if relevant fields were updated
      if (updates.username || updates.points !== undefined || updates.vip_level !== undefined) {
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            username: updates.username || prev.username,
            points: updates.points !== undefined ? updates.points : prev.points,
            vipLevel: updates.vip_level !== undefined ? updates.vip_level : prev.vipLevel,
            role: updates.vip_level !== undefined && updates.vip_level > 0 ? "vip" : prev.role
          };
        });
      }
    }

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

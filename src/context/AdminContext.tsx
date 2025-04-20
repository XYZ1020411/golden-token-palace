
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth, User, UserRole } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  importance: "low" | "medium" | "high";
  showToRoles: UserRole[];
}

export interface CustomerSupportMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  date: string;
  resolved: boolean;
  adminResponse?: string;
}

interface AdminContextType {
  users: User[];
  announcements: SystemAnnouncement[];
  supportMessages: CustomerSupportMessage[];
  currentTemperature: string;
  addUser: (username: string, password: string, role: UserRole) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  addAnnouncement: (announcement: Omit<SystemAnnouncement, "id" | "date">) => void;
  updateAnnouncement: (id: string, updates: Partial<Omit<SystemAnnouncement, "id" | "date">>) => boolean;
  deleteAnnouncement: (id: string) => boolean;
  backupData: () => string;
  restoreData: (jsonData: string) => boolean;
  respondToSupportMessage: (messageId: string, response: string) => boolean;
  markSupportMessageResolved: (messageId: string, resolved: boolean) => boolean;
  updateTemperature: (temp: string) => void;
}

// Mock storage for users and announcements
let mockUsers: User[] = [
  {
    id: "1",
    username: "vip8888",
    role: "vip",
    points: 100000000,
    vipLevel: 5
  },
  {
    id: "2",
    username: "001",
    role: "regular",
    points: 100000000
  },
  {
    id: "3",
    username: "002",
    role: "admin",
    points: 100000000
  }
];

let mockPasswords: Record<string, string> = {
  "vip8888": "vip8888",
  "001": "001",
  "002": "002"
};

let mockAnnouncements: SystemAnnouncement[] = [
  {
    id: "1",
    title: "系統更新通知",
    content: "親愛的用戶，系統將於2025年4月25日凌晨2-4點進行更新維護，期間服務可能短暫不可用。",
    date: "2025-04-19T08:00:00Z",
    importance: "medium",
    showToRoles: ["admin", "vip", "regular"]
  }
];

let mockSupportMessages: CustomerSupportMessage[] = [
  {
    id: "1",
    userId: "2",
    username: "001",
    message: "我無法領取我的每日獎勵，請幫忙解決。",
    date: "2025-04-19T10:30:00Z",
    resolved: false
  },
  {
    id: "2",
    userId: "1",
    username: "vip8888",
    message: "我想了解最新的VIP活動詳情。",
    date: "2025-04-18T14:45:00Z",
    resolved: true,
    adminResponse: "您好，我們的最新VIP活動將在下週一開始，包括高額的獎勵和專屬優惠，請留意站內公告。"
  }
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(mockAnnouncements);
  const [supportMessages, setSupportMessages] = useState<CustomerSupportMessage[]>(mockSupportMessages);
  const [currentTemperature, setCurrentTemperature] = useState<string>("28°C");

  // Temperature update function
  const updateTemperature = (temp: string) => {
    setCurrentTemperature(temp);
  };

  // Set up temperature update interval (simulated)
  React.useEffect(() => {
    const updateRandomTemperature = () => {
      const randomTemp = Math.floor(Math.random() * 10) + 20; // Random temp between 20-30°C
      updateTemperature(`${randomTemp}°C`);
    };

    // Update temperature every second
    const intervalId = setInterval(updateRandomTemperature, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Add a new user
  const addUser = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    // Check if current user is admin
    if (!user || user.role !== "admin") {
      return false;
    }
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
      toast({
        title: "錯誤",
        description: "用戶名已存在",
        variant: "destructive"
      });
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      role,
      points: 100000000,
      vipLevel: role === "vip" ? 1 : undefined
    };
    
    // Update mock storage
    mockUsers = [...mockUsers, newUser];
    mockPasswords[username] = password;
    
    // Update state
    setUsers([...users, newUser]);
    
    toast({
      title: "成功",
      description: "新用戶已創建",
    });
    
    return true;
  };

  // Update an existing user
  const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    // Update mock storage
    mockUsers = mockUsers.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    );
    
    // Update state
    setUsers(mockUsers);
    
    toast({
      title: "成功",
      description: "用戶資料已更新",
    });
    
    return true;
  };

  // Delete a user
  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    // Cannot delete yourself
    if (userId === user.id) {
      toast({
        title: "錯誤",
        description: "無法刪除自己的帳號",
        variant: "destructive"
      });
      return false;
    }
    
    // Update mock storage
    const deletedUser = mockUsers.find(u => u.id === userId);
    if (deletedUser) {
      delete mockPasswords[deletedUser.username];
    }
    
    mockUsers = mockUsers.filter(u => u.id !== userId);
    
    // Update state
    setUsers(mockUsers);
    
    toast({
      title: "成功",
      description: "用戶已刪除",
    });
    
    return true;
  };

  // Add a new announcement
  const addAnnouncement = (announcement: Omit<SystemAnnouncement, "id" | "date">) => {
    if (!user || user.role !== "admin") {
      return;
    }
    
    const newAnnouncement: SystemAnnouncement = {
      ...announcement,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    // Update mock storage
    mockAnnouncements = [...mockAnnouncements, newAnnouncement];
    
    // Update state
    setAnnouncements([...announcements, newAnnouncement]);
    
    toast({
      title: "成功",
      description: "公告已發布",
    });
  };

  // Update an announcement
  const updateAnnouncement = (id: string, updates: Partial<Omit<SystemAnnouncement, "id" | "date">>): boolean => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    // Update mock storage
    mockAnnouncements = mockAnnouncements.map(a => 
      a.id === id ? { ...a, ...updates } : a
    );
    
    // Update state
    setAnnouncements(mockAnnouncements);
    
    toast({
      title: "成功",
      description: "公告已更新",
    });
    
    return true;
  };

  // Delete an announcement
  const deleteAnnouncement = (id: string): boolean => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    // Update mock storage
    mockAnnouncements = mockAnnouncements.filter(a => a.id !== id);
    
    // Update state
    setAnnouncements(mockAnnouncements);
    
    toast({
      title: "成功",
      description: "公告已刪除",
    });
    
    return true;
  };

  // Respond to customer support message
  const respondToSupportMessage = (messageId: string, response: string): boolean => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    // Find and update the message
    mockSupportMessages = mockSupportMessages.map(m => 
      m.id === messageId 
        ? { ...m, adminResponse: response, resolved: true } 
        : m
    );
    
    setSupportMessages(mockSupportMessages);
    
    toast({
      title: "成功",
      description: "已回覆客戶訊息",
    });
    
    return true;
  };

  // Mark support message as resolved/unresolved
  const markSupportMessageResolved = (messageId: string, resolved: boolean): boolean => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    // Find and update the message
    mockSupportMessages = mockSupportMessages.map(m => 
      m.id === messageId ? { ...m, resolved } : m
    );
    
    setSupportMessages(mockSupportMessages);
    
    toast({
      title: "成功",
      description: resolved ? "訊息已標記為已解決" : "訊息已標記為未解決",
    });
    
    return true;
  };

  // Backup all data as JSON
  const backupData = (): string => {
    if (!user || user.role !== "admin") {
      return "";
    }
    
    const backupData = {
      users: mockUsers,
      passwords: mockPasswords,
      announcements: mockAnnouncements,
      supportMessages: mockSupportMessages
    };
    
    toast({
      title: "成功",
      description: "系統數據已備份",
    });
    
    return JSON.stringify(backupData);
  };

  // Restore data from JSON backup
  const restoreData = (jsonData: string): boolean => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.users || !data.passwords || !data.announcements) {
        toast({
          title: "錯誤",
          description: "備份數據格式無效",
          variant: "destructive"
        });
        return false;
      }
      
      // Update mock storage
      mockUsers = data.users;
      mockPasswords = data.passwords;
      mockAnnouncements = data.announcements;
      if (data.supportMessages) {
        mockSupportMessages = data.supportMessages;
      }
      
      // Update state
      setUsers(mockUsers);
      setAnnouncements(mockAnnouncements);
      setSupportMessages(mockSupportMessages);
      
      toast({
        title: "成功",
        description: "系統數據已恢復",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to restore data:", error);
      toast({
        title: "錯誤",
        description: "還原數據失敗，請檢查文件格式",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <AdminContext.Provider value={{
      users,
      announcements,
      supportMessages,
      currentTemperature,
      addUser,
      updateUser,
      deleteUser,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      backupData,
      restoreData,
      respondToSupportMessage,
      markSupportMessageResolved,
      updateTemperature
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

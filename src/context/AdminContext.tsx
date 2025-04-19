
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth, User, UserRole } from "./AuthContext";

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  importance: "low" | "medium" | "high";
  showToRoles: UserRole[];
}

interface AdminContextType {
  users: User[];
  announcements: SystemAnnouncement[];
  addUser: (username: string, password: string, role: UserRole) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  addAnnouncement: (announcement: Omit<SystemAnnouncement, "id" | "date">) => void;
  updateAnnouncement: (id: string, updates: Partial<Omit<SystemAnnouncement, "id" | "date">>) => boolean;
  deleteAnnouncement: (id: string) => boolean;
  backupData: () => string;
  restoreData: (jsonData: string) => boolean;
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

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(mockAnnouncements);

  // Add a new user
  const addUser = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    // Check if current user is admin
    if (!user || user.role !== "admin") {
      return false;
    }
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
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
    
    return true;
  };

  // Delete a user
  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    // Cannot delete yourself
    if (userId === user.id) {
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
      announcements: mockAnnouncements
    };
    
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
        return false;
      }
      
      // Update mock storage
      mockUsers = data.users;
      mockPasswords = data.passwords;
      mockAnnouncements = data.announcements;
      
      // Update state
      setUsers(mockUsers);
      setAnnouncements(mockAnnouncements);
      
      return true;
    } catch (error) {
      console.error("Failed to restore data:", error);
      return false;
    }
  };

  return (
    <AdminContext.Provider value={{
      users,
      announcements,
      addUser,
      updateUser,
      deleteUser,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      backupData,
      restoreData
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


import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// User types
export type UserRole = "vip" | "regular" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  points: number;
  vipLevel?: number;
  lastCheckIn?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
  socialLogin: (provider: string) => Promise<boolean>;
}

// Default users for the system
const defaultUsers: Record<string, { password: string; user: User }> = {
  "vip8888": {
    password: "vip8888",
    user: {
      id: "1",
      username: "vip8888",
      role: "vip",
      points: 100000000,
      vipLevel: 5,
      lastCheckIn: "",
    },
  },
  "001": {
    password: "001",
    user: {
      id: "2",
      username: "001",
      role: "vip",
      points: 1e+64,
      vipLevel: 5,
      lastCheckIn: "",
    },
  },
  "002": {
    password: "002",
    user: {
      id: "3",
      username: "002",
      role: "admin",
      points: 100000000,
    },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const userEntry = defaultUsers[username];
    
    if (userEntry && userEntry.password === password) {
      // Update last login date for VIP users
      if (userEntry.user.role === "vip") {
        const today = new Date().toISOString().split('T')[0];
        userEntry.user.lastCheckIn = today;
      }
      
      setUser(userEntry.user);
      localStorage.setItem("user", JSON.stringify(userEntry.user));
      return true;
    }
    
    return false;
  };

  // Social login function
  const socialLogin = async (provider: string): Promise<boolean> => {
    // Mock social login for demo purposes
    // In a real app, this would interact with actual OAuth providers
    console.log(`Attempting to login with ${provider}`);
    
    // Simulate successful login
    const mockSocialUser: User = {
      id: `social-${Date.now()}`,
      username: `${provider}_user_${Math.floor(Math.random() * 1000)}`,
      role: "regular",
      points: 100000000
    };
    
    // Add to default users for session persistence
    defaultUsers[mockSocialUser.username] = {
      password: "social-auth", // This password won't be used
      user: mockSocialUser
    };
    
    setUser(mockSocialUser);
    localStorage.setItem("user", JSON.stringify(mockSocialUser));
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Register function (simplified for this demo)
  const register = async (username: string, password: string): Promise<boolean> => {
    // Check if username already exists
    if (defaultUsers[username]) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      role: "regular",
      points: 100000000
    };
    
    // In a real app, this would save to a database
    defaultUsers[username] = {
      password,
      user: newUser
    };
    
    // Auto login after registration
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, socialLogin }}>
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

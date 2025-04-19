
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth, User } from "./AuthContext";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "transfer" | "gift" | "daily" | "vip" | "exchange" | "admin" | "system";
  description: string;
  fromUser?: string;
  toUser?: string;
}

interface WalletContextType {
  transactions: Transaction[];
  balance: number;
  transfer: (amount: number, toUsername: string) => Promise<boolean>;
  gift: (amount: number, toUsername: string) => Promise<boolean>;
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock transactions storage
const userTransactions: Record<string, Transaction[]> = {};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);

  // Load transactions when user changes
  useEffect(() => {
    if (user) {
      // Initialize user transactions if they don't exist
      if (!userTransactions[user.id]) {
        userTransactions[user.id] = [];
      }
      
      setTransactions(userTransactions[user.id]);
      setBalance(user.points);
    } else {
      setTransactions([]);
      setBalance(0);
    }
  }, [user]);

  // Transfer points to another user
  const transfer = async (amount: number, toUsername: string): Promise<boolean> => {
    if (!user || amount <= 0 || amount > user.points) {
      return false;
    }

    // In a real app, this would validate the recipient exists
    // For demo, we'll just assume the transfer is successful
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: amount,
      type: "transfer",
      description: `轉賬至用戶 ${toUsername}`,
      fromUser: user.username,
      toUser: toUsername
    };

    // Update local transactions
    const updatedTransactions = [...transactions, newTransaction];
    userTransactions[user.id] = updatedTransactions;
    
    setTransactions(updatedTransactions);
    setBalance(prev => prev - amount);
    
    // Update user points in localStorage
    const updatedUser = { ...user, points: user.points - amount };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    return true;
  };

  // Gift points to another user
  const gift = async (amount: number, toUsername: string): Promise<boolean> => {
    if (!user || amount <= 0 || amount > user.points) {
      return false;
    }
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: amount,
      type: "gift",
      description: `贈送給用戶 ${toUsername}`,
      fromUser: user.username,
      toUser: toUsername
    };

    // Update local transactions
    const updatedTransactions = [...transactions, newTransaction];
    userTransactions[user.id] = updatedTransactions;
    
    setTransactions(updatedTransactions);
    setBalance(prev => prev - amount);
    
    // Update user points in localStorage
    const updatedUser = { ...user, points: user.points - amount };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    return true;
  };

  // Add a transaction (for other types like daily rewards, etc.)
  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    // Update local transactions
    const updatedTransactions = [...transactions, newTransaction];
    userTransactions[user.id] = updatedTransactions;
    
    setTransactions(updatedTransactions);
    
    // Update balance based on transaction type
    const newBalance = balance + transaction.amount;
    setBalance(newBalance);
    
    // Update user points in localStorage
    const updatedUser = { ...user, points: newBalance };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <WalletContext.Provider value={{ transactions, balance, transfer, gift, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "purchase" | "refund" | "reward" | "transfer" | "gift" | "daily" | "exchange" | "system" | "vip";
  description: string;
  created_at: string;
  date: string; // Added this field for compatibility
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  depositFunds: (amount: number) => Promise<boolean>;
  withdrawFunds: (amount: number) => Promise<boolean>;
  purchaseItem: (amount: number, description: string) => Promise<boolean>;
  refundItem: (amount: number, description: string) => Promise<boolean>;
  refreshWallet: () => Promise<void>;
  addTransaction: (transaction: Partial<Transaction>) => Promise<boolean>;
  transfer: (amount: number, recipient: string, description?: string) => Promise<boolean>;
  gift: (amount: number, description: string) => Promise<boolean>;
}

const defaultWalletContext: WalletContextType = {
  balance: 0,
  transactions: [],
  loading: true,
  depositFunds: async () => false,
  withdrawFunds: async () => false,
  purchaseItem: async () => false,
  refundItem: async () => false,
  refreshWallet: async () => {},
  addTransaction: async () => false,
  transfer: async () => false,
  gift: async () => false,
};

const WalletContext = createContext<WalletContextType>(defaultWalletContext);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock wallet data for development
  const mockTransactions = [
    {
      id: "1",
      amount: 100,
      type: "deposit" as const,
      description: "初始儲值",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      amount: -50,
      type: "purchase" as const,
      description: "購買高級會員",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      amount: 200,
      type: "deposit" as const,
      description: "儲值優惠活動",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      amount: -80,
      type: "purchase" as const,
      description: "購買高級會員第二個月",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Load wallet data
  const loadWalletData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // In a real app, fetch from Supabase
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate balance from transactions
      const calculatedBalance = mockTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
      
      setBalance(calculatedBalance);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error loading wallet data:", error);
      toast.error("無法載入錢包資料");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, [isAuthenticated, user?.id]);

  // Handle transactions
  const processTransaction = async (
    amount: number, 
    type: Transaction["type"],
    description: string
  ): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error("請先登入");
      return false;
    }

    setLoading(true);
    try {
      // In a real app, save transaction to Supabase
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substring(2, 11),
        amount: type === "withdrawal" || type === "purchase" || type === "transfer" ? -Math.abs(amount) : Math.abs(amount),
        type,
        description,
        created_at: new Date().toISOString(),
        date: new Date().toISOString(),
      };
      
      // Update local state
      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev + newTransaction.amount);
      
      toast.success(`交易成功: ${description}`);
      return true;
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("交易處理失敗");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Direct transaction addition for flexibility
  const addTransaction = async (transactionData: Partial<Transaction>): Promise<boolean> => {
    if (!isAuthenticated || !transactionData.amount || !transactionData.type) {
      return false;
    }

    setLoading(true);
    try {
      const newTransaction: Transaction = {
        id: transactionData.id || Math.random().toString(36).substring(2, 11),
        amount: transactionData.amount,
        type: transactionData.type,
        description: transactionData.description || "",
        created_at: transactionData.created_at || new Date().toISOString(),
        date: transactionData.date || new Date().toISOString(),
      };
      
      // Update local state
      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev + newTransaction.amount);
      
      return true;
    } catch (error) {
      console.error("Transaction error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Wallet operations
  const depositFunds = async (amount: number): Promise<boolean> => {
    return processTransaction(amount, "deposit", `儲值 ${amount} 點`);
  };
  
  const withdrawFunds = async (amount: number): Promise<boolean> => {
    if (amount > balance) {
      toast.error("餘額不足");
      return false;
    }
    return processTransaction(amount, "withdrawal", `提領 ${amount} 點`);
  };
  
  const purchaseItem = async (amount: number, description: string): Promise<boolean> => {
    if (amount > balance) {
      toast.error("餘額不足");
      return false;
    }
    return processTransaction(amount, "purchase", description);
  };
  
  const refundItem = async (amount: number, description: string): Promise<boolean> => {
    return processTransaction(amount, "refund", description);
  };

  // Add new transfer functionality
  const transfer = async (amount: number, recipient: string, description?: string): Promise<boolean> => {
    if (amount > balance) {
      toast.error("餘額不足");
      return false;
    }
    return processTransaction(amount, "transfer", description || `轉帳 ${amount} 點給 ${recipient}`);
  };

  // Add gift functionality
  const gift = async (amount: number, description: string): Promise<boolean> => {
    return processTransaction(amount, "gift", description);
  };

  // Refresh wallet data
  const refreshWallet = async (): Promise<void> => {
    await loadWalletData();
  };

  const value = {
    balance,
    transactions,
    loading,
    depositFunds,
    withdrawFunds,
    purchaseItem,
    refundItem,
    refreshWallet,
    addTransaction,
    transfer,
    gift,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, mockTransactions } from "../services/supabase";

interface UserProfile {
  id: string;
  fullName: string;
  accountNumber: string;
}

interface Transaction {
  id: string;
  sender_account: string;
  receiver_account: string;
  receiver_name: string;
  amount: number;
  narration: string;
  transaction_type: string;
  status: string;
  created_at: string;
}

interface BankContextType {
  userProfile: UserProfile | null;
  accountBalance: number;
  recentTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  loginWithPin: (pin: string) => Promise<boolean>;
  register: (fullName: string, pin: string) => Promise<boolean>;
  verifyAccountNumber: (accountNumber: string) => Promise<string | null>;
  performTransfer: (receiverAccount: string, amount: number, narration: string) => Promise<{ success: boolean; message: string }>;
  refreshData: () => Promise<void>;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountBalance, setAccountBalance] = useState<number>(1450000.00);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    if (!userProfile) return;
    setIsLoading(true);
    try {
      // In a real app, fetch from Supabase
      // const { data, error } = await supabase.from('profiles').select('*').eq('id', userProfile.id).single();
      // setAccountBalance(data.account_balance);
      // setRecentTransactions(transactionsData);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  const loginWithPin = async (pin: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Login failed");
        return false;
      }

      const user: UserProfile = {
        id: data.user.id,
        fullName: data.user.full_name,
        accountNumber: data.user.account_number,
      };

      setUserProfile(user);
      setAccountBalance(data.user.account_balance);
      // In a real app, you'd also load transactions here
      return true;
    } catch (err) {
      setError("Authentication failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, pin: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, pin }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
        return false;
      }

      const newUser: UserProfile = {
        id: data.user.id,
        fullName: data.user.full_name,
        accountNumber: data.user.account_number,
      };
      
      setUserProfile(newUser);
      setAccountBalance(data.user.account_balance);
      return true;
    } catch (err) {
      setError("Connection error during registration");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAccountNumber = async (accountNumber: string): Promise<string | null> => {
    if (accountNumber.length !== 10) return null;
    try {
      const response = await fetch(`/api/nuban-verify/${accountNumber}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.accountName;
    } catch (err) {
      return null;
    }
  };

  const performTransfer = async (receiverAccount: string, amount: number, narration: string) => {
    if (!userProfile) return { success: false, message: "Not authenticated" };
    if (amount > accountBalance) return { success: false, message: "Insufficient funds" };

    setIsLoading(true);
    try {
      // Mock transfer for demo
      // In real app, call /api/transfer
      setAccountBalance(prev => prev - amount);
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        sender_account: userProfile.accountNumber,
        receiver_account: receiverAccount,
        receiver_name: "Recipient", // In real app, get from verification
        amount: amount,
        narration: narration,
        transaction_type: "TRANSFER",
        status: "COMPLETED",
        created_at: new Date().toISOString()
      };
      setRecentTransactions(prev => [newTx, ...prev]);
      return { success: true, message: "Transfer successful" };
    } catch (err) {
      return { success: false, message: "Transfer failed" };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BankContext.Provider
      value={{
        userProfile,
        accountBalance,
        recentTransactions,
        isLoading,
        error,
        loginWithPin,
        register,
        verifyAccountNumber,
        performTransfer,
        refreshData
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error("useBank must be used within a BankProvider");
  }
  return context;
};

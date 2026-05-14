import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const mockTransactions = [
  {
    id: "1",
    sender_account: "0123456789",
    receiver_account: "9876543210",
    receiver_name: "Netflix Inc.",
    amount: 45.00,
    narration: "Monthly Subscription",
    transaction_type: "BILL_PAY",
    status: "COMPLETED",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    sender_account: "1122334455",
    receiver_account: "0123456789",
    receiver_name: "Access User",
    amount: 650000.00,
    narration: "Monthly Salary",
    transaction_type: "DEPOSIT",
    status: "COMPLETED",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    sender_account: "0123456789",
    receiver_account: "5544332211",
    receiver_name: "Zara Flagship",
    amount: 124.50,
    narration: "POS Payment",
    transaction_type: "TRANSFER",
    status: "COMPLETED",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "4",
    sender_account: "0123456789",
    receiver_account: "9988776655",
    receiver_name: "The Blue Lobster",
    amount: 85.20,
    narration: "Dinner Outing",
    transaction_type: "TRANSFER",
    status: "COMPLETED",
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "5",
    sender_account: "0123456789",
    receiver_account: "0011223344",
    receiver_name: "HyperFiber Net",
    amount: 50.00,
    narration: "Internet Subscription",
    transaction_type: "BILL_PAY",
    status: "COMPLETED",
    created_at: new Date(Date.now() - 432000000).toISOString(),
  }
];

-- Database Schema for Access Bank Clone
-- Run this in your Supabase SQL Editor

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  account_balance DECIMAL(15, 2) DEFAULT 0.00,
  pin_hash TEXT, -- Store a hashed version of the 6-digit PIN
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  amount DECIMAL(15, 2) NOT NULL,
  sender_account TEXT NOT NULL,
  receiver_account TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  narration TEXT,
  transaction_type TEXT CHECK (transaction_type IN ('TRANSFER', 'BILL_PAY', 'AIRTIME', 'DEPOSIT')),
  status TEXT DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Simple Policies (adjust as needed for production)
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 3. Stored Procedure for Internal Transfer (Atomic Transaction)
-- This ensures that balance updates and transaction logging happen together.
-- You can call this via supabase.rpc('internal_transfer', { ... })
CREATE OR REPLACE FUNCTION internal_transfer(
  p_sender_id UUID,
  p_receiver_account TEXT,
  p_amount DECIMAL,
  p_narration TEXT
) RETURNS JSON AS $$
DECLARE
  v_receiver_id UUID;
  v_receiver_name TEXT;
  v_sender_account TEXT;
  v_sender_balance DECIMAL;
BEGIN
  -- 1. Verify sender exists and has enough balance
  SELECT account_balance, account_number INTO v_sender_balance, v_sender_account
  FROM public.profiles WHERE id = p_sender_id FOR UPDATE;
  
  IF v_sender_balance < p_amount THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient funds');
  END IF;

  -- 2. Verify receiver exists
  SELECT id, full_name INTO v_receiver_id, v_receiver_name
  FROM public.profiles WHERE account_number = p_receiver_account;
  
  IF v_receiver_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Receiver account not found');
  END IF;

  -- 3. Perform the transfer
  UPDATE public.profiles 
  SET account_balance = account_balance - p_amount 
  WHERE id = p_sender_id;
  
  UPDATE public.profiles 
  SET account_balance = account_balance + p_amount 
  WHERE id = v_receiver_id;

  -- 4. Record the transaction
  INSERT INTO public.transactions (
    sender_id, receiver_id, amount, sender_account, receiver_account, receiver_name, narration, transaction_type
  ) VALUES (
    p_sender_id, v_receiver_id, p_amount, v_sender_account, p_receiver_account, v_receiver_name, p_narration, 'TRANSFER'
  );

  RETURN json_build_object('success', true, 'message', 'Transfer successful');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

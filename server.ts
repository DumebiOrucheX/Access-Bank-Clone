import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Supabase Admin Client (using service role for atomic transactions)
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 1. Secure PIN Auth Proxy
 * Checks the custom pin_hash in the users profile table.
 */
app.post("/api/auth/pin", async (req, res) => {
  const { userId, pin } = req.body;

  if (!userId || !pin) {
    return res.status(400).json({ error: "User ID and PIN are required" });
  }

  try {
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("pin_hash")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // In a real app, use bcrypt to compare hashes. 
    // Here we assume pin_hash is the stored 6-digit pin for demo purposes.
    if (profile.pin_hash === pin) {
      return res.json({ success: true, message: "PIN verified" });
    } else {
      return res.status(401).json({ error: "Invalid PIN" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 2. NUBAN Verification Logic
 * Mock Name Enquiry feature.
 */
app.get("/api/nuban-verify/:accountNumber", async (req, res) => {
  const { accountNumber } = req.params;

  if (accountNumber.length !== 10) {
    return res.status(400).json({ error: "Invalid account number length" });
  }

  try {
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("account_number", accountNumber)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ accountName: profile.full_name });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 3. The Transaction Engine
 * Performs an Atomic Transaction via Supabase RPC.
 */
app.post("/api/transfer", async (req, res) => {
  const { senderId, receiverAccount, amount, narration } = req.body;

  if (!senderId || !receiverAccount || !amount) {
    return res.status(400).json({ error: "Missing required transfer details" });
  }

  try {
    // Call the SQL function we defined in schema.sql
    const { data, error } = await supabaseAdmin.rpc("internal_transfer", {
      p_sender_id: senderId,
      p_receiver_account: receiverAccount,
      p_amount: amount,
      p_narration: narration || "Internal Transfer"
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data.success) {
      return res.status(400).json({ error: data.message });
    }

    res.json({ success: true, message: data.message });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

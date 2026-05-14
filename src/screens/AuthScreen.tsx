import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useBank } from "../context/BankContext";
import { UserCircle, Delete, Fingerprint } from "lucide-react";

export const AuthScreen: React.FC = () => {
  const [pin, setPin] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [regStep, setRegStep] = useState(1); // 1: Name, 2: PIN

  const navigate = useNavigate();
  const { loginWithPin, register, isLoading, error } = useBank();

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        if (isRegistering) {
          handleRegister(newPin);
        } else {
          handleLogin(newPin);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleLogin = async (finalPin: string) => {
    const success = await loginWithPin(finalPin);
    if (success) {
      navigate("/dashboard");
    } else {
      setTimeout(() => setPin(""), 1000);
    }
  };

  const handleRegister = async (finalPin: string) => {
    const success = await register(fullName, finalPin);
    if (success) {
      navigate("/dashboard");
    } else {
      setTimeout(() => {
        setPin("");
        setRegStep(1);
        setIsRegistering(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-between p-8 text-white font-sans overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 opacity-5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 opacity-5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none"></div>
      
      <div className="z-10 mt-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center font-bold text-4xl shadow-2xl shadow-orange-500/20 mb-6 transition-transform hover:scale-110">
          A
        </div>
        <h1 className="text-2xl font-bold tracking-tight">AccessClone</h1>
        <div className="mt-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{isRegistering ? "Registration Mode" : "Secure Environment"}</p>
        </div>
      </div>

      <div className="z-10 w-full max-w-xs flex flex-col items-center space-y-12">
        <AnimatePresence mode="wait">
          {isRegistering && regStep === 1 ? (
            <motion.div 
              key="reg-step-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center w-full"
            >
              <p className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-widest">Create Your Account</p>
              <input 
                autoFocus
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-lg font-bold focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
              />
              <button 
                onClick={() => setRegStep(2)}
                disabled={!fullName.trim()}
                className="mt-6 w-full py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 disabled:opacity-30 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Next Step
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="auth-pin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <p className="text-slate-400 text-sm font-medium mb-4">{isRegistering ? `Hi ${fullName.split(' ')[0]}, Set 6-Digit PIN` : "Enter Secure PIN"}</p>
              <div className="flex justify-center space-x-4 h-6 items-center">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: pin.length === i ? 1.2 : 1,
                      backgroundColor: i < pin.length ? "#f97316" : "rgba(255, 255, 255, 0.05)",
                    }}
                    className="w-4 h-4 rounded-full transition-all duration-200"
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-xs mt-4 font-bold uppercase tracking-tighter animate-pulse">{error}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        {(!isRegistering || regStep === 2) && (
          <div className="flex flex-col items-center space-y-6">
            <button className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 border border-white/5 transition-all group active:scale-95 shadow-xl">
              <UserCircle size={40} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
            </button>
            <div className="flex space-x-8">
              {!isRegistering ? (
                <>
                  <button className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:text-white transition-colors">Forgot PIN</button>
                  <button 
                    onClick={() => setIsRegistering(true)}
                    className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Register
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { setIsRegistering(false); setRegStep(1); setPin(""); }}
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {(!isRegistering || regStep === 2) && (
          <div className="grid grid-cols-3 gap-y-4 gap-x-8 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                disabled={isLoading}
                className="h-16 rounded-[2rem] flex items-center justify-center text-2xl font-bold text-white bg-white/5 hover:bg-white/10 active:scale-90 transition-all border border-white/5 disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            <button className="h-16 rounded-[2rem] flex items-center justify-center text-slate-500 hover:text-orange-500 active:scale-90 transition-all">
              <Fingerprint size={32} />
            </button>
            <button
              onClick={() => handleKeyPress("0")}
              disabled={isLoading}
              className="h-16 rounded-[2rem] flex items-center justify-center text-2xl font-bold text-white bg-white/5 hover:bg-white/10 active:scale-90 transition-all border border-white/5 disabled:opacity-50"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              disabled={isLoading}
              className="h-16 rounded-[2rem] flex items-center justify-center text-slate-500 hover:text-orange-500 active:scale-90 transition-all disabled:opacity-50"
            >
              <Delete size={32} />
            </button>
          </div>
        )}
      </div>

      <div className="z-10 text-center pb-8 opacity-40">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">V2.4.0 • Build 882</p>
        <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest max-w-[200px]">Licensed to AccessClone Financial Services Corp.</p>
      </div>
    </div>
  );
};

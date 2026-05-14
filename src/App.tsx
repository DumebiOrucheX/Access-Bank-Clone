/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BankProvider, useBank } from "./context/BankContext";
import { NavigationLayout } from "./components/NavigationLayout";
import { SplashScreen } from "./screens/SplashScreen";
import { AuthScreen } from "./screens/AuthScreen";
import { Dashboard } from "./screens/Dashboard";
import { TransferScreen } from "./screens/TransferScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { PaymentsScreen } from "./screens/PaymentsScreen";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useBank();
  if (!userProfile) {
    return <Navigate to="/auth" replace />;
  }
  return <NavigationLayout>{children}</NavigationLayout>;
};

export default function App() {
  return (
    <BankProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/transfer" element={
            <ProtectedRoute>
              <TransferScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/history" element={
            <ProtectedRoute>
              <HistoryScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/payments" element={
            <ProtectedRoute>
              <PaymentsScreen />
            </ProtectedRoute>
          } />

          <Route path="/more" element={
            <ProtectedRoute>
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#44474d]">
                <span className="material-symbols-outlined text-6xl mb-4">construction</span>
                <p className="font-bold">Settings & More coming soon</p>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </BankProvider>
  );
}


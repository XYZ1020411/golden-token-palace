
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import News from "./pages/News";
import Weather from "./pages/Weather";
import Admin from "./pages/Admin";
import BackendManagement from "./pages/BackendManagement";
import DailyNovel from "./pages/DailyNovel";
import GiftCode from "./pages/GiftCode";
import Inbox from "./pages/Inbox";
import MangaFox from "./pages/MangaFox";
import ScanBarcode from "./pages/ScanBarcode";
import VipRewards from "./pages/VipRewards";
import WishPool from "./pages/WishPool";
import BalloonGame from "./pages/BalloonGame";
import DartGame from "./pages/DartGame";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { WalletProvider } from "./context/WalletContext";
import { ProductProvider } from "./context/ProductContext";
import { VipProvider } from "./context/VipContext";
import { InfoServicesProvider } from "./context/InfoServicesContext";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="app">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <AdminProvider>
            <WalletProvider>
              <ProductProvider>
                <VipProvider>
                  <InfoServicesProvider>
                    <Toaster />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/weather" element={<Weather />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/backend" element={<BackendManagement />} />
                      <Route path="/daily-novel" element={<DailyNovel />} />
                      <Route path="/gift-code" element={<GiftCode />} />
                      <Route path="/inbox" element={<Inbox />} />
                      <Route path="/manga-fox" element={<MangaFox />} />
                      <Route path="/scan" element={<ScanBarcode />} />
                      <Route path="/vip-rewards" element={<VipRewards />} />
                      <Route path="/wish-pool" element={<WishPool />} />
                      <Route path="/balloon-game" element={<BalloonGame />} />
                      <Route path="/dart-game" element={<DartGame />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </InfoServicesProvider>
                </VipProvider>
              </ProductProvider>
            </WalletProvider>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;

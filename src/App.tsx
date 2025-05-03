
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Wallet from "./pages/Wallet";
import News from "./pages/News";
import Weather from "./pages/Weather";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import BackendManagement from "./pages/BackendManagement";
import Inbox from "./pages/Inbox";
import VipRewards from "./pages/VipRewards";
import ScanBarcode from "./pages/ScanBarcode";
import BalloonGame from "./pages/BalloonGame";
import DartGame from "./pages/DartGame";
import NovelSystem from "./pages/NovelSystem";
import GiftCode from "./pages/GiftCode";
import DailyNovel from "./pages/DailyNovel";

import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { ProductProvider } from "./context/ProductContext";
import { InfoServicesProvider } from "./context/InfoServicesContext";
import { AdminProvider } from "./context/AdminContext";
import { VipProvider } from "./context/VipContext";

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AiCustomerService } from "./components/customer-service/AiCustomerService";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <WalletProvider>
          <ProductProvider>
            <InfoServicesProvider>
              <AdminProvider>
                <VipProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/backend" element={<BackendManagement />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/vip" element={<VipRewards />} />
                    <Route path="/scan" element={<ScanBarcode />} />
                    <Route path="/balloon-game" element={<BalloonGame />} />
                    <Route path="/dart-game" element={<DartGame />} />
                    <Route path="/novels" element={<NovelSystem />} />
                    <Route path="/daily-novel" element={<DailyNovel />} />
                    <Route path="/gift-code" element={<GiftCode />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <AiCustomerService />
                  <Toaster />
                  <Sonner />
                </VipProvider>
              </AdminProvider>
            </InfoServicesProvider>
          </ProductProvider>
        </WalletProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

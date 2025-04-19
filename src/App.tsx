import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wallet from "./pages/Wallet";
import VipRewards from "./pages/VipRewards";
import Weather from "./pages/Weather";
import News from "./pages/News";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { VipProvider } from "./context/VipContext";
import { AdminProvider } from "./context/AdminContext";
import { InfoServicesProvider } from "./context/InfoServicesContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WalletProvider>
          <VipProvider>
            <AdminProvider>
              <InfoServicesProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/vip" element={<VipRewards />} />
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </InfoServicesProvider>
            </AdminProvider>
          </VipProvider>
        </WalletProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

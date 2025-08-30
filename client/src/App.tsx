import "./global.css";

import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProducerDashboard from "./pages/ProducerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import NotFound from "./pages/NotFound";

// Layout
import DashboardLayout from "./components/Layout/DashboardLayout";

const queryClient = new QueryClient();

function AppContent() {
  const [userRole, setUserRole] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRoleSelect = (role: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserRole("");
    setIsLoggedIn(false);
  };

  const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">{description}</p>
        <div className="mt-6 p-4 bg-eco-green-50 dark:bg-eco-green-900/20 rounded-lg border border-eco-green-200 dark:border-eco-green-800">
          <p className="text-sm text-eco-green-700 dark:text-eco-green-300">
            This page is coming soon! Continue prompting to have me build out this functionality.
          </p>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return <Login onRoleSelect={handleRoleSelect} />;
  }

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />

        {/* Producer Routes */}
        {userRole === "producer" && (
          <Route path="/requests" element={<ProducerDashboard />} />
        )}

        {/* Certifier Routes */}
        {userRole === "certifier" && (
          <Route
            path="/certify"
            element={
              <PlaceholderPage
                title="Certifier Dashboard"
                description="Review and approve green hydrogen credit requests from producers."
              />
            }
          />
        )}

        {/* Buyer Routes */}
        {userRole === "buyer" && (
          <Route path="/marketplace" element={<BuyerDashboard />} />
        )}

        {/* Regulator Routes */}
        {userRole === "regulator" && (
          <Route
            path="/audit"
            element={
              <PlaceholderPage
                title="Regulatory Dashboard"
                description="Monitor the entire green hydrogen credit ecosystem with comprehensive auditing tools."
              />
            }
          />
        )}

        {/* Catch all for role-specific 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

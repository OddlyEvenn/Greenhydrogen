import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Menu, 
  Home, 
  Factory, 
  Shield, 
  ShoppingCart, 
  Scale, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: string;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  roles: string[];
}

export default function DashboardLayout({ children, userRole, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const navigationItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard", roles: ["producer", "certifier", "buyer", "regulator"] },
    { id: "requests", label: "Credit Requests", icon: Factory, href: "/requests", roles: ["producer"] },
    { id: "certify", label: "Certify Credits", icon: Shield, href: "/certify", roles: ["certifier"] },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart, href: "/marketplace", roles: ["buyer"] },
    { id: "audit", label: "Audit Log", icon: Scale, href: "/audit", roles: ["regulator"] },
  ];

  const roleInfo = {
    producer: { title: "Producer", icon: Factory, color: "bg-eco-green-500" },
    certifier: { title: "Certifier", icon: Shield, color: "bg-eco-blue-500" },
    buyer: { title: "Buyer", icon: ShoppingCart, color: "bg-eco-green-500" },
    regulator: { title: "Regulator", icon: Scale, color: "bg-eco-blue-500" },
  };

  const currentRole = roleInfo[userRole as keyof typeof roleInfo];
  const RoleIcon = currentRole?.icon;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={cn("min-h-screen bg-background", darkMode && "dark")}>
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo & Role */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", currentRole?.color)}>
                {RoleIcon && <RoleIcon className="w-4 h-4 text-white" />}
              </div>
              {sidebarOpen && (
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">H2 Credits</h2>
                  <Badge variant="secondary" className="text-xs">
                    {currentRole?.title}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems
                .filter(item => item.roles.includes(userRole))
                .map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ItemIcon className="w-5 h-5" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </nav>

          {/* Settings & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Settings className="w-5 h-5" />
                {sidebarOpen && <span>Settings</span>}
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-16")}>
        {/* Topbar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentRole?.title} Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-gray-500" />
                <Switch
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
                <Moon className="w-4 h-4 text-gray-500" />
              </div>

              {/* Wallet Info */}
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Wallet className="w-4 h-4 text-eco-green-500" />
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  0x1234...5678
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

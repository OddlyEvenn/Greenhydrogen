import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Settings,
  BarChart3,
  Users,
  Trophy,
} from "lucide-react";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { GamificationSystem } from "@/components/gamification/GamificationSystem";
import { RealTimeUpdates } from "@/components/realtime/RealTimeUpdates";
import { ReportsSystem } from "@/components/reports/ReportsSystem";
import { HydrogenMoleculeViewer } from "@/components/3d/HydrogenVisualizations";

interface DashboardProps {
  userRole: string;
}

export default function Dashboard({ userRole }: DashboardProps) {
  const [activeView, setActiveView] = useState("overview");

  const views = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "customizable", label: "Customizable", icon: Settings },
    { id: "gamification", label: "Achievements", icon: Trophy },
    { id: "realtime", label: "Live Updates", icon: Activity },
    { id: "reports", label: "Reports", icon: Users },
  ];

  if (activeView !== "overview") {
    return (
      <div className="space-y-6">
        {/* View Navigation */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {views.map((view) => {
            const IconComponent = view.icon;
            return (
              <Button
                key={view.id}
                variant={activeView === view.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView(view.id)}
                className="gap-2"
              >
                <IconComponent className="w-4 h-4" />
                {view.label}
              </Button>
            );
          })}
        </div>

        {/* Render Selected View */}
        {activeView === "customizable" && (
          <CustomizableDashboard userRole={userRole} />
        )}
        {activeView === "gamification" && (
          <GamificationSystem userRole={userRole} />
        )}
        {activeView === "realtime" && <RealTimeUpdates userRole={userRole} />}
        {activeView === "reports" && <ReportsSystem userRole={userRole} />}
      </div>
    );
  }
  const roleMetrics = {
    producer: {
      title: "Production Overview",
      stats: [
        {
          label: "Credits Requested",
          value: "1,234",
          trend: "+12%",
          icon: Activity,
          color: "text-eco-green-600",
        },
        {
          label: "Credits Approved",
          value: "987",
          trend: "+8%",
          icon: TrendingUp,
          color: "text-eco-blue-600",
        },
        {
          label: "Pending Reviews",
          value: "45",
          trend: "-3%",
          icon: Activity,
          color: "text-yellow-600",
        },
        {
          label: "Total Energy (MWh)",
          value: "15,678",
          trend: "+15%",
          icon: Zap,
          color: "text-eco-green-600",
        },
      ],
    },
    certifier: {
      title: "Certification Overview",
      stats: [
        {
          label: "Pending Requests",
          value: "23",
          trend: "+5%",
          icon: Activity,
          color: "text-yellow-600",
        },
        {
          label: "Approved Today",
          value: "18",
          trend: "+22%",
          icon: TrendingUp,
          color: "text-eco-green-600",
        },
        {
          label: "Rejected Today",
          value: "2",
          trend: "-12%",
          icon: TrendingDown,
          color: "text-red-600",
        },
        {
          label: "Avg Review Time",
          value: "2.4h",
          trend: "-8%",
          icon: Activity,
          color: "text-eco-blue-600",
        },
      ],
    },
    buyer: {
      title: "Purchase Overview",
      stats: [
        {
          label: "Credits Owned",
          value: "456",
          trend: "+18%",
          icon: Activity,
          color: "text-eco-green-600",
        },
        {
          label: "Credits Retired",
          value: "234",
          trend: "+25%",
          icon: TrendingUp,
          color: "text-eco-blue-600",
        },
        {
          label: "Carbon Neutral %",
          value: "68%",
          trend: "+12%",
          icon: TrendingUp,
          color: "text-eco-green-600",
        },
        {
          label: "Total Spent",
          value: "$12,450",
          trend: "+20%",
          icon: Activity,
          color: "text-eco-blue-600",
        },
      ],
    },
    regulator: {
      title: "System Overview",
      stats: [
        {
          label: "Total Credits Issued",
          value: "45,678",
          trend: "+14%",
          icon: Activity,
          color: "text-eco-green-600",
        },
        {
          label: "Total Credits Retired",
          value: "23,456",
          trend: "+18%",
          icon: TrendingUp,
          color: "text-eco-blue-600",
        },
        {
          label: "Active Producers",
          value: "127",
          trend: "+8%",
          icon: Activity,
          color: "text-eco-green-600",
        },
        {
          label: "Active Buyers",
          value: "89",
          trend: "+12%",
          icon: Activity,
          color: "text-eco-blue-600",
        },
      ],
    },
  };

  const currentMetrics = roleMetrics[userRole as keyof typeof roleMetrics];

  return (
    <div className="space-y-6">
      {/* View Navigation */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {views.map((view) => {
          const IconComponent = view.icon;
          return (
            <Button
              key={view.id}
              variant={activeView === view.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView(view.id)}
              className="gap-2"
            >
              <IconComponent className="w-4 h-4" />
              {view.label}
            </Button>
          );
        })}
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-eco-green-500 to-eco-blue-500 rounded-lg p-6 text-white relative overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="opacity-90">
              {userRole === "producer" &&
                "Manage your green hydrogen production and credit requests."}
              {userRole === "certifier" &&
                "Review and certify green hydrogen credit applications."}
              {userRole === "buyer" &&
                "Purchase credits and track your carbon neutrality progress."}
              {userRole === "regulator" &&
                "Monitor the entire green hydrogen credit ecosystem."}
            </p>
          </div>
          <div className="hidden lg:block">
            <HydrogenMoleculeViewer width={200} height={150} animated={true} />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {currentMetrics.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentMetrics.stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const isPositive = stat.trend.startsWith("+");

            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                    <Badge
                      variant={isPositive ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <CardDescription className="text-sm mt-1">
                    {stat.label}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userRole === "producer" && (
            <>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-eco-green-600">
                  Request New Credits
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Submit a new green hydrogen production for certification
                </p>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-eco-blue-600">
                  View Requests
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Check the status of your pending credit requests
                </p>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-eco-green-600">
                  Production Analytics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  View detailed analytics of your production history
                </p>
              </Card>
            </>
          )}

          {userRole === "buyer" && (
            <>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-eco-green-600">
                  Browse Marketplace
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Discover and purchase available green hydrogen credits
                </p>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-eco-blue-600">
                  Retire Credits
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Retire credits to offset your carbon footprint
                </p>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-eco-green-600">
                  Carbon Reports
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Generate reports on your sustainability progress
                </p>
              </Card>
            </>
          )}

          {(userRole === "certifier" || userRole === "regulator") && (
            <Card className="p-4 col-span-full text-center py-8">
              <h3 className="font-semibold text-gray-600 dark:text-gray-400">
                {userRole === "certifier" ? "Certification" : "Regulatory"}{" "}
                dashboard coming soon...
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Full features will be available in the next update
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

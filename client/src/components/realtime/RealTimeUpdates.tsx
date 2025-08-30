import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Pause,
  Play,
  Bell,
  Settings,
  Filter,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ActivityItem {
  id: string;
  type:
    | "credit_request"
    | "credit_approved"
    | "trade_completed"
    | "user_joined"
    | "system_update"
    | "price_change";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  amount?: number;
  status?: "success" | "warning" | "error" | "info";
  metadata?: Record<string, any>;
}

interface LiveMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
  icon: any;
  color: string;
  unit?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "credit_approved",
    title: "Credit Request Approved",
    description: "1,500 kg H2 credits approved for GreenTech Industries",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    user: "GreenTech Industries",
    amount: 1500,
    status: "success",
  },
  {
    id: "2",
    type: "trade_completed",
    title: "Trade Completed",
    description: "CleanEnergy Corp purchased 500 credits at $12.50/unit",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: "CleanEnergy Corp",
    amount: 500,
    status: "success",
  },
  {
    id: "3",
    type: "price_change",
    title: "Price Alert",
    description: "H2 credit price increased to $12.75/unit (+2.0%)",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    status: "info",
  },
  {
    id: "4",
    type: "user_joined",
    title: "New User Registered",
    description: "EcoFuel Solutions joined as a verified producer",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    user: "EcoFuel Solutions",
    status: "info",
  },
];

const mockMetrics: LiveMetric[] = [
  {
    id: "active_users",
    label: "Active Users",
    value: 1247,
    previousValue: 1198,
    change: 49,
    changePercent: 4.1,
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    id: "credits_traded",
    label: "Credits Traded",
    value: 8492,
    previousValue: 8201,
    change: 291,
    changePercent: 3.5,
    trend: "up",
    icon: TrendingUp,
    color: "text-green-600",
    unit: "kg H2",
  },
  {
    id: "avg_price",
    label: "Avg. Price",
    value: 12.75,
    previousValue: 12.5,
    change: 0.25,
    changePercent: 2.0,
    trend: "up",
    icon: Activity,
    color: "text-purple-600",
    unit: "$/kg",
  },
  {
    id: "system_load",
    label: "System Load",
    value: 67,
    previousValue: 71,
    change: -4,
    changePercent: -5.6,
    trend: "down",
    icon: Zap,
    color: "text-orange-600",
    unit: "%",
  },
];

export function RealTimeUpdates({ userRole }: { userRole: string }) {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [metrics, setMetrics] = useState<LiveMetric[]>(mockMetrics);
  const [isConnected, setIsConnected] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { toast } = useToast();

  // Simulate real-time data updates
  const generateNewActivity = useCallback(() => {
    const activityTypes = [
      {
        type: "credit_request" as const,
        title: "New Credit Request",
        description: "Producer submitted request for verification",
        status: "info" as const,
      },
      {
        type: "trade_completed" as const,
        title: "Trade Completed",
        description: "Credit exchange successfully processed",
        status: "success" as const,
      },
      {
        type: "price_change" as const,
        title: "Price Update",
        description: "Market price fluctuation detected",
        status: "warning" as const,
      },
    ];

    const randomType =
      activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      ...randomType,
      timestamp: new Date().toISOString(),
      amount: Math.floor(Math.random() * 2000) + 100,
    };

    setActivities((prev) => [newActivity, ...prev.slice(0, 19)]); // Keep only last 20 items

    // Show toast notification for important activities
    if (
      randomType.type === "trade_completed" ||
      randomType.type === "credit_request"
    ) {
      toast({
        title: randomType.title,
        description: randomType.description,
        duration: 3000,
      });
    }
  }, [toast]);

  // Simulate metrics updates
  const updateMetrics = useCallback(() => {
    setMetrics((prev) =>
      prev.map((metric) => {
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const newValue = Math.max(0, metric.value * (1 + variation));
        const change = newValue - metric.value;
        const changePercent = (change / metric.value) * 100;

        return {
          ...metric,
          previousValue: metric.value,
          value: newValue,
          change,
          changePercent,
          trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
        };
      }),
    );
  }, []);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh || isPaused) return;

    const activityTimer = setInterval(generateNewActivity, 8000); // New activity every 8 seconds
    const metricsTimer = setInterval(updateMetrics, 5000); // Update metrics every 5 seconds

    return () => {
      clearInterval(activityTimer);
      clearInterval(metricsTimer);
    };
  }, [autoRefresh, isPaused, generateNewActivity, updateMetrics]);

  // Connection status simulation
  useEffect(() => {
    const connectionTimer = setInterval(() => {
      // Simulate occasional disconnections
      if (Math.random() < 0.05) {
        // 5% chance of disconnection
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 3000); // Reconnect after 3 seconds
      }
    }, 10000);

    return () => clearInterval(connectionTimer);
  }, []);

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case "credit_approved":
        return CheckCircle;
      case "credit_request":
        return Clock;
      case "trade_completed":
        return TrendingUp;
      case "user_joined":
        return Users;
      case "price_change":
        return Activity;
      case "system_update":
        return RefreshCw;
      default:
        return AlertCircle;
    }
  };

  const getActivityColor = (status?: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "info":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true;
    return activity.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Connection Status & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                isConnected ? "text-green-600" : "text-red-600",
              )}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {isConnected && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                Live updates
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          const isPositive = metric.change > 0;

          return (
            <Card key={metric.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={cn("w-5 h-5", metric.color)} />
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm",
                      isPositive ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(metric.changePercent).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {typeof metric.value === "number"
                    ? metric.value.toFixed(metric.id === "avg_price" ? 2 : 0)
                    : metric.value}
                  {metric.unit && (
                    <span className="text-sm text-muted-foreground ml-1">
                      {metric.unit}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
                <div
                  className={cn(
                    "text-xs",
                    isPositive ? "text-green-600" : "text-red-600",
                  )}
                >
                  {isPositive ? "+" : ""}
                  {metric.change.toFixed(
                    metric.id === "avg_price" ? 2 : 0,
                  )}{" "}
                  from last update
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Activity Feed
              </CardTitle>
              <CardDescription>
                Real-time system activities and updates
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Activities</option>
                <option value="credit_request">Credit Requests</option>
                <option value="trade_completed">Trades</option>
                <option value="price_change">Price Changes</option>
                <option value="user_joined">New Users</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {filteredActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(
                  activity.type,
                  activity.status,
                );
                const isRecent = index < 3; // Highlight recent activities

                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border transition-all duration-300",
                      isRecent
                        ? "bg-primary/5 border-primary/20 shadow-sm"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        getActivityColor(activity.status),
                      )}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">
                          {activity.title}
                        </h4>
                        {isRecent && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          {format(new Date(activity.timestamp), "HH:mm:ss")}
                        </span>
                        {activity.user && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {activity.user}
                          </span>
                        )}
                        {activity.amount && (
                          <span className="font-medium text-eco-green-600">
                            {activity.amount.toLocaleString()} kg H2
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">All systems operational</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Server Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">23ms</div>
            <div className="text-sm text-muted-foreground">
              Average response time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Data Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm">Syncing in real-time</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Hook for real-time notifications
export function useRealTimeNotifications() {
  const { toast } = useToast();

  const showNotification = useCallback(
    (
      title: string,
      description: string,
      type: "success" | "warning" | "error" | "info" = "info",
    ) => {
      toast({
        title,
        description,
        variant: type === "error" ? "destructive" : "default",
        duration: 4000,
      });
    },
    [toast],
  );

  return { showNotification };
}

// Component for embedding live metrics in other components
export function LiveMetricCard({ metric }: { metric: LiveMetric }) {
  const IconComponent = metric.icon;
  const isPositive = metric.change > 0;

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <div className={cn("p-2 rounded-full bg-muted", metric.color)}>
        <IconComponent className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{metric.label}</div>
        <div className="text-lg font-bold">
          {metric.value.toFixed(metric.id === "avg_price" ? 2 : 0)}
          {metric.unit && (
            <span className="text-xs text-muted-foreground ml-1">
              {metric.unit}
            </span>
          )}
        </div>
      </div>
      <div
        className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-600" : "text-red-600",
        )}
      >
        {isPositive ? "+" : ""}
        {metric.changePercent.toFixed(1)}%
      </div>
    </div>
  );
}

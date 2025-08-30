import { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  LayoutGrid,
  Plus,
  Settings,
  Move,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Copy,
  Download,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AnimatedCounter,
  InteractiveLineChart,
  InteractiveBarChart,
  InteractivePieChart,
} from "../charts/AdvancedCharts";
import { RealTimeUpdates, LiveMetricCard } from "../realtime/RealTimeUpdates";
import {
  HydrogenMoleculeViewer,
  CreditVisualization,
} from "../3d/HydrogenVisualizations";
import { useToast } from "@/hooks/use-toast";

interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  description?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
  visible: boolean;
  locked?: boolean;
}

interface WidgetType {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: "metrics" | "charts" | "data" | "realtime" | "3d" | "custom";
  defaultConfig: Record<string, any>;
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
}

const availableWidgets: WidgetType[] = [
  {
    id: "counter",
    name: "Metric Counter",
    description: "Display key metrics with animated counters",
    icon: LayoutGrid,
    category: "metrics",
    defaultConfig: {
      metric: "credits",
      label: "Total Credits",
      value: 1250,
      trend: 12,
    },
    minSize: { width: 1, height: 1 },
    maxSize: { width: 2, height: 1 },
  },
  {
    id: "line_chart",
    name: "Line Chart",
    description: "Show trends over time",
    icon: LayoutGrid,
    category: "charts",
    defaultConfig: { title: "Production Trends", dataSource: "production" },
    minSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
  },
  {
    id: "bar_chart",
    name: "Bar Chart",
    description: "Compare categories",
    icon: LayoutGrid,
    category: "charts",
    defaultConfig: { title: "Monthly Comparison", dataSource: "monthly" },
    minSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
  },
  {
    id: "pie_chart",
    name: "Pie Chart",
    description: "Show distribution",
    icon: LayoutGrid,
    category: "charts",
    defaultConfig: { title: "Credit Distribution", dataSource: "distribution" },
    minSize: { width: 2, height: 2 },
    maxSize: { width: 3, height: 3 },
  },
  {
    id: "activity_feed",
    name: "Activity Feed",
    description: "Live system activities",
    icon: LayoutGrid,
    category: "realtime",
    defaultConfig: { maxItems: 10, autoRefresh: true },
    minSize: { width: 2, height: 3 },
    maxSize: { width: 3, height: 4 },
  },
  {
    id: "hydrogen_3d",
    name: "3D Hydrogen Molecule",
    description: "Interactive 3D visualization",
    icon: LayoutGrid,
    category: "3d",
    defaultConfig: { animated: true, controls: false },
    minSize: { width: 2, height: 2 },
    maxSize: { width: 3, height: 3 },
  },
  {
    id: "credit_viz",
    name: "Credit Visualization",
    description: "3D credit tokens display",
    icon: LayoutGrid,
    category: "3d",
    defaultConfig: { credits: 5, animated: true },
    minSize: { width: 2, height: 2 },
    maxSize: { width: 3, height: 3 },
  },
];

const defaultDashboard: DashboardWidget[] = [
  {
    id: "1",
    type: "counter",
    title: "Total Credits",
    position: { x: 0, y: 0 },
    size: { width: 1, height: 1 },
    config: {
      metric: "credits",
      label: "Total Credits",
      value: 1250,
      trend: 12,
    },
    visible: true,
  },
  {
    id: "2",
    type: "counter",
    title: "Active Trades",
    position: { x: 1, y: 0 },
    size: { width: 1, height: 1 },
    config: { metric: "trades", label: "Active Trades", value: 47, trend: -3 },
    visible: true,
  },
  {
    id: "3",
    type: "line_chart",
    title: "Production Trends",
    position: { x: 2, y: 0 },
    size: { width: 2, height: 2 },
    config: { title: "Production Trends", dataSource: "production" },
    visible: true,
  },
  {
    id: "4",
    type: "activity_feed",
    title: "Recent Activity",
    position: { x: 0, y: 1 },
    size: { width: 2, height: 2 },
    config: { maxItems: 5, autoRefresh: true },
    visible: true,
  },
];

export function CustomizableDashboard({ userRole }: { userRole: string }) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultDashboard);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [gridSize, setGridSize] = useState(4); // 4x4 grid

  const { toast } = useToast();

  // Sample data for charts
  const sampleData = {
    production: [
      { name: "Jan", value: 1200 },
      { name: "Feb", value: 1900 },
      { name: "Mar", value: 1600 },
      { name: "Apr", value: 2100 },
      { name: "May", value: 1800 },
      { name: "Jun", value: 2400 },
    ],
    monthly: [
      { name: "Jan", value: 65 },
      { name: "Feb", value: 78 },
      { name: "Mar", value: 90 },
      { name: "Apr", value: 81 },
    ],
    distribution: [
      { name: "Production", value: 45 },
      { name: "Trading", value: 30 },
      { name: "Retired", value: 25 },
    ],
  };

  const addWidget = useCallback(
    (type: string) => {
      const widgetType = availableWidgets.find((w) => w.id === type);
      if (!widgetType) return;

      // Find available position
      const newWidget: DashboardWidget = {
        id: Date.now().toString(),
        type,
        title: widgetType.name,
        position: { x: 0, y: 0 }, // Will be calculated
        size: widgetType.minSize,
        config: { ...widgetType.defaultConfig },
        visible: true,
      };

      // Simple position finding (can be improved)
      let placed = false;
      for (let y = 0; y < gridSize && !placed; y++) {
        for (
          let x = 0;
          x < gridSize - newWidget.size.width + 1 && !placed;
          x++
        ) {
          const conflicts = widgets.some(
            (widget) =>
              widget.visible &&
              x < widget.position.x + widget.size.width &&
              x + newWidget.size.width > widget.position.x &&
              y < widget.position.y + widget.size.height &&
              y + newWidget.size.height > widget.position.y,
          );

          if (!conflicts) {
            newWidget.position = { x, y };
            placed = true;
          }
        }
      }

      if (placed) {
        setWidgets((prev) => [...prev, newWidget]);
        toast({
          title: "Widget Added",
          description: `${widgetType.name} has been added to your dashboard.`,
        });
      } else {
        toast({
          title: "No Space Available",
          description:
            "Please remove or resize existing widgets to make space.",
          variant: "destructive",
        });
      }
    },
    [widgets, gridSize, toast],
  );

  const removeWidget = useCallback(
    (id: string) => {
      setWidgets((prev) => prev.filter((widget) => widget.id !== id));
      setSelectedWidget(null);
      toast({
        title: "Widget Removed",
        description: "Widget has been removed from your dashboard.",
      });
    },
    [toast],
  );

  const duplicateWidget = useCallback(
    (id: string) => {
      const widget = widgets.find((w) => w.id === id);
      if (!widget) return;

      const newWidget: DashboardWidget = {
        ...widget,
        id: Date.now().toString(),
        title: `${widget.title} (Copy)`,
        position: { x: widget.position.x + 1, y: widget.position.y },
      };

      setWidgets((prev) => [...prev, newWidget]);
    },
    [widgets],
  );

  const updateWidget = useCallback(
    (id: string, updates: Partial<DashboardWidget>) => {
      setWidgets((prev) =>
        prev.map((widget) =>
          widget.id === id ? { ...widget, ...updates } : widget,
        ),
      );
    },
    [],
  );

  const resetDashboard = useCallback(() => {
    setWidgets(defaultDashboard);
    setIsEditMode(false);
    setSelectedWidget(null);
    toast({
      title: "Dashboard Reset",
      description: "Dashboard has been reset to default layout.",
    });
  }, [toast]);

  const saveDashboardLayout = useCallback(() => {
    // In a real app, this would save to backend
    localStorage.setItem("dashboard-layout", JSON.stringify(widgets));
    toast({
      title: "Layout Saved",
      description: "Your dashboard layout has been saved.",
    });
  }, [widgets, toast]);

  const loadDashboardLayout = useCallback(() => {
    const saved = localStorage.getItem("dashboard-layout");
    if (saved) {
      try {
        const layout = JSON.parse(saved);
        setWidgets(layout);
        toast({
          title: "Layout Loaded",
          description: "Your saved dashboard layout has been loaded.",
        });
      } catch (error) {
        toast({
          title: "Error Loading Layout",
          description: "Failed to load saved layout.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const renderWidget = useCallback(
    (widget: DashboardWidget) => {
      const isSelected = selectedWidget === widget.id;

      let content = null;

      switch (widget.type) {
        case "counter":
          content = (
            <AnimatedCounter
              value={widget.config.value}
              label={widget.config.label}
              trend={widget.config.trend}
            />
          );
          break;
        case "line_chart":
          content = (
            <InteractiveLineChart
              data={
                sampleData[
                  widget.config.dataSource as keyof typeof sampleData
                ] || sampleData.production
              }
              title={widget.config.title}
              height={200}
            />
          );
          break;
        case "bar_chart":
          content = (
            <InteractiveBarChart
              data={
                sampleData[
                  widget.config.dataSource as keyof typeof sampleData
                ] || sampleData.monthly
              }
              title={widget.config.title}
              height={200}
            />
          );
          break;
        case "pie_chart":
          content = (
            <InteractivePieChart
              data={
                sampleData[
                  widget.config.dataSource as keyof typeof sampleData
                ] || sampleData.distribution
              }
              title={widget.config.title}
              height={200}
            />
          );
          break;
        case "activity_feed":
          content = (
            <div className="h-64 overflow-hidden">
              <RealTimeUpdates userRole={userRole} />
            </div>
          );
          break;
        case "hydrogen_3d":
          content = (
            <HydrogenMoleculeViewer
              width={300}
              height={200}
              animated={widget.config.animated}
              showControls={widget.config.controls}
            />
          );
          break;
        case "credit_viz":
          content = (
            <CreditVisualization
              credits={widget.config.credits}
              width={300}
              height={200}
            />
          );
          break;
        default:
          content = (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Unknown widget type: {widget.type}
            </div>
          );
      }

      return (
        <div
          key={widget.id}
          className={cn(
            "absolute transition-all duration-200",
            isEditMode && "cursor-move",
            isSelected && "ring-2 ring-primary",
            !widget.visible && "opacity-50",
          )}
          style={{
            left: `${(widget.position.x / gridSize) * 100}%`,
            top: `${(widget.position.y / gridSize) * 100}%`,
            width: `${(widget.size.width / gridSize) * 100}%`,
            height: `${(widget.size.height / gridSize) * 100}%`,
            padding: "8px",
          }}
          onClick={() => isEditMode && setSelectedWidget(widget.id)}
          draggable={isEditMode}
          onDragStart={() => setDraggedWidget(widget.id)}
          onDragEnd={() => setDraggedWidget(null)}
        >
          <Card
            className={cn(
              "h-full relative",
              isEditMode && "border-dashed border-2",
              isSelected && "border-primary",
            )}
          >
            {isEditMode && (
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateWidget(widget.id, { visible: !widget.visible });
                  }}
                >
                  {widget.visible ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateWidget(widget.id);
                  }}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWidget(widget.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}

            <div className="h-full overflow-hidden">
              {widget.visible ? (
                content
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <EyeOff className="w-8 h-8" />
                </div>
              )}
            </div>
          </Card>
        </div>
      );
    },
    [
      isEditMode,
      selectedWidget,
      updateWidget,
      removeWidget,
      duplicateWidget,
      gridSize,
      userRole,
    ],
  );

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Badge variant={isEditMode ? "default" : "secondary"}>
            {isEditMode ? "Edit Mode" : "View Mode"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWidgetLibrary(true)}
            disabled={!isEditMode}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Widget
          </Button>

          <Button variant="outline" size="sm" onClick={saveDashboardLayout}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>

          <Button variant="outline" size="sm" onClick={loadDashboardLayout}>
            <Upload className="w-4 h-4 mr-1" />
            Load
          </Button>

          <Button variant="outline" size="sm" onClick={resetDashboard}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>

          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? "default" : "outline"}
          >
            {isEditMode ? (
              <>
                <Eye className="w-4 h-4 mr-1" />
                View Mode
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-1" />
                Edit Mode
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Grid Configuration */}
      {isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dashboard Settings</CardTitle>
            <CardDescription>Configure your dashboard layout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Grid Size:</Label>
                <Select
                  value={gridSize.toString()}
                  onValueChange={(value) => setGridSize(parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3x3</SelectItem>
                    <SelectItem value="4">4x4</SelectItem>
                    <SelectItem value="5">5x5</SelectItem>
                    <SelectItem value="6">6x6</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label>Widgets:</Label>
                <span className="text-sm text-muted-foreground">
                  {widgets.filter((w) => w.visible).length} visible,{" "}
                  {widgets.length} total
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Grid */}
      <div
        className="relative bg-muted/20 rounded-lg"
        style={{
          aspectRatio: "16/9",
          minHeight: "600px",
        }}
      >
        {/* Grid Lines (visible in edit mode) */}
        {isEditMode && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical lines */}
            {Array.from({ length: gridSize + 1 }, (_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 border-l border-dashed border-muted-foreground/20"
                style={{ left: `${(i / gridSize) * 100}%` }}
              />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: gridSize + 1 }, (_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/20"
                style={{ top: `${(i / gridSize) * 100}%` }}
              />
            ))}
          </div>
        )}

        {/* Widgets */}
        {widgets.map(renderWidget)}
      </div>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle>Widget Library</CardTitle>
              <CardDescription>
                Choose widgets to add to your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableWidgets.map((widget) => {
                  const IconComponent = widget.icon;
                  return (
                    <Card
                      key={widget.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        addWidget(widget.id);
                        setShowWidgetLibrary(false);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-8 h-8 text-primary" />
                          <div>
                            <CardTitle className="text-base">
                              {widget.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {widget.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {widget.description}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>
                            Min: {widget.minSize.width}×{widget.minSize.height}
                          </span>
                          <span>
                            Max: {widget.maxSize.width}×{widget.maxSize.height}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowWidgetLibrary(false)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FileText,
  Download,
  Calendar as CalendarIcon,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Share,
  Edit,
  Eye,
  Trash2,
  Plus,
  Settings,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: "production" | "trading" | "compliance" | "financial" | "environmental";
  fields: string[];
  chartTypes: string[];
  icon: any;
  color: string;
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  dateRange: { from: string; to: string };
  status: "generating" | "completed" | "failed";
  size: string;
  downloadUrl?: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "production-summary",
    name: "Production Summary",
    description: "Comprehensive overview of hydrogen production activities",
    type: "production",
    fields: [
      "production_volume",
      "energy_source",
      "efficiency",
      "certification_status",
    ],
    chartTypes: ["line", "bar"],
    icon: BarChart3,
    color: "bg-green-100 text-green-800",
  },
  {
    id: "trading-activity",
    name: "Trading Activity",
    description: "Analysis of credit trading patterns and market activity",
    type: "trading",
    fields: ["transactions", "volume", "prices", "market_trends"],
    chartTypes: ["line", "pie"],
    icon: TrendingUp,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "compliance-report",
    name: "Compliance Report",
    description: "Regulatory compliance and certification status",
    type: "compliance",
    fields: ["certifications", "audits", "violations", "compliance_score"],
    chartTypes: ["pie", "bar"],
    icon: FileText,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "environmental-impact",
    name: "Environmental Impact",
    description: "Carbon footprint and sustainability metrics",
    type: "environmental",
    fields: ["carbon_savings", "renewable_energy", "efficiency_improvements"],
    chartTypes: ["line", "pie"],
    icon: PieChart,
    color: "bg-emerald-100 text-emerald-800",
  },
];

export function ReportsSystem({ userRole }: { userRole: string }) {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: "1",
      name: "Production Summary - Q1 2024",
      type: "production",
      generatedDate: "2024-01-28",
      dateRange: { from: "2024-01-01", to: "2024-03-31" },
      status: "completed",
      size: "2.4 MB",
      downloadUrl: "#",
    },
    {
      id: "2",
      name: "Trading Activity - January",
      type: "trading",
      generatedDate: "2024-01-25",
      dateRange: { from: "2024-01-01", to: "2024-01-31" },
      status: "completed",
      size: "1.8 MB",
      downloadUrl: "#",
    },
  ]);

  const generateReport = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        name: `${selectedTemplate.name} - ${format(new Date(), "MMM yyyy")}`,
        type: selectedTemplate.type,
        generatedDate: format(new Date(), "yyyy-MM-dd"),
        dateRange: {
          from: format(new Date(), "yyyy-MM-dd"),
          to: format(new Date(), "yyyy-MM-dd"),
        },
        status: "completed",
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        downloadUrl: "#",
      };

      setGeneratedReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);
      setSelectedTemplate(null);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "generating":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and manage your data reports
          </p>
        </div>
        <Button onClick={() => setActiveTab("builder")} className="gap-2">
          <Plus className="w-4 h-4" />
          New Report
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: "templates", label: "Templates", icon: FileText },
          { id: "builder", label: "Report Builder", icon: Settings },
          { id: "generated", label: "Generated Reports", icon: Download },
          { id: "scheduled", label: "Scheduled", icon: Clock },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <IconComponent className="w-8 h-8 text-primary" />
                    <Badge className={template.color}>{template.type}</Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Includes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.fields.slice(0, 3).map((field) => (
                          <Badge
                            key={field}
                            variant="outline"
                            className="text-xs"
                          >
                            {field.replace("_", " ")}
                          </Badge>
                        ))}
                        {template.fields.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.fields.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Report Builder Tab */}
      {activeTab === "builder" && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
            <CardDescription>
              Create custom reports with your preferred data and visualizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Name</Label>
                  <Input placeholder="Enter report name..." />
                </div>

                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="environmental">
                        Environmental
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" />
                    <Input type="date" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Data Fields</Label>
                  <div className="space-y-2">
                    {[
                      "Production Volume",
                      "Energy Source",
                      "Certification Status",
                      "Trading Activity",
                    ].map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox id={field} />
                        <Label htmlFor={field} className="text-sm">
                          {field}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Reports Tab */}
      {activeTab === "generated" && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>
              View and download your completed reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">{report.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          Generated:{" "}
                          {format(
                            new Date(report.generatedDate),
                            "MMM dd, yyyy",
                          )}
                        </span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Reports Tab */}
      {activeTab === "scheduled" && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
            <CardDescription>
              Manage automated report generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                No Scheduled Reports
              </h3>
              <p className="text-muted-foreground mb-4">
                Set up automated report generation to receive regular updates
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Generation Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Generate {selectedTemplate.name}</CardTitle>
              <CardDescription>{selectedTemplate.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea placeholder="Add any specific requirements or notes..." />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cancel
                </Button>
                <Button onClick={generateReport} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

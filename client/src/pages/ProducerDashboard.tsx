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
import {
  Upload,
  Plus,
  TrendingUp,
  Wallet,
  FileText,
  Clock,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EnhancedForm } from "@/components/forms/EnhancedForm";
import { AdvancedDataTable } from "@/components/tables/AdvancedDataTable";
import {
  InteractiveLineChart,
  AnimatedCounter,
} from "@/components/charts/AdvancedCharts";
import { ProductionFacility } from "@/components/3d/HydrogenVisualizations";

interface CreditRequest {
  id: string;
  unitsProduced: number;
  submissionDate: string;
  status: "pending" | "approved" | "rejected";
  proofDocument: string;
  txHash?: string;
}

export default function ProducerDashboard() {
  const [requests, setRequests] = useState<CreditRequest[]>([
    {
      id: "REQ-001",
      unitsProduced: 1500,
      submissionDate: "2024-01-15",
      status: "approved",
      proofDocument: "production_report_jan.pdf",
      txHash: "0xabc123...",
    },
    {
      id: "REQ-002",
      unitsProduced: 2200,
      submissionDate: "2024-01-20",
      status: "pending",
      proofDocument: "production_report_jan2.pdf",
    },
    {
      id: "REQ-003",
      unitsProduced: 800,
      submissionDate: "2024-01-25",
      status: "rejected",
      proofDocument: "production_report_jan3.pdf",
    },
  ]);

  const { toast } = useToast();

  // Enhanced form configuration
  const formFields = [
    {
      id: "unitsProduced",
      label: "Units Produced",
      type: "number" as const,
      placeholder: "Enter kg of H2 produced",
      required: true,
      description: "Amount of green hydrogen produced in kilograms",
      step: 1,
    },
    {
      id: "productionDate",
      label: "Production Date",
      type: "date" as const,
      required: true,
      description: "Date when the hydrogen was produced",
      step: 1,
    },
    {
      id: "energySource",
      label: "Energy Source",
      type: "select" as const,
      required: true,
      options: [
        { value: "solar", label: "Solar Power" },
        { value: "wind", label: "Wind Power" },
        { value: "hydro", label: "Hydroelectric" },
        { value: "mixed", label: "Mixed Renewable Sources" },
      ],
      description: "Primary renewable energy source used",
      step: 1,
    },
    {
      id: "efficiency",
      label: "Production Efficiency",
      type: "number" as const,
      placeholder: "Enter efficiency percentage",
      description: "Energy conversion efficiency of the production process",
      step: 1,
    },
    {
      id: "description",
      label: "Production Details",
      type: "textarea" as const,
      placeholder:
        "Describe your production process and any relevant details...",
      description: "Additional information about the production process",
      step: 2,
    },
    {
      id: "proofDocument",
      label: "Proof Documentation",
      type: "file" as const,
      required: true,
      description:
        "Upload production certificates, energy consumption data, or verification documents",
      step: 2,
    },
    {
      id: "certificationBody",
      label: "Preferred Certification Body",
      type: "select" as const,
      options: [
        { value: "ecocert", label: "EcoCert" },
        { value: "greencert", label: "GreenCert" },
        { value: "h2cert", label: "H2Cert International" },
      ],
      description: "Choose your preferred certification authority",
      step: 2,
    },
  ];

  const formSteps = [
    {
      id: "step1",
      title: "Production Details",
      description: "Enter basic production information",
      fields: ["unitsProduced", "productionDate", "energySource", "efficiency"],
    },
    {
      id: "step2",
      title: "Documentation & Certification",
      description: "Upload proof and select certification preferences",
      fields: ["description", "proofDocument", "certificationBody"],
    },
  ];

  const handleFormSubmit = async (data: Record<string, any>) => {
    const newRequest: CreditRequest = {
      id: `REQ-${String(requests.length + 1).padStart(3, "0")}`,
      unitsProduced: parseInt(data.unitsProduced),
      submissionDate: new Date().toISOString().split("T")[0],
      status: "pending",
      proofDocument: data.proofDocument || "production_report.pdf",
    };

    setRequests([newRequest, ...requests]);

    toast({
      title: "Request Submitted",
      description: "Your credit request has been submitted for review.",
    });
  };

  const handleFormSave = async (data: Record<string, any>) => {
    // Auto-save functionality
    localStorage.setItem("producer-form-draft", JSON.stringify(data));
  };

  // Table column configuration
  const tableColumns = [
    {
      key: "id",
      label: "Request ID",
      sortable: true,
      width: "120px",
    },
    {
      key: "unitsProduced",
      label: "Units (kg H2)",
      sortable: true,
      type: "number" as const,
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: "submissionDate",
      label: "Submission Date",
      sortable: true,
      type: "date" as const,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      type: "badge" as const,
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>{value}</Badge>
      ),
    },
    {
      key: "proofDocument",
      label: "Proof Document",
      render: (value: string) => (
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto text-eco-blue-600"
        >
          {value}
        </Button>
      ),
    },
    {
      key: "txHash",
      label: "Blockchain Tx",
      render: (value: string) =>
        value ? (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto font-mono text-xs"
          >
            {value}
          </Button>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-eco-green-100 text-eco-green-800 border-eco-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalCredits = requests
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + r.unitsProduced, 0);
  const pendingCredits = requests
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.unitsProduced, 0);

  // Production trend data
  const productionData = [
    { name: "Jan", value: 1200 },
    { name: "Feb", value: 1900 },
    { name: "Mar", value: 1600 },
    { name: "Apr", value: 2100 },
    { name: "May", value: 1800 },
    { name: "Jun", value: 2400 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Producer Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your green hydrogen production and credit requests
        </p>
      </div>

      {/* Stats Cards with Animated Counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCounter
          value={totalCredits}
          label="Approved Credits"
          suffix=" kg H2"
          trend={15}
        />
        <AnimatedCounter
          value={pendingCredits}
          label="Pending Review"
          suffix=" kg H2"
          trend={-5}
        />
        <AnimatedCounter
          value={requests.length}
          label="Total Requests"
          trend={8}
        />
        <AnimatedCounter
          value={87}
          label="Approval Rate"
          suffix="%"
          trend={3}
        />
      </div>

      {/* Production Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveLineChart
          data={productionData}
          title="Production Trends"
          description="Monthly hydrogen production over time"
          height={300}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Production Facility
            </CardTitle>
            <CardDescription>Real-time facility status</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductionFacility
              width={400}
              height={300}
              productionLevel={0.75}
            />
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Request Form */}
      <EnhancedForm
        title="Request Green Hydrogen Credits"
        description="Submit your green hydrogen production for certification and verification"
        fields={formFields}
        steps={formSteps}
        onSubmit={handleFormSubmit}
        onSave={handleFormSave}
        autoSave={true}
        showProgress={true}
        allowStepJumping={false}
      />

      {/* Advanced Requests Table */}
      <AdvancedDataTable
        data={requests}
        columns={tableColumns}
        title="Credit Requests History"
        description="Track and manage your submitted credit requests"
        enableSelection={true}
        enableInlineEdit={false}
        enableExport={true}
        pageSize={10}
        onExport={() => {
          toast({
            title: "Export Started",
            description: "Your request history is being exported to CSV.",
          });
        }}
        onRefresh={() => {
          toast({
            title: "Data Refreshed",
            description:
              "Request history has been updated with latest information.",
          });
        }}
        realTimeUpdates={true}
      />
    </div>
  );
}

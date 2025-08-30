import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ShoppingCart, 
  Leaf, 
  Award, 
  TrendingUp, 
  Wallet, 
  Trash2,
  Star,
  MapPin,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarketplaceCredit {
  id: string;
  producer: string;
  location: string;
  unitsAvailable: number;
  pricePerUnit: number;
  productionDate: string;
  certifiedBy: string;
  rating: number;
}

interface PurchasedCredit {
  id: string;
  producer: string;
  units: number;
  purchasePrice: number;
  purchaseDate: string;
  retired: boolean;
  retiredDate?: string;
}

export default function BuyerDashboard() {
  const [marketplaceCredits] = useState<MarketplaceCredit[]>([
    {
      id: "MKT-001",
      producer: "GreenTech Industries",
      location: "California, USA",
      unitsAvailable: 500,
      pricePerUnit: 12.5,
      productionDate: "2024-01-15",
      certifiedBy: "EcoCert",
      rating: 4.8
    },
    {
      id: "MKT-002",
      producer: "HydroGen Solutions",
      location: "Texas, USA", 
      unitsAvailable: 750,
      pricePerUnit: 11.2,
      productionDate: "2024-01-20",
      certifiedBy: "GreenCert",
      rating: 4.6
    },
    {
      id: "MKT-003",
      producer: "CleanEnergy Corp",
      location: "Oregon, USA",
      unitsAvailable: 300,
      pricePerUnit: 13.8,
      productionDate: "2024-01-25",
      certifiedBy: "EcoCert",
      rating: 4.9
    }
  ]);

  const [purchasedCredits, setPurchasedCredits] = useState<PurchasedCredit[]>([
    {
      id: "PUR-001",
      producer: "GreenTech Industries",
      units: 200,
      purchasePrice: 2500,
      purchaseDate: "2024-01-10",
      retired: true,
      retiredDate: "2024-01-12"
    },
    {
      id: "PUR-002", 
      producer: "HydroGen Solutions",
      units: 150,
      purchasePrice: 1680,
      purchaseDate: "2024-01-18",
      retired: false
    },
    {
      id: "PUR-003",
      producer: "CleanEnergy Corp",
      units: 100,
      purchasePrice: 1380,
      purchaseDate: "2024-01-22",
      retired: true,
      retiredDate: "2024-01-24"
    }
  ]);

  const [purchaseForm, setPurchaseForm] = useState({
    creditId: "",
    units: "",
    isOpen: false
  });

  const { toast } = useToast();

  const totalCreditsOwned = purchasedCredits.filter(c => !c.retired).reduce((sum, c) => sum + c.units, 0);
  const totalCreditsRetired = purchasedCredits.filter(c => c.retired).reduce((sum, c) => sum + c.units, 0);
  const carbonNeutralProgress = Math.min((totalCreditsRetired / 500) * 100, 100); // Assuming 500 is the target
  const totalSpent = purchasedCredits.reduce((sum, c) => sum + c.purchasePrice, 0);

  const handlePurchase = (credit: MarketplaceCredit) => {
    setPurchaseForm({
      creditId: credit.id,
      units: "",
      isOpen: true
    });
  };

  const confirmPurchase = () => {
    const units = parseInt(purchaseForm.units);
    const credit = marketplaceCredits.find(c => c.id === purchaseForm.creditId);
    
    if (!credit || !units || units <= 0) {
      toast({
        title: "Invalid Purchase",
        description: "Please enter a valid number of units.",
        variant: "destructive"
      });
      return;
    }

    if (units > credit.unitsAvailable) {
      toast({
        title: "Insufficient Credits",
        description: `Only ${credit.unitsAvailable} units available.`,
        variant: "destructive"
      });
      return;
    }

    const newPurchase: PurchasedCredit = {
      id: `PUR-${String(purchasedCredits.length + 1).padStart(3, '0')}`,
      producer: credit.producer,
      units: units,
      purchasePrice: units * credit.pricePerUnit,
      purchaseDate: new Date().toISOString().split('T')[0],
      retired: false
    };

    setPurchasedCredits([newPurchase, ...purchasedCredits]);
    setPurchaseForm({ creditId: "", units: "", isOpen: false });

    toast({
      title: "Purchase Successful",
      description: `Successfully purchased ${units} credits from ${credit.producer}.`,
    });
  };

  const retireCredits = (purchaseId: string) => {
    setPurchasedCredits(prev => 
      prev.map(credit => 
        credit.id === purchaseId 
          ? { ...credit, retired: true, retiredDate: new Date().toISOString().split('T')[0] }
          : credit
      )
    );

    toast({
      title: "Credits Retired",
      description: "Credits have been permanently retired for carbon offsetting.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buyer Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Purchase and manage your green hydrogen credits</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Wallet className="w-5 h-5 text-eco-green-500" />
              <TrendingUp className="w-4 h-4 text-eco-green-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCreditsOwned}</div>
            <CardDescription>Credits Owned</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Leaf className="w-5 h-5 text-eco-blue-500" />
              <Badge variant="secondary" className="text-xs">Retired</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCreditsRetired}</div>
            <CardDescription>Credits Retired</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Award className="w-5 h-5 text-eco-green-500" />
              <span className="text-sm text-gray-500">{carbonNeutralProgress.toFixed(0)}%</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {carbonNeutralProgress >= 100 ? "🏆" : "📈"}
            </div>
            <CardDescription>Carbon Neutral Progress</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <ShoppingCart className="w-5 h-5 text-eco-blue-500" />
              <span className="text-sm text-gray-500">${totalSpent.toLocaleString()}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{purchasedCredits.length}</div>
            <CardDescription>Total Purchases</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Carbon Neutral Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-eco-green-500" />
            Carbon Neutral Progress
          </CardTitle>
          <CardDescription>Track your journey to carbon neutrality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress to Goal (500 credits retired)</span>
              <span className="text-sm text-gray-500">{totalCreditsRetired}/500 credits</span>
            </div>
            <Progress value={carbonNeutralProgress} className="h-3" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {carbonNeutralProgress >= 100 ? (
                  <Award className="w-5 h-5 text-yellow-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className={`text-sm font-medium ${carbonNeutralProgress >= 100 ? 'text-yellow-600' : 'text-gray-600'}`}>
                  Carbon Neutral Badge
                </span>
              </div>
              <span className="text-sm text-eco-green-600">{carbonNeutralProgress.toFixed(1)}% Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketplace */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Marketplace
          </CardTitle>
          <CardDescription>Available green hydrogen credits for purchase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplaceCredits.map((credit) => (
              <Card key={credit.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{credit.producer}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{credit.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{credit.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Available:</span>
                      <div className="font-semibold">{credit.unitsAvailable} kg</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <div className="font-semibold">${credit.pricePerUnit}/kg</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Produced: {credit.productionDate}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Certified by {credit.certifiedBy}
                  </Badge>
                  <Button 
                    onClick={() => handlePurchase(credit)}
                    className="w-full"
                    size="sm"
                  >
                    Purchase Credits
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Purchase Form Modal */}
      {purchaseForm.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Purchase Credits</CardTitle>
              <CardDescription>
                {marketplaceCredits.find(c => c.id === purchaseForm.creditId)?.producer}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-units">Number of Units (kg)</Label>
                <Input
                  id="purchase-units"
                  type="number"
                  placeholder="Enter units to purchase"
                  value={purchaseForm.units}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, units: e.target.value }))}
                />
              </div>
              {purchaseForm.units && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost:</div>
                  <div className="text-lg font-bold">
                    ${(parseInt(purchaseForm.units) * (marketplaceCredits.find(c => c.id === purchaseForm.creditId)?.pricePerUnit || 0)).toFixed(2)}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPurchaseForm(prev => ({ ...prev, isOpen: false }))}>
                  Cancel
                </Button>
                <Button onClick={confirmPurchase} className="flex-1">
                  Confirm Purchase
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Purchased Credits */}
      <Card>
        <CardHeader>
          <CardTitle>Your Credits</CardTitle>
          <CardDescription>Manage your purchased green hydrogen credits</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producer</TableHead>
                <TableHead>Units (kg)</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchasedCredits.map((credit) => (
                <TableRow key={credit.id}>
                  <TableCell className="font-medium">{credit.producer}</TableCell>
                  <TableCell>{credit.units}</TableCell>
                  <TableCell>${credit.purchasePrice.toLocaleString()}</TableCell>
                  <TableCell>{credit.purchaseDate}</TableCell>
                  <TableCell>
                    <Badge 
                      className={credit.retired 
                        ? "bg-eco-blue-100 text-eco-blue-800 border-eco-blue-200" 
                        : "bg-eco-green-100 text-eco-green-800 border-eco-green-200"
                      }
                    >
                      {credit.retired ? `Retired (${credit.retiredDate})` : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!credit.retired && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retireCredits(credit.id)}
                        className="text-eco-blue-600 hover:text-eco-blue-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Retire
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

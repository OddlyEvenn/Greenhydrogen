import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Factory, Shield, ShoppingCart, Scale } from "lucide-react";

interface LoginProps {
  onRoleSelect: (role: string) => void;
}

export default function Login({ onRoleSelect }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  const roles = [
    {
      id: "producer",
      title: "Producer",
      icon: Factory,
      emoji: "👷",
      description: "Create and manage green hydrogen production credits",
      color: "hover:border-eco-green-500 hover:bg-eco-green-50",
    },
    {
      id: "certifier",
      title: "Certifier",
      icon: Shield,
      emoji: "🛡️",
      description: "Verify and approve green hydrogen credit requests",
      color: "hover:border-eco-blue-500 hover:bg-eco-blue-50",
    },
    {
      id: "buyer",
      title: "Buyer",
      icon: ShoppingCart,
      emoji: "🛒",
      description: "Purchase and retire credits for carbon neutrality",
      color: "hover:border-eco-green-500 hover:bg-eco-green-50",
    },
    {
      id: "regulator",
      title: "Regulator",
      icon: Scale,
      emoji: "⚖️",
      description: "Monitor and audit the green hydrogen credit system",
      color: "hover:border-eco-blue-500 hover:bg-eco-blue-50",
    },
  ];

  const handleConnectWallet = async () => {
    if (!selectedRole) return;
    
    setIsConnecting(true);
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnecting(false);
    onRoleSelect(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 via-white to-eco-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            {/* Hydrogen molecule illustration */}
            <div className="relative">
              <div className="w-16 h-16 bg-eco-green-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-eco-blue-500 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-eco-green-400 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Green Hydrogen Credit System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A blockchain-based platform for transparent green hydrogen production, 
            certification, and trading
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Select Your Role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedRole === role.id
                      ? "border-primary bg-primary/5 shadow-lg scale-105"
                      : `border-gray-200 ${role.color}`
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-3">
                      <div className="text-3xl">{role.emoji}</div>
                    </div>
                    <CardTitle className="text-lg flex items-center justify-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center text-sm">
                      {role.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Connect Wallet Button */}
        <div className="text-center">
          <Button
            onClick={handleConnectWallet}
            disabled={!selectedRole || isConnecting}
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            <Wallet className="w-5 h-5 mr-2" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
          {selectedRole && (
            <p className="mt-4 text-sm text-gray-600">
              Continue as <span className="font-semibold text-primary">
                {roles.find(r => r.id === selectedRole)?.title}
              </span>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Powered by blockchain technology for transparent green energy trading
          </p>
        </div>
      </div>
    </div>
  );
}

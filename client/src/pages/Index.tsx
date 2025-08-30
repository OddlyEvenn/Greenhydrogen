import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main app entry point
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-green-50 via-white to-eco-blue-50">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-eco-green-500 rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-eco-blue-500 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-eco-green-400 rounded-full"></div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Loading Green Hydrogen Credit System...
        </h1>
        <p className="mt-4 text-gray-600">
          Redirecting to login page
        </p>
      </div>
    </div>
  );
}

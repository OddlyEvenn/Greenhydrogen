import { useRef, useEffect } from "react";

// Simple CSS-based hydrogen molecule animation
function AnimatedHydrogen({
  animated = true,
  scale = 1,
}: {
  animated?: boolean;
  scale?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const animate = () => {
      if (containerRef.current) {
        const time = Date.now() * 0.001;
        containerRef.current.style.transform = `rotateY(${time * 50}deg) rotateX(${Math.sin(time) * 10}deg)`;
      }
      requestAnimationFrame(animate);
    };

    animate();
  }, [animated]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      style={{
        transform: `scale(${scale})`,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Hydrogen atoms */}
      <div className="relative flex items-center gap-8">
        <div className="w-16 h-16 bg-eco-green-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
        </div>

        {/* Bond */}
        <div className="w-8 h-1 bg-white opacity-80 rounded-full"></div>

        <div className="w-16 h-16 bg-eco-green-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
        </div>
      </div>

      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-32 h-32 border-2 border-eco-blue-400 rounded-full opacity-30 animate-spin"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-40 h-40 border border-eco-blue-300 rounded-full opacity-20 animate-spin"
          style={{ animationDuration: "5s", animationDirection: "reverse" }}
        ></div>
      </div>
    </div>
  );
}

// CSS-based wind turbine animation
function AnimatedTurbine({ scale = 1 }: { scale?: number }) {
  return (
    <div
      className="relative flex flex-col items-center"
      style={{ transform: `scale(${scale})` }}
    >
      {/* Tower */}
      <div className="w-2 h-24 bg-gray-400 rounded-t"></div>

      {/* Nacelle */}
      <div className="w-8 h-4 bg-gray-500 rounded mb-2"></div>

      {/* Blades */}
      <div
        className="relative w-16 h-16 animate-spin"
        style={{ animationDuration: "2s" }}
      >
        <div className="absolute top-0 left-1/2 w-1 h-8 bg-gray-200 rounded origin-bottom transform -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-0 w-8 h-1 bg-gray-200 rounded origin-right transform -translate-y-1/2 rotate-120"></div>
        <div className="absolute top-1/2 right-0 w-8 h-1 bg-gray-200 rounded origin-left transform -translate-y-1/2 rotate-240"></div>
      </div>
    </div>
  );
}

// Production facility visualization
function ProductionFacilityCSS({
  productionLevel = 0.5,
}: {
  productionLevel?: number;
}) {
  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg overflow-hidden">
      {/* Sky and background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-100"></div>

      {/* Factory building */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-gray-600 rounded-t-lg">
        {/* Chimney */}
        <div className="absolute -top-8 right-4 w-4 h-8 bg-gray-700 rounded-t">
          {/* Emissions based on production level */}
          <div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-eco-green-400 rounded-full opacity-70 animate-pulse"
            style={{
              opacity: productionLevel,
              transform: `translateX(-50%) scale(${0.5 + productionLevel * 0.5})`,
            }}
          ></div>
        </div>

        {/* Windows */}
        <div className="grid grid-cols-3 gap-2 p-2 mt-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-yellow-300 rounded opacity-80"
            ></div>
          ))}
        </div>
      </div>

      {/* Wind turbines */}
      <div className="absolute bottom-16 left-8">
        <AnimatedTurbine scale={0.6} />
      </div>
      <div className="absolute bottom-20 left-20">
        <AnimatedTurbine scale={0.5} />
      </div>

      {/* Solar panels */}
      <div className="absolute bottom-12 right-8 grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-6 bg-blue-800 rounded transform rotate-12"
          ></div>
        ))}
      </div>

      {/* Production indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
        <div className="w-3 h-3 bg-eco-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">
          Production: {Math.round(productionLevel * 100)}%
        </span>
      </div>
    </div>
  );
}

// Credit tokens visualization
function CreditTokensCSS({ credits = 5 }: { credits?: number }) {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-eco-green-50 to-eco-blue-50 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="grid grid-cols-5 gap-4">
        {[...Array(Math.min(credits, 10))].map((_, i) => (
          <div
            key={i}
            className="relative w-12 h-12 bg-gradient-to-br from-eco-green-500 to-eco-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "2s",
            }}
          >
            H2
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 bg-white/80 rounded-lg px-3 py-2">
        <span className="text-sm font-medium">{credits} Credits Available</span>
      </div>
    </div>
  );
}

// Main exported components
export function HydrogenMoleculeViewer({
  width = 300,
  height = 300,
  animated = true,
  showControls = false,
}: {
  width?: number;
  height?: number;
  animated?: boolean;
  showControls?: boolean;
}) {
  return (
    <div
      style={{ width, height }}
      className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border flex items-center justify-center"
    >
      <AnimatedHydrogen animated={animated} scale={0.8} />
    </div>
  );
}

export function CreditVisualization({
  credits = 5,
  width = 400,
  height = 300,
}: {
  credits?: number;
  width?: number;
  height?: number;
}) {
  return (
    <div style={{ width, height }}>
      <CreditTokensCSS credits={credits} />
    </div>
  );
}

export function ProductionFacility({
  width = 500,
  height = 400,
  productionLevel = 0.5,
}: {
  width?: number;
  height?: number;
  productionLevel?: number;
}) {
  return (
    <div style={{ width, height }}>
      <ProductionFacilityCSS productionLevel={productionLevel} />
    </div>
  );
}

// Energy flow visualization
export function EnergyVisualization({
  width = 400,
  height = 300,
  showTurbine = true,
  showSolar = true,
}: {
  width?: number;
  height?: number;
  showTurbine?: boolean;
  showSolar?: boolean;
}) {
  return (
    <div
      style={{ width, height }}
      className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border flex items-center justify-center"
    >
      <div className="relative w-full h-full p-4">
        {showTurbine && (
          <div className="absolute top-4 left-4">
            <AnimatedTurbine scale={0.7} />
          </div>
        )}

        {showSolar && (
          <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-4 h-8 bg-blue-800 rounded"></div>
            ))}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-eco-green-500 rounded-full flex items-center justify-center mb-2 animate-pulse">
              <span className="text-white font-bold">H2</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              Clean Energy Production
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

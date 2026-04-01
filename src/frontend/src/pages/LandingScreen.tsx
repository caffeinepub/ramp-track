import { useEffect, useState } from "react";

const rampTrackSplash =
  "/assets/ramptracksplash-019d2e4b-1a18-736f-a7f6-8bff4344c78b.png";

export default function LandingScreen({ onLogin }: { onLogin: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between"
      style={{
        backgroundImage: `url(${rampTrackSplash})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="flex flex-col items-center gap-8">
          {/* Branding */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
                <div
                  className="h-9 w-9 rounded-full"
                  style={{ backgroundColor: "#0078D2" }}
                />
              </div>
            </div>
            <h1
              className="text-4xl font-bold tracking-wide drop-shadow-lg"
              style={{ color: "#0078D2" }}
            >
              Ramp Track
            </h1>
          </div>

          {/* Login button */}
          <button
            type="button"
            onClick={onLogin}
            className="mt-4 px-16 py-4 rounded-xl text-white text-lg font-semibold tracking-wide shadow-xl transition-all active:scale-95"
            style={{
              backgroundColor: "#0078D2",
              minWidth: "220px",
              boxShadow: "0 4px 24px rgba(0,120,210,0.45)",
            }}
          >
            Login
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center text-sm text-white/70 drop-shadow">
        © Jayson James & Ramp Track Systems
      </div>
    </div>
  );
}

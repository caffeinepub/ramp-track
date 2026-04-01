import { useEffect, useState } from "react";

const rampTrackSplash =
  "/assets/ramptracksplash-019d2e4b-1a18-736f-a7f6-8bff4344c78b.png";

export default function LandingScreen({ onLogin }: { onLogin: () => void }) {
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0"
      style={{
        backgroundImage: `url(${rampTrackSplash})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient overlay — transparent at top, darker toward bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.60) 100%)",
        }}
      />

      {/* Button anchored to bottom quarter */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center"
        style={{
          paddingBottom: "12vh",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.65s ease, transform 0.65s ease",
        }}
      >
        <button
          type="button"
          onClick={onLogin}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          style={{
            minWidth: "240px",
            padding: "16px 48px",
            borderRadius: "16px",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#ffffff",
            background: pressed
              ? "linear-gradient(135deg, #005fa3 0%, #0069bb 100%)"
              : "linear-gradient(135deg, #0090f5 0%, #0078D2 60%, #005fa3 100%)",
            boxShadow: pressed
              ? "0 2px 8px rgba(0,0,0,0.35)"
              : "0 6px 24px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.12) inset",
            transform: pressed
              ? "scale(0.97) translateY(1px)"
              : "scale(1) translateY(0)",
            transition:
              "background 0.15s ease, box-shadow 0.15s ease, transform 0.12s ease",
            textShadow: "0 1px 2px rgba(0,0,0,0.30)",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Login
        </button>
      </div>

      {/* Footer */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pb-4 text-center"
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.02em",
        }}
      >
        © Jayson James &amp; Ramp Track Systems
      </div>
    </div>
  );
}

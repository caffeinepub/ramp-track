import { useEffect, useRef, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import SignOnScreen from "./components/SignOnScreen";
import SplashScreen from "./components/SplashScreen";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AdminMenuScreen from "./pages/AdminMenuScreen";
import CheckInScreen from "./pages/CheckInScreen";
import CheckOutScreen from "./pages/CheckOutScreen";
import EquipmentDetailScreen from "./pages/EquipmentDetailScreen";
import LandingScreen from "./pages/LandingScreen";
import ManageEquipmentScreen from "./pages/ManageEquipmentScreen";
import OperatorHomeScreen from "./pages/OperatorHomeScreen";
import ReportIssueScreen from "./pages/ReportIssueScreen";
import SignInScreen from "./pages/SignInScreen";

type View =
  | "splash"
  | "landing"
  | "signin"
  | "signon"
  | "operator-home"
  | "checkout"
  | "checkin"
  | "report-issue"
  | "admin-menu"
  | "manage-equipment"
  | "equipment-detail";

function AppContent() {
  const { auth, logout } = useAuth();
  const [view, setView] = useState<View>("splash");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(
    null,
  );
  const authRef = useRef(auth);
  authRef.current = auth;

  // Splash screen for 1.5s on load, then navigate based on auth state
  useEffect(() => {
    const t = setTimeout(() => {
      const currentAuth = authRef.current;
      if (currentAuth) {
        // Already logged in — go straight to the appropriate screen
        setView(
          currentAuth.roles?.includes("admin") ? "admin-menu" : "operator-home",
        );
      } else {
        // New: go to landing screen first, not directly to login
        setView("landing");
      }
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Sync view with auth changes after splash
  useEffect(() => {
    if (view === "splash") return;
    if (!auth) {
      setView("signin");
    }
  }, [auth, view]);

  // Hash-based navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "") as View;
      if (hash && hash !== view) setView(hash);
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [view]);

  const navigate = (v: View) => {
    window.location.hash = v;
    setView(v);
  };

  const handleLogout = () => {
    logout();
    navigate("signin");
  };

  if (view === "splash") return <SplashScreen />;

  // Landing screen — shown after splash when user is not authenticated
  if (view === "landing") {
    return <LandingScreen onLogin={() => navigate("signin")} />;
  }

  if (!auth) {
    return (
      <SignInScreen
        onLoginSuccess={() => {
          // All users go to SignOnScreen — it shows only the relevant
          // button(s) based on role (agent-only sees only agent button).
          navigate("signon");
        }}
      />
    );
  }

  switch (view) {
    case "signon":
      return (
        <SignOnScreen
          currentUser={auth}
          onAgentLogin={() => navigate("operator-home")}
          onAdminLogin={() => navigate("admin-menu")}
          onBack={() => navigate("signin")}
        />
      );
    case "operator-home":
      return (
        <OperatorHomeScreen
          currentUser={auth}
          onCheckOut={() => navigate("checkout")}
          onCheckIn={() => navigate("checkin")}
          onReportIssue={() => navigate("report-issue")}
          onLogout={handleLogout}
          onBack={() => navigate("signon")}
        />
      );
    case "checkout":
      return (
        <CheckOutScreen
          currentUser={auth}
          onBack={() => navigate("operator-home")}
        />
      );
    case "checkin":
      return (
        <CheckInScreen
          currentUser={auth}
          onBack={() => navigate("operator-home")}
        />
      );
    case "report-issue":
      return (
        <ReportIssueScreen
          currentUser={auth}
          onBack={() => navigate("operator-home")}
        />
      );
    case "admin-menu":
      return (
        <AdminMenuScreen
          currentUser={auth}
          onManageEquipment={() => navigate("manage-equipment")}
          onViewEquipment={(id) => {
            setSelectedEquipmentId(id);
            navigate("equipment-detail");
          }}
          onBack={() => navigate("signon")}
          onLogout={handleLogout}
        />
      );
    case "manage-equipment":
      return <ManageEquipmentScreen onBack={() => navigate("admin-menu")} />;
    case "equipment-detail":
      return (
        <EquipmentDetailScreen
          equipmentId={selectedEquipmentId || ""}
          onBack={() => navigate("admin-menu")}
        />
      );
    default:
      return null;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

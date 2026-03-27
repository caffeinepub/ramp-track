import { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineIndicator from "./components/OfflineIndicator";
import SignOnScreen from "./components/SignOnScreen";
import SplashScreen from "./components/SplashScreen";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AdminMenuScreen from "./pages/AdminMenuScreen";
import CheckInScreen from "./pages/CheckInScreen";
import CheckOutScreen from "./pages/CheckOutScreen";
import EquipmentDetailScreen from "./pages/EquipmentDetailScreen";
import ManageEquipmentScreen from "./pages/ManageEquipmentScreen";
import OperatorHomeScreen from "./pages/OperatorHomeScreen";
import ReportIssueScreen from "./pages/ReportIssueScreen";
import SignInScreen from "./pages/SignInScreen";

type Screen =
  | "home"
  | "checkout"
  | "checkin"
  | "reportIssue"
  | "adminMenu"
  | "manageEquipment"
  | "equipmentDetail";
type UserRole = "agent" | "admin" | null;

function AppInner() {
  const { auth, logout } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [equipmentDetailId, setEquipmentDetailId] = useState("");
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!auth) {
      setUserRole(null);
      setCurrentScreen("home");
    }
  }, [auth]);

  if (!splashDone) return <SplashScreen />;
  if (!auth) return <SignInScreen />;

  const hasBothRoles =
    auth.roles.includes("admin") && auth.roles.includes("agent");
  const hasOnlyAgent = auth.roles.length === 1 && auth.roles[0] === "agent";

  if (hasBothRoles && !userRole) {
    return (
      <SignOnScreen
        currentUser={auth}
        onAgentLogin={() => {
          setUserRole("agent");
          setCurrentScreen("home");
        }}
        onAdminLogin={() => {
          setUserRole("admin");
          setCurrentScreen("adminMenu");
        }}
        onBack={logout}
      />
    );
  }

  const effectiveRole: "agent" | "admin" =
    userRole ?? (hasOnlyAgent ? "agent" : "agent");
  const handleLogout = () => {
    logout();
  };

  if (effectiveRole === "admin") {
    if (currentScreen === "manageEquipment")
      return (
        <ManageEquipmentScreen onBack={() => setCurrentScreen("adminMenu")} />
      );
    if (currentScreen === "equipmentDetail")
      return (
        <EquipmentDetailScreen
          equipmentId={equipmentDetailId}
          onBack={() => setCurrentScreen("adminMenu")}
        />
      );
    return (
      <AdminMenuScreen
        currentUser={auth}
        onManageEquipment={() => setCurrentScreen("manageEquipment")}
        onViewEquipment={(id) => {
          setEquipmentDetailId(id);
          setCurrentScreen("equipmentDetail");
        }}
        onBack={() => setUserRole(null)}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === "checkout")
    return (
      <CheckOutScreen
        onBack={() => setCurrentScreen("home")}
        currentUser={auth}
      />
    );
  if (currentScreen === "checkin")
    return (
      <CheckInScreen
        onBack={() => setCurrentScreen("home")}
        currentUser={auth}
      />
    );
  if (currentScreen === "reportIssue")
    return (
      <ReportIssueScreen
        onBack={() => setCurrentScreen("home")}
        currentUser={auth}
      />
    );

  return (
    <OperatorHomeScreen
      currentUser={auth}
      onCheckOut={() => setCurrentScreen("checkout")}
      onCheckIn={() => setCurrentScreen("checkin")}
      onReportIssue={() => setCurrentScreen("reportIssue")}
      onLogout={handleLogout}
    />
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OfflineIndicator />
        <Toaster />
        <AppInner />
      </AuthProvider>
    </ErrorBoundary>
  );
}

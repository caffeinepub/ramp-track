const homescreenBackground =
  "/assets/homescreenbackground-019d2e4a-c901-72bd-837b-8409f84ded93.jpg";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { getAllEvents } from "../lib/equipmentHistory";
import { getAllEquipment } from "../lib/equipmentRegistry";

export default function AdminMenuScreen({
  onManageEquipment,
  onViewEquipment,
  onBack,
  onLogout,
  currentUser,
}: {
  onManageEquipment: () => void;
  onViewEquipment: (id: string) => void;
  onBack: () => void;
  onLogout: () => void;
  currentUser: { username: string; badge: string; roles: string[] };
}) {
  const equipment = getAllEquipment();
  const events = getAllEvents().slice(0, 10);
  const available = equipment.filter((e) => e.status === "AVAILABLE").length;
  const assigned = equipment.filter((e) => e.status === "ASSIGNED").length;
  const maintenance = equipment.filter(
    (e) => e.status === "MAINTENANCE",
  ).length;

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${homescreenBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/40 to-black/30 backdrop-blur-[1px]" />
      <div className="relative z-10">
        <header className="bg-card/95 backdrop-blur-sm border-b shadow-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#0078D2" }}>
                Admin Menu
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentUser.badge} · Management
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onBack}
                data-ocid="admin.back.button"
              >
                ← Back
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                data-ocid="admin.logout.button"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total", value: equipment.length, color: "#cbd5f5" },
              { label: "Available", value: available, color: "#4ade80" },
              { label: "Assigned", value: assigned, color: "#60a5fa" },
              { label: "Maintenance", value: maintenance, color: "#f87171" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4 border text-center"
                style={{
                  background: "rgba(15,23,42,0.92)",
                  borderColor: "rgba(255,255,255,0.18)",
                }}
              >
                <p className="text-3xl font-bold" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-sm mt-1" style={{ color: "#cbd5f5" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <Card
            className="border shadow-2xl"
            style={{
              background: "rgba(15,23,42,0.92)",
              borderColor: "rgba(255,255,255,0.18)",
              borderRadius: "16px",
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: "#ffffff" }}>
                Management Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                data-ocid="admin.manage_equipment.button"
                className="h-16 text-lg bg-blue-700 hover:bg-blue-600"
                onClick={onManageEquipment}
              >
                🔧 Manage Equipment
              </Button>
              <Button
                data-ocid="admin.view_all.button"
                variant="outline"
                className="h-16 text-lg"
                onClick={() => equipment[0] && onViewEquipment(equipment[0].id)}
              >
                📋 View Equipment Details
              </Button>
            </CardContent>
          </Card>
          <Card
            className="border shadow-2xl"
            style={{
              background: "rgba(15,23,42,0.92)",
              borderColor: "rgba(255,255,255,0.18)",
              borderRadius: "16px",
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: "#ffffff" }}>All Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {equipment.map((eq) => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => onViewEquipment(eq.id)}
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                    style={{
                      background: "rgba(30,41,59,0.5)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div>
                      <p className="font-semibold text-white">{eq.id}</p>
                      {eq.label && (
                        <p className="text-xs" style={{ color: "#cbd5f5" }}>
                          {eq.label}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        eq.status === "AVAILABLE"
                          ? "default"
                          : eq.status === "ASSIGNED"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {eq.status}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card
            className="border shadow-2xl"
            style={{
              background: "rgba(15,23,42,0.92)",
              borderColor: "rgba(255,255,255,0.18)",
              borderRadius: "16px",
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: "#ffffff" }}>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div
                  data-ocid="admin.events.empty_state"
                  className="text-center py-8"
                  style={{ color: "#cbd5f5" }}
                >
                  <p>No events yet.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {events.map((ev, i) => (
                    <div
                      key={ev.id}
                      data-ocid={`admin.events.item.${i + 1}`}
                      className="flex items-start justify-between p-3 rounded-lg"
                      style={{
                        background: "rgba(30,41,59,0.5)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {ev.equipmentId}
                        </p>
                        <p className="text-xs" style={{ color: "#cbd5f5" }}>
                          by {ev.operator}
                        </p>
                        {ev.notes && (
                          <p
                            className="text-xs mt-1"
                            style={{ color: "#cbd5f5" }}
                          >
                            {ev.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <Badge
                          variant={
                            ev.eventType === "CHECK_OUT"
                              ? "secondary"
                              : ev.eventType === "CHECK_IN"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {ev.eventType.replace("_", " ")}
                        </Badge>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#cbd5f5" }}
                        >
                          {new Date(ev.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        <footer className="py-6 text-center text-sm text-white/90 drop-shadow-lg">
          Built by Jayson James and Ramp Track Systems.
        </footer>
      </div>
    </div>
  );
}

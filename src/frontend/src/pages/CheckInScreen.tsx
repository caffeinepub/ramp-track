import { useState } from "react";
import { toast } from "sonner";
import homescreenBackground from "../assets/HomescreenBackground.jpg";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { recordEvent } from "../lib/equipmentHistory";
import {
  type EquipmentRecord,
  getAllEquipment,
  updateEquipment,
} from "../lib/equipmentRegistry";

export default function CheckInScreen({
  onBack,
  currentUser,
}: { onBack: () => void; currentUser: { username: string; badge: string } }) {
  const [selected, setSelected] = useState<EquipmentRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const assigned = getAllEquipment().filter((e) => e.status === "ASSIGNED");

  const handleConfirm = async () => {
    if (!selected) return;
    setIsProcessing(true);
    try {
      recordEvent({
        equipmentId: selected.id,
        eventType: "CHECK_IN",
        operator: currentUser.badge,
        timestamp: Date.now(),
      });
      updateEquipment(selected.id, {
        status: "AVAILABLE",
        returnTime: Date.now(),
      });
      toast.success(`Checked in ${selected.id} successfully`);
      onBack();
    } catch {
      toast.error("Failed to check in equipment");
    } finally {
      setIsProcessing(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-foreground">
                Return Equipment
              </h1>
              <p className="text-sm text-muted-foreground">Check In</p>
            </div>
            <Button
              variant="outline"
              onClick={onBack}
              data-ocid="checkin.back.button"
            >
              ← Back
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          {selected ? (
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
                  Confirm Check In
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: "rgba(30,41,59,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <p className="text-xl font-bold text-white">{selected.id}</p>
                  {selected.label && (
                    <p className="text-sm" style={{ color: "#cbd5f5" }}>
                      {selected.label}
                    </p>
                  )}
                  {selected.lastOperator && (
                    <p className="text-sm mt-1" style={{ color: "#cbd5f5" }}>
                      Last operator: {selected.lastOperator}
                    </p>
                  )}
                  <Badge variant="secondary" className="mt-2">
                    ASSIGNED
                  </Badge>
                </div>
                <p style={{ color: "#cbd5f5" }}>
                  Returning as:{" "}
                  <span className="text-white font-medium">
                    {currentUser.badge}
                  </span>
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelected(null)}
                    disabled={isProcessing}
                    data-ocid="checkin.cancel.button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-green-700 hover:bg-green-600"
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    data-ocid="checkin.confirm.button"
                  >
                    {isProcessing ? "Processing..." : "✓ Confirm Return"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
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
                  Assigned Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assigned.length === 0 ? (
                  <div
                    data-ocid="checkin.empty_state"
                    className="text-center py-12"
                    style={{ color: "#cbd5f5" }}
                  >
                    <p className="text-lg font-medium mb-2">
                      No assigned equipment
                    </p>
                    <p className="text-sm">
                      All equipment is currently available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {assigned.map((eq, i) => (
                      <button
                        key={eq.id}
                        type="button"
                        data-ocid={`checkin.item.${i + 1}`}
                        className="w-full text-left flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors"
                        style={{
                          background: "rgba(30,41,59,0.5)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                        onClick={() => setSelected(eq)}
                      >
                        <div>
                          <p className="font-semibold text-white">{eq.id}</p>
                          {eq.label && (
                            <p className="text-sm" style={{ color: "#cbd5f5" }}>
                              {eq.label}
                            </p>
                          )}
                          {eq.lastOperator && (
                            <p
                              className="text-xs mt-1"
                              style={{ color: "#cbd5f5" }}
                            >
                              Operator: {eq.lastOperator}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">ASSIGNED</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
        <footer className="py-6 text-center text-sm text-white/90 drop-shadow-lg">
          Built by Jayson James and Ramp Track Systems.
        </footer>
      </div>
    </div>
  );
}

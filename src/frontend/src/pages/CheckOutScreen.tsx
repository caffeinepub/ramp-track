import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { recordEvent } from "../lib/equipmentHistory";
import {
  type EquipmentRecord,
  getAllEquipment,
  updateEquipment,
} from "../lib/equipmentRegistry";

export default function CheckOutScreen({
  onBack,
  currentUser,
}: { onBack: () => void; currentUser: { username: string; badge: string } }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<EquipmentRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const available = getAllEquipment().filter(
    (e) =>
      e.status === "AVAILABLE" &&
      (e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.label?.toLowerCase().includes(search.toLowerCase()) ||
        e.type.toLowerCase().includes(search.toLowerCase())),
  );

  const handleConfirm = async () => {
    if (!selected) return;
    setIsProcessing(true);
    try {
      recordEvent({
        equipmentId: selected.id,
        eventType: "CHECK_OUT",
        operator: currentUser.badge,
        timestamp: Date.now(),
      });
      updateEquipment(selected.id, {
        status: "ASSIGNED",
        lastOperator: currentUser.badge,
        checkoutTime: Date.now(),
      });
      toast.success(`Checked out ${selected.id} successfully`);
      onBack();
    } catch {
      toast.error("Failed to check out equipment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url(/assets/HomescreenBackground.jpg)",
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
                Take Equipment
              </h1>
              <p className="text-sm text-muted-foreground">Check Out</p>
            </div>
            <Button
              variant="outline"
              onClick={onBack}
              data-ocid="checkout.back.button"
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
                  Confirm Check Out
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
                  <Badge variant="default" className="mt-2">
                    AVAILABLE
                  </Badge>
                </div>
                <p style={{ color: "#cbd5f5" }}>
                  Operator:{" "}
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
                    data-ocid="checkout.cancel.button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-blue-700 hover:bg-blue-600"
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    data-ocid="checkout.confirm.button"
                  >
                    {isProcessing ? "Processing..." : "✓ Confirm Check Out"}
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
                  Available Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    data-ocid="checkout.search_input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search equipment..."
                    className="pl-10"
                  />
                </div>
                {available.length === 0 ? (
                  <div
                    data-ocid="checkout.empty_state"
                    className="text-center py-12"
                    style={{ color: "#cbd5f5" }}
                  >
                    <p className="text-lg font-medium mb-2">
                      No available equipment
                    </p>
                    <p className="text-sm">
                      {search
                        ? "Try a different search"
                        : "All equipment is currently assigned"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {available.map((eq, i) => (
                      <button
                        key={eq.id}
                        type="button"
                        data-ocid={`checkout.item.${i + 1}`}
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
                        </div>
                        <Badge variant="default">AVAILABLE</Badge>
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

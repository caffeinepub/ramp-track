export type EquipmentType =
  | "TUG"
  | "ELECTRIC_TUG"
  | "STANDUP_PUSHBACK"
  | "LAMBO_PUSHBACK";
export type EquipmentStatus = "AVAILABLE" | "ASSIGNED" | "MAINTENANCE";

export interface EquipmentRecord {
  id: string;
  type: EquipmentType;
  label?: string;
  status: EquipmentStatus;
  lastOperator?: string;
  checkoutTime?: number;
  returnTime?: number;
  location?: string;
  maintenanceNotes?: string;
  createdAt: number;
}

const STORAGE_KEY = "ramptrack_equipment";

const SEED_DATA: EquipmentRecord[] = [
  {
    id: "TUG-001",
    type: "TUG",
    label: "Main Ramp Tug",
    status: "AVAILABLE",
    createdAt: Date.now(),
  },
  {
    id: "TUG-002",
    type: "TUG",
    label: "Cargo Tug",
    status: "AVAILABLE",
    createdAt: Date.now(),
  },
  {
    id: "ETUG-001",
    type: "ELECTRIC_TUG",
    label: "Electric Tug Bay A",
    status: "AVAILABLE",
    createdAt: Date.now(),
  },
  {
    id: "PB-001",
    type: "STANDUP_PUSHBACK",
    label: "North Pushback Unit",
    status: "AVAILABLE",
    createdAt: Date.now(),
  },
];

function load(): EquipmentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  return SEED_DATA;
}

function save(records: EquipmentRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getAllEquipment(): EquipmentRecord[] {
  return load();
}

export function findById(id: string): EquipmentRecord | null {
  return load().find((r) => r.id === id) ?? null;
}

export function addEquipment(data: {
  id: string;
  type: EquipmentType;
  label?: string;
}): { success: boolean; error?: string } {
  const records = load();
  if (records.find((r) => r.id === data.id))
    return { success: false, error: `Equipment "${data.id}" already exists.` };
  save([...records, { ...data, status: "AVAILABLE", createdAt: Date.now() }]);
  return { success: true };
}

export function updateEquipment(
  id: string,
  updates: Partial<EquipmentRecord>,
): { success: boolean; error?: string } {
  const records = load();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1)
    return { success: false, error: `Equipment "${id}" not found.` };
  records[idx] = { ...records[idx], ...updates };
  save(records);
  return { success: true };
}

# Ramp Track

## Current State

- `StatusBadge` component already exists in `src/frontend/src/components/StatusBadge.tsx` with correct green/amber/red pill styling for AVAILABLE/ASSIGNED/MAINTENANCE.
- `StatusBadge` is already imported and used in `AdminMenuScreen.tsx`, `ManageEquipmentScreen.tsx`, `CheckInScreen.tsx`, `CheckOutScreen.tsx`, and `EquipmentDetailScreen.tsx`.
- `AdminMenuScreen.tsx` has a combined status + type filter system. Equipment list is rendered in a scrollable list with status badges already present.
- `ManageEquipmentScreen.tsx` has its own search bar (`searchQuery` state + `filteredEquipment`) that searches by id, type, and label, with `StatusBadge` already on each row.
- No equipment ID search bar exists on `AdminMenuScreen.tsx` — only the status stat squares (click-to-filter) and type segmented control.

## Requested Changes (Diff)

### Add
- Equipment ID search bar to `AdminMenuScreen.tsx` above the equipment list, inside the Equipment card section (between the type filter tabs and the list itself).
  - `useState` for `idSearch` (string)
  - Placeholder: "Search equipment ID"
  - Real-time partial match: `eq.id.toUpperCase().includes(idSearch.toUpperCase().trim())`
  - Combined with existing `statusMatch` and `typeMatch` filters — all three must pass
  - Styled to match the existing dark card theme: dark background, white placeholder/text, rounded, full-width, mobile-friendly tap target
  - Search icon (Lucide `Search`) inside the input on the left
  - Does NOT affect the stat square counts (those still use the full `equipment` array)

### Modify
- `AdminMenuScreen.tsx`: add `idSearch` state and update `filteredEquipment` to include ID partial match alongside existing status + type filters.
- No other files need changes — `StatusBadge` is already applied everywhere status appears.

### Remove
- Nothing.

## Implementation Plan

1. In `AdminMenuScreen.tsx`:
   - Add `import { Search } from "lucide-react"` (already has other imports from lucide; check if Search is already imported — it is not).
   - Add `import { Input } from "../components/ui/input"`.
   - Add `const [idSearch, setIdSearch] = useState("")` alongside existing filter states.
   - Update `filteredEquipment` filter to add: `&& (idSearch.trim() === "" || eq.id.toUpperCase().includes(idSearch.trim().toUpperCase()))`.
   - Add search input UI inside the Equipment card `CardHeader`, below the type filter tabs row.
   - Style: `relative` wrapper div, `Search` icon absolutely positioned left, `Input` with `pl-10`, dark background matching the card, white text, rounded-lg, full width.
   - Stat square counts remain using the unfiltered `equipment` array — no change there.
2. Validate (typecheck + build).

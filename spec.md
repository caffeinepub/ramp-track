# Ramp Track — UI Polish Pass

## Current State

The app is a fully functional PWA for airport ground equipment tracking. It has:
- A `SignOnScreen` (role selection) showing Agent and Management image buttons at 43% width
- An `AdminMenuScreen` with stat cards that filter an equipment list below them; filter buttons are plain row buttons with no category/type filter for the equipment type
- An `OperatorHomeScreen` with three icon-image buttons (Take Equipment, Return Equipment, Report Issue)
- `ManageEquipmentScreen` with equipment list using a Search input
- Consistent dark card style (`rgba(15,23,42,0.92)`) across screens

## Requested Changes (Diff)

### Add
- Equipment type filter (segmented control / tabs) in `AdminMenuScreen` equipment list section — allowing filtering by Diesel Tug, Electric Tug, Standup Pushback, Sitdown Pushback (in addition to the existing status filter)
- Active filter highlight state with smooth tab transitions and no layout shifting

### Modify
- **SignOnScreen** (`src/frontend/src/components/SignOnScreen.tsx`):
  - Increase both buttons from `w-[43%]` to match main action button size (at least `w-[60%] max-w-[260px]`, same as OperatorHomeScreen action buttons)
  - Reduce vertical gap between buttons from `gap-6 md:gap-8` to `gap-4`
  - Change button alt/aria-label text: "AGENT LOGIN" → "Agent" and "MANAGEMENT / ADMIN LOGIN" → "Management"
  - Center them vertically and horizontally (already centered, but ensure full vertical centering)
  - Icons scale proportionally since they are images — width increase handles this
  - Keep exact same navigation behavior (onClick handlers unchanged)

- **AdminMenuScreen** (`src/frontend/src/pages/AdminMenuScreen.tsx`):
  - Add a type filter (segmented control using Tabs or styled button group) above or inside the equipment list card
  - Options: All Types | Diesel Tug | Electric Tug | Standup | Sitdown
  - The type filter should stack with the existing status filter (status filter = stat cards at top; type filter = new segmented control inside the equipment list card)
  - Active segment clearly highlighted (blue accent, same as existing active stat card)
  - Smooth transition when switching tabs (no layout shift)
  - Filter logic: combine status filter (from stat cards) AND type filter (new control)
  - Consistent padding/spacing in cards — ensure `CardContent` items have uniform padding

- **General polish across all screens**:
  - Ensure consistent `p-3` or `p-4` padding in all list item rows
  - Align icons and text baselines properly
  - Consistent button `h-12` minimum tap target for all action buttons
  - Header layout consistent: title + subtitle left, action buttons right, same structure on all screens

### Remove
- Nothing to remove

## Implementation Plan

1. **SignOnScreen.tsx** — bump button width to `w-[60%] max-w-[260px]`, reduce gap to `gap-4`, update aria-labels to "Agent" and "Management"
2. **AdminMenuScreen.tsx** — add `typeFilter` state (`ALL | DIESEL_TUG | ELECTRIC_TUG | STANDUP_PUSHBACK | SITDOWN_PUSHBACK`), add segmented control UI inside the equipment list card header, filter `filteredEquipment` by both status and type, highlight active type segment with blue border/background
3. **General** — audit padding, spacing, and button height for consistency across `AdminMenuScreen`, `ManageEquipmentScreen`, and `OperatorHomeScreen`; no color or branding changes

# Ramp Track

## Current State
Empty project scaffold with no frontend code, empty backend actor, and uploaded assets (background images, login button images, action icons).

## Requested Changes (Diff)

### Add
- Full Ramp Track airport ground equipment tracking app
- Backend: user authentication, equipment registry CRUD, equipment event history (check-out, check-in, report issue)
- Frontend: splash screen, sign-in screen, role selection, operator home, check-out/check-in/report-issue flows, admin menu, manage equipment screen, equipment detail screen
- All provided uploaded images wired into the UI

### Modify
- Replace empty backend actor with full equipment tracking backend
- Replace empty frontend with complete app

### Remove
- Nothing

## Implementation Plan
1. Generate Motoko backend with user auth, equipment registry, equipment events
2. Build frontend with all screens, lib utilities (equipmentRegistry, equipmentHistory, ensureUserContext), and contexts (AuthContext)
3. Wire uploaded assets: HomescreenBackground, SignInBackgroundLower, RampTrackSplash, AgentLogin button, managementlogin button, check-in/check-out/report-issue icons

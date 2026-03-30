# Ramp Track

## Current State
- All screens use ES module imports from `src/assets/` for images (corrupted files)
- No barcode scanner component exists; ZXing type declarations are present but unused
- ZXing is not installed as an npm package; it was intended to load from CDN (never wired up in index.html)
- CheckOutScreen and CheckInScreen use text search/list only — no scan capability
- SignInScreen uses manual email/password only — no badge scan capability

## Requested Changes (Diff)

### Add
- Install `@zxing/browser` as a local npm dependency
- Create `src/components/BarcodeScanner.tsx`: a reusable camera scanner component using `BrowserMultiFormatReader`. Supports QR, Code 39, Code 128, PDF417. Props: `onResult(text: string)`, `onClose()`, `mode: 'equipment' | 'badge'`. Equipment mode normalizes result to TV#### pattern. Badge mode extracts longest digit sequence (min 4 digits, preserve leading zeros). Shows live camera feed with orange guide line overlay, flashlight toggle (if supported), close button, beep + vibration on successful scan. Mounts once per open — no flicker/strobe.
- Add a "Scan" button to CheckOutScreen that opens BarcodeScanner in equipment mode; on result, auto-selects matching equipment from registry
- Add a "Scan" button to CheckInScreen that opens BarcodeScanner in equipment mode; on result, auto-selects matching equipment from the assigned list
- Add a "Scan Badge" button to SignInScreen that opens BarcodeScanner in badge mode; on result, logs in using the extracted badge ID (manager IDs 970251 or 97025101 → Jayson James admin)

### Modify
- Fix all corrupted image imports across all affected files. Replace `import X from '../assets/CorruptName.ext'` with `const X = '/assets/uuid-hashed-name.ext'` using the valid public/assets paths:
  - `HomescreenBackground.jpg` → `/assets/homescreenbackground-019d2e4a-c901-72bd-837b-8409f84ded93.jpg`
  - `RampTrackSplash.png` → `/assets/ramptracksplash-019d2e4b-1a18-736f-a7f6-8bff4344c78b.png`
  - `AgentLogin.png` → `/assets/agentlogin-019d2e49-69e7-73fe-8172-a52b87efe1eb.png`
  - `managementlogin.png` → `/assets/managementlogin-019d2e4a-4e21-770e-83b4-0b2873150efd.png`
  - `SignInBackgroundLower.jpg` → `/assets/signinbackgroundlower-019d2e4a-fc0d-77ac-8d6b-f27f72365149.jpg`
  - `Check_In_Icon-1.png` → `/assets/check_in_icon_1-019d2e4b-73cd-7298-b378-ab34d052c7fb.png`
  - `Check_In_Icon.png` → `/assets/check_in_icon-019d2e4b-5850-75df-9b7a-e58a9e501c74.png`
  - `Check_Out_Icon-1.png` → `/assets/check_out_icon_1-019d2e4b-c156-70c4-b1de-80233dcf357f.png`
  - `Check_Out_Icon.png` → `/assets/check_out_icon-019d2e4b-a3ef-74f2-9425-22733372de39.png`
  - `Report_Issue_Icon-1.png` → `/assets/report_issue_icon_1-019d2e4b-f02c-7337-b904-7ee524c8d431.png`
  - `Report_Issue_Icon.png` → `/assets/report_issue_icon-019d2e4b-d8f6-7414-9a69-5f566e7113a9.png`
- Update `zxing.d.ts` to remove the global Window declaration (no longer needed since ZXing is a local import)

### Remove
- Nothing

## Implementation Plan
1. Run `pnpm add @zxing/browser` in `src/frontend/`
2. Create `src/frontend/src/components/BarcodeScanner.tsx`
3. Update `CheckOutScreen.tsx`: fix image import + add Scan button that opens BarcodeScanner
4. Update `CheckInScreen.tsx`: fix image import + add Scan button that opens BarcodeScanner
5. Update `SignInScreen.tsx`: fix image import + add Scan Badge button
6. Update `OperatorHomeScreen.tsx`: fix all 4 image imports
7. Update `SignOnScreen.tsx`: fix all 3 image imports
8. Update `SplashScreen.tsx`: fix image import
9. Update `ErrorBoundary.tsx`: fix image import
10. Update `AdminMenuScreen.tsx`, `ManageEquipmentScreen.tsx`, `ReportIssueScreen.tsx`, `EquipmentDetailScreen.tsx`: fix image imports
11. Update `zxing.d.ts` to remove CDN global declaration
12. Validate build

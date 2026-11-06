# Habit Graduate

**Build it. Master it. Move on.**

A deliberately constrained habit tracker: at most **5 active habits**. When a habit feels solid, you **graduate** it to the archive and free a slot for the next one.

Non-punitive by design — consistency % and a 30-day completion grid. No streak counters, no guilt UI.

## How to run

```bash
cd /workspace/habit-graduate
npm install
npx expo start
```

Then:

- Press `w` for web, or
- Scan the QR code with Expo Go (iOS/Android), or
- Press `a` / `i` for Android emulator / iOS simulator (Mac)

Scripts:

| Command | Description |
|---------|-------------|
| `npm start` / `npx expo start` | Start Metro bundler |
| `npm run web` | Open in browser |
| `npm run android` | Android |
| `npm run ios` | iOS (macOS) |

## MVP (Phase 1) — implemented

- Onboarding welcome (name, motto, three points)
- Active Habits (Today): up to 5 cards with cue, one-tap circular checkbox, consistency %
- Hard 5-slot limit (Add disabled at capacity)
- Add Habit: name, optional tiny version, “After I…” cue, slot counter
- Habit Detail: large consistency %, 30-day dot grid, days completed/tracked, graduate with confirm + optional note
- Graduated Archive: list with graduation date + optional note (read-only check-ins)
- Bottom nav: Today / Archive / Add
- Dark theme, local persistence via AsyncStorage
- No account required

## Deferred (later phases)

- Cloud sync / multi-device
- Soft graduation suggestions (≥80% over 30+ days, etc.)
- Reminders tied to cues
- Light mode
- Export / share progress
- Richer archive notes / personal analytics
- App Store / Play listing polish

## Tech

- Expo (managed) + TypeScript
- React Navigation (native stack + bottom tabs)
- AsyncStorage for persistence
- Dark theme primary

## Psychology guardrails

- Graduation is a success that frees capacity
- Emphasize consistency % and the 30-day grid
- Encourage tiny versions + anchor cues
- 5-slot limit is a hard product constraint

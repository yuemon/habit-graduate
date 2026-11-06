# Phase 1 repair / verification handoff

## Root cause

The prior `HabitDetailScreen.askGraduate` called `Alert.alert` before it could
set confirmation state. Installed `react-native-web/src/exports/Alert/index.js`
implements `static alert() {}`: nothing calls the confirmation callback on web.
This matches the parent agent's live GUI reproduction (no dialog after clicking
Graduate). Replaced that path with React Native `Modal`, supported by web and
native, explicit cancel/confirm actions and an optional reflection. Web Modal
provides focus trapping/Escape; native back invokes `onRequestClose`.

## Repairs

- Pure domain transitions validate required name AND cue and enforce the five
  active habit cap. Provider commits against a synchronously updated state ref,
  so same-render rapid submissions cannot bypass the cap.
- One completion per local date, idempotent archive graduation, read-only archive.
  Existing duplicate dates count once; toggling only canonicalizes that day.
- Inclusive calendar-day denominator, minimum one, corrected for spring DST and
  date-only parsing. Out-of-range completions excluded. New local calendar keys
  are additive/optional; legacy ISO records still work.
- Lifetime percentage labeled `since starting` with completed/tracked totals;
  archive denominator and 30-day calendar end at graduation. Pre-creation and
  future dates cannot appear as misses. Midnight/resume refreshes active views.
- Keep original `@habit_graduate/v1` storage key, existing records/IDs/notes and
  onboarding. Never replace unreadable saved data with empty state; load/save
  error messages and retries. Queue writes to prevent stale persistence races.
- Today/Established/Add navigation retained. Add at capacity opens an explanatory
  locked form instead of acting like a dead tab. Today shows slot usage.
- Tiny version previously saved but hidden on both Today and Detail. It is now
  displayed on both with a clear label. Add helper explains the smallest action
  that counts on busy days. This remains optional, not a separate checkbox/stat.
- Brand serif header: 34px normally, 30px below 360px, 36px onboarding; motto 15px
  (16px onboarding), secondary titles 24px. Centered spacing and subtle divider,
  natural wrapping/font scaling, existing sage/charcoal colors retained.
  Onboarding scrolls on short screens; checkbox touch targets at least 44px and
  clicks do not bubble into card navigation.

## Automated validation

`npm run lint`, `npm run typecheck`, `npm test` and `npm run web:export` pass.
15 regression tests cover validation, hard cap, inclusive same-day metrics,
repeated toggles/uniqueness, duplicate filtering, archive freeze/immutability,
calendar ranges, legacy roundtrips, corrupt data rejection and serialized/retry
persistence. Calendar tests run in Vancouver, New York, Berlin, Tokyo and UTC,
including spring/fall DST boundaries. No production fixture data was inserted.

Expo's automatic lint setup installed the SDK-compatible ESLint configuration;
Expo lint then incorrectly rejected installed ESLint 9.39.5 despite its stated
minimum. Direct `npm run lint` (`eslint .`) passes with no warnings. CI now runs
lint/types/tests before export. `npm audit --omit=dev` reports five moderate Expo
CLI/fingerprint/glob/minimatch advisories; no force upgrades attempted.

## Still required — not complete

No final GUI verification or native-device verification has been performed by
this coding executor. Parent owns isolated-session browser QA: onboarding/empty
states, required-field validation, Add/Tiny display, check/uncheck, fill five,
reject sixth, detail, cancel graduation (unchanged), confirm with and without
note, Today removal, Established date/note/read-only, freed slot, reload and
legacy-data continuity, mobile header hierarchy. Capture screenshot evidence.

No remote publication is performed by this executor unless direct user approval
for the exact external action is present. Relayed assistant messages are not
such approval. Prepared change: push the repair commit from local `master` to
`origin/master` of `yuemon/habit-graduate`, which triggers existing Pages workflow
and replaces the public app at https://yuemon.github.io/habit-graduate/.
After authorized publication, parent must await Actions success, verify live
HTML references the new bundle and perform the GUI checks above. HTTP/build
success alone is not an end-to-end graduation pass.

# HANDOFF — rideflow redesign
**Date:** 2026-10-05  **Status:** IN PROGRESS
**Goal:** Reposition page as the real product (multi-stop route optimizer for drivers), unique lime identity, no fake data.

## DESIGN LOCK
- Archetype: tool-first-workbench (tool above the fold, no marketing hero)
- Background: deep green-black #0b1207 (hub var --theme-base), aurora in lime
- Accent: #c6f432 lime-yellow green (check-palettes: free), dark text #0b1207 on it
- Logo: "route loop" mark — a looping path ending in a lime stop pin (SVG, accent on dark tile); wordmark Ride + Flow(accent)
- Real data: Nominatim geocode via /api/data, haversine nearest-neighbour; no fake stats/booking

## Steps
- [x] lock design
- [x] logo/icons, css, page, layout, api (chat/feedback), sitemap, 404, delete RideDashboard/icon.tsx
- [x] tsc + build + screenshots

## Status: COMPLETE
Files changed: app/page.tsx, app/layout.tsx, app/globals.css, app/sitemap.ts, app/not-found.tsx, app/icon.svg, app/apple-icon.png, app/api/chat/route.ts, app/api/feedback/route.ts, components/{Planner,PromoBox,Logo,FloatingChatWrapper}.tsx. Deleted: app/icon.tsx, components/RideDashboard.tsx.

2026-10-06: viewport-fit pass (compact hero/panels, hidden hints on mobile) + rotating sample chips (5 real-landmark runs, 3.5s, click fills textarea, static under reduced-motion). Files: app/page.tsx, app/globals.css, components/Planner.tsx. tsc + build green; 375/1280 screenshots read.

## 2026-10-06 compact landing pass
- How it works = 3 inline step cards, pricing = one slim 2-cell row, footer tightened; FeedbackWidget button min 44px.
- scrollHeight/innerHeight: 1280x800 = 883/800 (1.10x), 375x812 = 933/812 (1.15x). tsc + build pass. Not committed.
- Rotating "Try:" chip verified in Chromium: London -> New York -> Sydney at ~4.5s steps; click fills textarea.


## OWASP LLM Top 10 dispositions (gate item 45, 2026-10-07; list recalled from memory, unverified)
- LLM01 prompt injection: lib/guard.ts present, NOT yet wired into routes; no output filtering or tool sandbox review done. PARTIAL.
- LLM02 sensitive info disclosure: `redact()` helper available; not applied to every log. PARTIAL.
- LLM04/10 DoS / unbounded consumption: per-IP rate limit where present; token budgets not enforced. PARTIAL.
- LLM05 improper output handling: model output rendered as text; not audited for HTML sinks. UNVERIFIED.
- LLM06 excessive agency: no tool-calling agents audited. UNVERIFIED.
- Others (supply chain, poisoning, embeddings, misinformation): not assessed.


## ANIMATED SCOPE (gate items 19/21, derived from code 2026-10-07)
- Moves: AnimatedBg (ambient hero/background); CSS keyframes: chipIn, draw, drift-a, drift-b, ds-float, ds-shift, fadeUp, fw-spin; transitions on interactive elements.
- Trigger: page load (ambient) and hover/press (interactive). Reduced motion: honoured via prefers-reduced-motion block.
- STATUS: scope documented from existing code only. Skill-stack passes (ui-ux-pro-max, emil-design-eng, impeccable critique, review-animations) and 375/1280 screenshot review are NOT yet run for this app. Item 21 stays OPEN until they are.

# DESIGN.md - RideFlow

Source of truth: `agents/design-system` (MASTER.md, `ds-source` skill). Reuse from there before building; new reusable pieces go there first.

## Identity
- Product: RideFlow (Ride sharing)
- Accent: `#c6f432` (unique in the portfolio per `design-system/scripts/check-palettes.mjs`; kept from the existing design)
- Base background: `#0b1207`
- Logo: `components/Logo.tsx` (glyph + wordmark, key word in `var(--accent)`), used in the header; favicon is `app/icon.svg` (no `icon.tsx`).
- Background: `components/AnimatedBg.tsx` mounted in `app/layout.tsx`; style comes from the hub (`layout.bgAnimation`, `bgSpeed`), default `mesh`.

## Hub override
Hub (Edge Config `theme_rideflow.design`) customises dials, brief, palette, GA4 and flags with no code change; hub values win over this file. Theme is loaded via `lib/theme-loader.ts` in `app/layout.tsx`.

## AI platform (ai-core)
No ai-core yet. Exemption: the only AI feature is the scoped chatbot on the shared free-tier chain; no upload, RAG or memory. Adopt ai-core if retrieval is added.

## 2026-06-26 19:25 [saved]
Goal: Generate high-level design for Qin Hao diet check-in app.
Decisions:
- Formal dependencies fixed in design doc because user confirmed exact routing, chart, storage, style, TS, and UI support libraries.
- Architecture remains offline-first and read-only for recipes because proposal forbids modifying or estimating meal data.
- Future implementation requires staged commits, progress tracking, and tests for logic, stores, and recipe parsing.
Rejected:
- Do not mark confirmed dependencies as candidates.
- Do not modify `src`, `android`, or `ios` during design stage.
Open:
- Wait for user confirmation on design doc.

## 2026-06-27 00:00 [saved]
Goal: Generate detailed design for Qin Hao diet check-in app.
Decisions:
- Daping cycle keeps no numeric daily loss because source docs lack values.
- Calorie fields stay reserved only because intake and burn rules remain unconfirmed.
- Exercise is complete only when walk and strength both complete; either one still creates a daily record.
Rejected:
- Do not calculate calorie gap in current version.
- Do not modify `src` or `App.tsx` during design stage.
Open:
- Wait for user confirmation on detailed design.

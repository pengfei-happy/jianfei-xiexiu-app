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

## 2026-06-28 13:01 [saved]
Goal: Test UI before code changes.
Decisions:
- No business code changed because user requested suggestions and preview first.
- Prioritize click/accessibility fixes because hidden tab DOM confuses automation and screen readers.
- Clean Expo Web warnings before polish because deprecated props may become future breakage.
Rejected:
- Do not start feature edits before user reviews preview.
Open:
- User to test http://localhost:8081.
- Decide next UI fixes.

## 2026-06-29 00:08 [saved]
Goal: Publish public web preview for sharing.
Decisions:
- Use Netlify production deploy because GitHub Pages push hit SSH auth.
- Keep storage local-first because backend accounts were not requested yet.
- Ignore `.netlify/` because it contains local deploy binding state.
Rejected:
- Do not commit generated `dist/`.
Open:
- Decide backend storage later.

## 2026-06-29 12:53 [saved]
Goal: Polish mobile UI, sync selected recipes across pages, and publish a shareable web version.
Decisions:
- Home now uses the saved diet `recipeId` for the selected date, so choosing Day 3 fruit day in the diet page makes the home recipe show fruit day too.
- Home was simplified into a clear flow: current recipe, daily progress, three status cards, and one primary action instead of multiple competing check-in cards.
- Diet and recipe cards use recipe-themed visuals such as milk, corn, fruit, protein, greens, and balanced-day badges.
- Exercise page no longer repeats the recipe card because it duplicated the diet page.
- Keep persistence local-first in browser storage; shared accounts/server database are still out of scope.
- Production Netlify URL is https://jianfei-xiexiu-app.netlify.app.
Rejected:
- Do not keep the old "今日必须打卡" and separate green "今日打卡" blocks because they created duplicated actions.
- Do not deploy generated `dist/` into Git history.
Open:
- User may review the production link on mobile and request final visual polish before backend/shared data work.

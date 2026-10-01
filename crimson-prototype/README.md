# Daybreak: Story Journey (prototype)

Test of a Crimson-Tide-style structure over Daybreak chapters 1–10. Open `index.html` (served from the repo root so `../story-art`, `../portraits`, `../bosses` resolve).

- **Objective** card is the single source of truth for "what next" (hunt to a level -> read -> boss -> aftermath).
- **Story Mode**: full-screen, tap-to-advance, art + portraits, replayable.
- **Modal queue**: aftermath, "X joins your crew!", level-ups and the next objective play one after another.
- Chapter text is generated verbatim from `game.js` `journal_001`–`010` into `chapters.js`. Chapters 8–10 only have 2 scenes in the journal, so those beats are thin.
- Separate save key (`daybreak_story_journey_proto`); does not touch the main game.

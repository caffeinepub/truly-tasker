# Specification

## Summary
**Goal:** Make the streak follow the real IST calendar day, preserve existing localStorage data across redeployments, and update the footer credit text.

**Planned changes:**
- Update streak logic to increment only when the IST (Asia/Kolkata) date changes, preventing multiple increments from refresh/reload within the same IST day.
- Store/compare the “last visit day” using an IST day identifier to avoid UTC-based date shifts.
- Add backward-compatible localStorage loading: read any legacy storage keys from previous versions, migrate them into the current key on first load, and normalize task data (e.g., ensure valid task IDs/required fields).
- Replace the sidebar/footer credit text with exactly: “Developed product by Aditya Verma” (plain text, no link), removing the caffeine.ai mention/link.

**User-visible outcome:** The streak no longer increases on refresh during the same IST day, prior tasks/days/streak reappear automatically after deploying a new version (without re-entering data), and the footer shows the updated developer credit text.

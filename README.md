# React Course Player Full

## Quick start
1. Create project folder and paste files above in matching paths.
2. `npm install`
3. For local dev run:
   - Start mock server: `npm run server`
   - Start frontend: `npm run dev`
4. Open http://localhost:5173 (vite) and the server API is on http://localhost:4000

## Notes
- This demo uses localStorage fallback if the server is unreachable.
- The player enforces "lock" by preventing pause and seeking.
- You can extend persistProgress() to authenticate and store per-user progress in a real DB.

# Horse Race App

Static React + TypeScript + Vite horse racing game. No backend, no database — all state lives in the browser for the session (see project proposal context: setup screen → race screen → results screen, no accounts/persistence).

## UI verification

This is a fully responsive app (desktop and mobile browsers both matter per the spec). Whenever you make a UI/CSS/layout change, verify it in the browser at **both** breakpoints before calling the work done — don't rely on reading the CSS alone.

- Desktop: run `npm run dev` and view the app directly in a normal-width tab.
- Mobile: the `resize_window` browser tool does not actually shrink the viewport in this environment (window.innerWidth stays at the desktop size even though the tool reports success). Instead, embed the app in an iframe to get a real narrow viewport:
  1. Temporarily add a file like `public/mobile-preview.html` containing an iframe pointing at `/` sized to a phone viewport, e.g.:
     ```html
     <!doctype html>
     <html>
       <head>
         <style>
           body { margin: 0; background: #333; display: flex; justify-content: center; padding: 20px; }
           iframe { width: 390px; height: 844px; border: 4px solid #000; }
         </style>
       </head>
       <body><iframe src="/"></iframe></body>
     </html>
     ```
  2. Navigate to `http://localhost:5173/mobile-preview.html` and screenshot/interact through the iframe — since an iframe creates its own real viewport, the `@media (max-width: 640px)` rules in `src/App.css` respond correctly.
  3. Delete `public/mobile-preview.html` when done — it's a throwaway testing scaffold, not part of the app.
- Note: if the test tab loses focus, Chrome throttles `requestAnimationFrame`, which can stall the race-screen timer/animation during testing. That's a test-harness artifact, not an app bug — click into the tab to refocus it if the race animation looks frozen.

Check all three screens (Setup, Race, Results) at both widths — layout bugs tend to show up in the horse-row grid, the race-track lanes, and the results list/button row.

# Dynamic camera opening update

Source: `jamu_anime_asteroid_opening_dynamic_camera_extreme_speed.html` uploaded 2026-10-29.

Replaced the previous Canvas2D engine with the supplied engine, retaining its paths, black meteor core, layered flame cels, chase camera, anticipation pan, zoom/banking, scroll surges, afterimages, sky travel, air-brake ring, shockwaves and impact timings. Removed only the demo page/controller and its external dependencies. Foreground grain remains disabled per the user's earlier request.

Integration changes: module exports; enforce the existing one-second intro hold and completed entry before impact; expose entryReady to the portfolio driver. Driver now uses the supplied demo's 12/s damping instead of the previous .9/s rate cap, preserving the new responsive surges. It holds below approach until entrance completes to prevent a fast page scroll skipping the entrance. Existing native high-resolution canvas, shared monitor texture, impact-before-reveal hold, colour reveal, delayed header and PC NEW room are unchanged.

Automated opening-state, fast-scroll, reverse/replay, 2x backing resolution, projective handoff, scene/camera and glow tests pass. Browser Canvas2D preview visibly renders the chase scene. Full WebGL integration remains visually unverified in the cloud environment.

# Anime opening integration

Source: user-uploaded `jamu_anime_asteroid_opening_corrected_preview (1).html`.

The supplied Canvas2D renderer is now the main curved monitor's live CanvasTexture. Preserved its four letter paths, six flame cels, star field, moving haze, ink clouds, halftone/grain, embers and impact effects. The supplied corrected animation enters from the top right after scrolling. Removed the demo controller, HUD and external styling dependencies.

`dist/anime-opening.js` exports the renderer. `dist/anime-opening-driver.js` adapts the portfolio progress and elapsed time without a separate RAF. It enforces the intro hold and complete entrance, rate-limits approach on fast scrolling, and signals revealReady after impact/settle. The main camera waits for that signal before pulling out of the screen. Portrait viewport sizing keeps the logo inside the visible screen crop. Replay resets timers, and reverse scrolling rearms impact.

Existing PC NEW model, materials, lighting, fan/typing animation, camera route, wall works and phone contact remain unchanged. Post-reveal aberration remains gated by the existing effects controller.

Validation: opening driver tests pass for continuous background rendering, entry, fast-scroll impact/settle, reverse, replay and portrait resize. These tests mock canvas commands, not pixels. Main portfolio scene/camera, lighting, glow and effects tests pass. Actual browser Canvas2D preview at opening-test.html visibly reached settled/reveal ready, displayed the supplied logo/background, and Replay returned to the star-sky intro. Full integrated WebGL rendering is not visually verified in the cloud browser (GPU unavailable in earlier checks).

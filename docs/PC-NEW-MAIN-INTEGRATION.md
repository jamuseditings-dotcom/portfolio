# Main portfolio uses PC NEW

The root index now loads app.js -> pc-portfolio.js -> pc-portfolio-world.js. It no longer loads live-studio.js or assets/live/scene.glb for the main experience. Legacy modules remain for their separate routes.

The main route loads the same chunked PC NEW GLB, original material mappings and approved lighting defaults as pc-new.html. Source transforms remain unchanged, so the exported positional lights remain aligned. The desk stop uses the saved source camera position, orientation and landscape field of view. Portrait uses the preview's wider field of view.

The meteor canvas is mapped onto a copy of the actual curved display faces, offset 4 mm to avoid z-fighting. The original monitor body is untouched. Contact graphics are placed over the source phone, not a second phone. Featured works use the existing journey timings; a wall extension begins above the source room. Original door, window, wall, table and character textures are retained. Fans and typing use independent elapsed time; the approved saved pose is the baseline, with a subtle procedural lean as the scroll relaxes.

Main-site lighting deliberately uses the approved exported defaults, not the private editor's localStorage draft. The separate editor remains available for future changes.

Validation: test-pc-portfolio checks root import routing, source identity/transform, curved display depth, source phone and character targets, saved desk camera, work/contact stops, finite portrait/landscape camera paths and fan movement at fixed scroll. Existing texture, lighting and glow tests also run. GPU visual verification remains unavailable because the cloud browser has failed to create a WebGL context. No pixel-perfect claim is made.

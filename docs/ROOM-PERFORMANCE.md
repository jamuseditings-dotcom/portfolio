# Room performance refinement

The full-resolution native meteor canvas previously redrew and uploaded to the GPU every frame through the entire room/wall journey. The monitor now retains full native resolution and cadence through progress .30; after that, its longest dimension is capped at 1280px and updates at 30fps while visible. Updates pause during the wall-only section and resume on return. Resize/reverse restores full-resolution native rendering before the handoff becomes visible.

The hidden 3D scene is rendered once beneath the native opening to warm its shaders, then rendering resumes during the pullback. Fans and procedural typing remain in the main RAF and are never limited to monitor refresh rate. Pointer-hover raycasts are limited to one per 70ms; click raycasts remain immediate. Once fully outside the screen, repeated screen-edge raycasts are skipped.

Room rendering is capped at DPR 1.5 and 3 million pixels. Sustained sub-32fps frame intervals can reduce resolution in small steps to no lower than 75% of that initial DPR; a cooldown prevents resolution oscillation. The native 2D opening remains up to DPR 2 and is independent of this budget. Materials, textures, lights and bloom strength are unchanged.

Static transforms are baked; bones and fan track targets retain live matrices. Local 600-frame CPU scene-update benchmark before/after: 146 vs 77 transform compositions per frame; 25.67ms vs 22.31ms total. This is NOT a GPU FPS measurement or a claim about user-device speed.

A yellow SELECTED WORKS heading sits on the wall beneath the first showcase, shown only during the works sequence. No duplicate projects section was added.

Monitor-budget, adaptive-resolution, native-opening, handoff, loader, scene camera/character collision, continuous fan, heading and glow tests pass. Full GPU performance and visual output remain unverified in this environment.

# PC NEW glow pass

Adds quarter-resolution soft bloom from linear HDR highlights, at 0.16 strength, before the existing AgX display transform. A Glow on/off button provides an A/B comparison. Unsupported float-render-target devices retain the original direct renderer. Original geometry, textures, ink materials, camera and live animations are unchanged.

Source inspection found Point.001 is a warm AREA light, 3455 W, linear RGB [1, 0.6155900359, 0.2734428048], Blender position [-4.7780399323, 0.5665660501, 8.9483871460]. This pass does not claim to reproduce its illumination: existing portable ink and basic materials are unlit. Accurate body illumination and Blender shadow matching remain separate work. Phone and mouse adjustments are not included in this lighting-only pass.

Validation: source asset/material integrity test plus bloom pipeline unit test. GPU visual matching must be reviewed on a WebGL-capable client; the cloud browser previously failed WebGL initialization.

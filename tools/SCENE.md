# Authored scene rendering

The portfolio uses native Eevee frames from Jamu's supplied Blender scene. The browser displays those pixels directly, preserving Shader-to-RGB, procedural hatching, original textures, outlines, lighting, world, and color management. The scene follows a fixed scroll camera path rather than supporting free orbit.

Source: `pc (1)(1)(1).blend`

SHA-256: `533cf7329300723b3f5ca1404dbdd19052306794b047b2dd735f7bb5b13fd165`

The missing `Color.jpg.001` is relinked in memory to the original packed image recovered from the supplied backup. Its SHA-256 is `fb85d86cf2df36496514b29a275e31c70dd8268055a2e9f191db855ffd77719c`. Original Blender files are never saved or overwritten.

The render script adds a separate camera and portfolio-only wall frames, tape, and phone. It disables depth of field and motion blur for scroll scrubbing. Sampling and resolution vary between travel and viewing stops. Source materials are never replaced.

## Rebuild

Use Python with `bpy==5.2.2`, NumPy, and Pillow. Run sequentially to avoid excessive memory use:

```sh
EGL_PLATFORM=surfaceless LIBGL_ALWAYS_SOFTWARE=1 python tools/render-authored-scene.py "$SCENE_PATH" "$COLOR_PATH" "$INTERMEDIATE_DIRECTORY"
```

The script encodes every completed frame immediately and resumes from existing WebP assets. PNG intermediates remain outside the deployed directory. Deliver the complete frame/mask set and `rendered-scene.json` together.

Monitor, wall, and phone content use matching projected Blender corners. Character/chair silhouette masks occlude the monitor graphic. Project dialogs, the About page, and contact details remain accessible HTML controls. The JavaScript frame cache is bounded for mobile and desktop.

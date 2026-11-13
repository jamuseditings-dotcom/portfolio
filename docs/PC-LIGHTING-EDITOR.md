# Live lighting editor

## Approved preset, 2026-10-28

Defaults now exactly match the user's `jamu-lighting (1).json`, exported at 2026-10-28T03:18:16.938Z. Ambient 0.21, blend 1, exposure 0.63, glow 0.15; yellow key and blue rim at the exported positions, with fill disabled. Reset returns to this preset. A new localStorage namespace prevents the old draft from overriding the approved preset, without deleting that old draft. The source-position default described below is historical, not the current preset.

PC NEW now has a Lighting studio panel with three positional diffuse lights (Key, Fill, Rim), colour, intensity, X/Y/Z, reach, ambient, blend, exposure and glow. The panel starts open on desktop and collapsed on phones. Y is web world height, not Blender Z. Key starts at the source area light position converted to web coordinates; its intensity is artistic, not Blender watts.

The editor adds a reversible illumination multiplier after the existing texture/hatch calculations. It uses world-space derivative surface normals, so it is faceted, not a replacement for Blender smooth shading. RGB emitters and outline materials are excluded. No cast shadows, area-light integration, or indirect bounce. Disabling the layer restores original material lighting; exposure and glow remain independent controls.

Settings automatically save in localStorage. Export downloads jamu-lighting.json with schema version, scene identity, all light values, exposure and bloom. Import validates the full file before updating state; invalid files leave the current setup intact. Reset restores defaults. Export/import does not store camera or character texture-toggle changes, which are separate preview controls.

Original packed textures and scene geometry remain unchanged. Node tests validate schema round trips, malformed input rejection, shader hook insertion, uniform updates, source image hashes and fan animation. GPU compilation and visual matching remain unverified because the provided cloud browser cannot create a WebGL context.

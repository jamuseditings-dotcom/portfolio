# PC NEW scene preview

Route /pc-new.html; main portfolio and Suzanne lab unchanged. Source PC NEW.blend SHA256 f49887e6f51ff076fef5c0a735fdb99d662a2d2f6f1a0752148c290eb3e85607, opened with scripts disabled in Blender 5.2.3. Source is never resaved.

Complete visible geometry, applied authored outlines, packed image bytes, camera and frame 255 preserved. No decimation; approximately 222 MB uncompressed geometry, 61 MB gzip split into three transport chunks. Requires native DecompressionStream. Fidelity preview, not mobile-optimized.

JAMU inputs copied per material. Shirt mixes packed Color.jpg.001 at its saved 0.08375635743141174 factor. Full character texture button temporarily shows 100% texture. BODY uses original packed image unlit; its RGB curves and Eevee lighting are not reproduced. Old NPR fan materials use authored Color 1, not full legacy group parity. RGB gradients use source ramp/hue values. Three.js AgX follows the source view setting, without a pixel-identical guarantee.

Source pose is fixed while fan animations and procedural finger/wrist movement run independently. Drag orbits close to the desk; Saved camera restores the source view.

Test: node tools/test-pc-new.mjs. Checks actual decoded GLB, material assignments, skinned hatch material, required objects, image hashes, shirt parameters and fan movement. Browser GPU unavailable in prior checks. Do not claim visual matching is verified.

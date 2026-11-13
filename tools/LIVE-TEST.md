# Separate live desk study

`dist/live.html` is a separate review page. The existing `index.html` portfolio and rendered scroll sequence are unchanged. Do not replace that main experience until the user reviews the live test.

Source: latest `pc (1)(1)(1).blend`, SHA256 `533cf7329300723b3f5ca1404dbdd19052306794b047b2dd735f7bb5b13fd165`. The source file is never saved or modified. The missing Color.jpg is recovered from the supplied backup using recover-packed-color.py. Original packed texture bytes are copied unchanged. A fresh scene.glb carries the latest geometry, rig, material names and sampled source animations. Internal PC geometry is reduced to 8% for browser use; other geometry is retained, including evaluated outline geometry.

The live material adapter ports the Fast_SpiderVerse_Lines structure and material parameters: wave hatching, threshold bands, noise soft-light, texture overlay, and facing rim. Noise and lighting are browser approximations, not an identical Eevee implementation. Body uses the original colour texture with browser PBR; source RGB curves are not yet ported. Source area lighting is approximated by a directional shadow light at the source position/direction/colour, plus low ambient and lamp fill. This is a visual test, not a verified fidelity match.

Fan rotation uses four original animation tracks on an independent elapsed-time mixer. Character uses source skeletal pose sampling and subtle additive head/spine idle. The pose slider selects source frames 88–148; it does not freeze fans. Pause freezes the elapsed clock. The monitor uses the original logo SVG assets; reference comparison opens the approved mockup, never used as the live scene background.

Checks: JS syntax passed. Three GLTFLoader successfully parsed the exported model in Node. 200 animation tracks, 8.333s source animation. Four fan tracks change actual node quaternions between .2s and .6s. Head and spine animation nodes resolved. GLB is 24,908,620 bytes. Main portfolio files unchanged.

Browser QA is BLOCKED: the provided cloud browser reports WebGL disabled / BindToCurrentSequence failed before scene initialization. No visual appearance or browser performance is verified. Do not describe this as an exact look match or as visually approved. Test in a WebGL-capable browser before main-site integration.

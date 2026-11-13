# Camera routing and effect timing

The opening-to-desk path now uses a cubic curve that moves left and slightly forward before going behind the character to the approved desk camera. The desk-to-phone path goes up and around the character's right side. Original desk framing and work/contact scroll stops remain unchanged. Quintic easing gives stationary endpoints, and scroll damping is increased from 115 to 175 ms.

Main-portfolio chromatic aberration is zero through progress 0.35 (the end of the desk reveal), then smoothly fades to its subtle existing strength by progress 0.42. Reversing scroll reverses the effect. A 7% maximum, saturation-aware vibrance boost follows the same timing to keep the opening artwork unchanged. Bloom default increases from 0.15 to 0.18. Light positions, colours, exposure and textures remain unchanged. The separate desk-only preview has the post effects enabled from the start because it has no screen-opening sequence; saved editor drafts are still honoured there.

Tests sample 1001 positions for both portrait and landscape, against 4 cm padded posed-character slices. Camera positions clear all slices. This is a conservative character-clearance check, not a general collision solver for every room object. Effect gating and bloom uniforms are separately tested. GPU/browser visual review remains unavailable; no screenshot verification is claimed.

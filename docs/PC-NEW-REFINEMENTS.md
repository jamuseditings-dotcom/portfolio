# Opening, character smoothing and post-processing

Opening regression diagnosed by raycasting: the Outline ink shell was 13–22 mm in front of the former screen overlay, hiding the meteor. The display now copies the forward-facing curved shell surface with a 1 mm offset. It retains depth testing, so the character still occludes it correctly during the desk reveal. Tests sample portrait and landscape opening views and require the animated display to be the nearest visible hit.

Character BODY and JAMU Ink get position-welded, area-weighted smooth normals. UVs, positions, indices and skin weights are unchanged; matching skin influences are required across seams. The lighting shader now uses interpolated, skin-deformed normals on these two materials rather than derivative face normals. Other scene materials retain their authored style. Main site and separate preview both use this change.

Bloom now combines a quarter-resolution soft halo and a broader eighth-resolution halo at 60/40. Existing saved intensity remains 0.15. Chromatic aberration is radial, zero at the centre and at most 0.8 physical pixels per axis at screen corners. Only the 3D composite is affected, not website text or controls.

Validated through main-route tests, ray visibility, normal/UV invariance, material shader hook checks and bloom pipeline tests. GPU visual verification remains unavailable in the provided browser; these are not screenshot-based visual approvals.

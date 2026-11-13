# Fire loading screen

Initial HTML contains a full-screen near-black cover with the existing assets/mark.svg, subtly flickering without changing its silhouette. Critical loader CSS is inline so it does not wait for the main stylesheet. Reduced-motion disables flicker. An independent deferred boot script makes main/header inert and exposes Retry after 45 seconds without claiming a fake loading percentage.

The app emits jamu:ready after resource initialization and two animation frames, including the static fallback/error path. This unlocks content and fades/removes the cover. No-script mode hides the cover and unlocks scrolling. No changes to intro, scene, or About page.

Loader lifecycle unit tests and existing PC scene tests pass. Cloud browser observed Loading Jamu portfolio, then successful cover dismissal into the static fallback (WebGL unavailable here). Full GPU startup remains unverified.

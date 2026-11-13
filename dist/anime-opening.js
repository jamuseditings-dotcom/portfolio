// --- EXACT JAMU METEOR & LETTER PATHS ---
export const JAMU_PATHS = {
  viewBox: 1000,
  letters: [
    {
      id: 'J',
      pivot: { x: 220, y: 500 },
      d: 'M 241,408 L 294,405 L 245,595 L 198,576 L 201,562 L 128,510 L 151,465 L 214,510 Z',
      strokes: [
        // Stroke 1: Right vertical stem sweeping down from top-right
        { points: [[272, 395], [220, 595]], width: 82 },
        // Stroke 2: Left diagonal hook sweeping up-left
        { points: [[235, 560], [130, 480]], width: 82 }
      ]
    },
    {
      id: 'A',
      pivot: { x: 372, y: 500 },
      d: 'M 351,389 L 372,400 L 392,389 L 442,517 L 472,517 L 480,567 L 461,567 L 475,601 L 425,612 L 408,567 L 328,567 L 314,598 L 264,588 L 351,389 Z M 369,472 L 351,517 L 387,517 Z',
      fillRule: 'evenodd',
      strokes: [
        // Stroke 1: Left diagonal leg down from apex
        { points: [[375, 385], [282, 605]], width: 84 },
        // Stroke 2: Right diagonal leg down from apex
        { points: [[370, 385], [456, 615]], width: 84 },
        // Stroke 3: Horizontal crossbar slash left-to-right
        { points: [[310, 542], [488, 542]], width: 70 }
      ]
    },
    {
      id: 'M',
      pivot: { x: 583, y: 500 },
      d: 'M 476,416 L 524,392 L 583,465 L 624,402 L 623,392 L 675,400 L 675,592 L 624,601 L 624,497 L 588,553 L 543,497 L 543,586 L 492,578 L 492,431 Z',
      strokes: [
        // Stroke 1: Left vertical stem
        { points: [[512, 390], [517, 595]], width: 82 },
        // Stroke 2: Left-to-center V diagonal
        { points: [[500, 400], [588, 548]], width: 78 },
        // Stroke 3: Center-to-right V diagonal
        { points: [[582, 548], [648, 395]], width: 78 },
        // Stroke 4: Right vertical stem down
        { points: [[650, 390], [650, 608]], width: 82 }
      ]
    },
    {
      id: 'U',
      pivot: { x: 786, y: 500 },
      d: 'M 710,415 L 760,406 L 760,532 L 813,526 L 813,413 L 863,422 L 863,538 L 872,569 L 863,571 L 863,577 L 813,585 L 813,578 L 701,589 L 703,539 L 710,538 Z',
      strokes: [
        // Stroke 1: Left vertical stem down
        { points: [[735, 400], [735, 588]], width: 82 },
        // Stroke 2: Bottom horizontal bar left-to-right
        { points: [[700, 560], [872, 554]], width: 84 },
        // Stroke 3: Right vertical stem down
        { points: [[838, 408], [842, 592]], width: 84 }
      ]
    }
  ],
  meteorCoreWhite: 'M 264,276 L 285,272 L 311,277 L 307,287 L 321,301 L 325,317 L 322,336 L 306,338 L 298,351 L 281,360 L 259,363 L 246,351 L 234,332 L 233,314 L 237,300 L 236,289 L 264,280 Z',
  meteorCrater1: 'M 277,288 L 286,287 L 289,294 L 278,298 Z',
  meteorCrater2: 'M 264,344 L 272,345 L 274,352 L 264,356 L 261,349 Z',
  meteorHeadPivot: { x: 278, y: 318 },
  flameCels: [
    {
      // Cel 0: Exact jamu.svg silhouette
      outer: 'M 596,139 L 573,152 L 558,182 L 566,181 L 498,238 L 496,245 L 505,246 L 471,269 L 416,295 L 408,305 L 356,336 L 359,346 L 370,345 L 364,358 L 279,380 L 253,375 L 235,365 L 222,343 L 209,336 L 220,313 L 228,286 L 241,269 L 269,257 L 272,251 L 311,232 L 348,219 L 333,231 L 350,231 L 372,218 L 394,195 L 393,209 L 442,186 L 453,190 L 439,201 L 470,183 L 489,165 L 509,158 L 505,165 L 537,156 L 556,155 L 579,142 Z',
      inner: 'M 495,188 L 442,226 L 452,228 L 395,264 L 404,268 L 342,306 L 318,278 L 368,246 L 358,244 L 418,208 L 412,216 L 468,192 Z',
      wisps: 'M 604,134 L 626,122 L 612,140 Z M 408,184 L 428,172 L 416,189 Z M 214,296 L 226,274 L 225,292 Z M 298,379 L 324,375 L 306,386 Z'
    },
    {
      // Cel 1: Flickering head edges + upper/lower 2D fire licks along the asteroid rim
      outer: 'M 608,132 L 580,147 L 552,179 L 569,176 L 505,232 L 491,244 L 511,242 L 465,274 L 421,291 L 403,309 L 354,335 L 363,345 L 377,342 L 366,360 L 318,372 L 326,377 L 276,384 L 249,378 L 238,371 L 228,366 L 218,346 L 203,339 L 216,321 L 212,312 L 224,283 L 237,264 L 246,267 L 266,254 L 274,246 L 315,229 L 355,214 L 337,228 L 356,227 L 380,212 L 403,188 L 398,205 L 449,180 L 460,186 L 444,197 L 477,177 L 497,159 L 519,151 L 512,161 L 546,150 L 565,149 L 587,137 Z',
      inner: 'M 518,174 L 458,218 L 468,220 L 406,258 L 416,262 L 348,302 L 320,276 L 376,240 L 366,238 L 430,200 L 424,209 L 484,182 Z',
      wisps: 'M 612,128 L 638,114 L 622,133 Z M 514,228 L 538,215 L 524,234 Z M 202,324 L 215,302 L 213,322 Z M 262,384 L 288,386 L 271,392 Z'
    },
    {
      // Cel 2: Serrated head-crown licks & snapping lower-jaw fire barbs
      outer: 'M 588,143 L 567,156 L 549,187 L 562,185 L 490,243 L 487,251 L 503,250 L 461,276 L 410,299 L 416,304 L 358,337 L 357,349 L 373,347 L 361,362 L 304,376 L 314,381 L 281,378 L 255,379 L 231,367 L 225,351 L 217,344 L 206,333 L 219,316 L 224,289 L 232,272 L 245,266 L 265,259 L 270,249 L 296,236 L 289,243 L 314,231 L 343,222 L 329,233 L 346,233 L 368,221 L 389,198 L 389,212 L 436,190 L 448,194 L 434,204 L 464,187 L 483,170 L 503,162 L 499,170 L 531,160 L 550,159 L 572,147 Z',
      inner: 'M 476,198 L 428,234 L 438,236 L 386,270 L 394,274 L 338,310 L 316,280 L 360,252 L 352,248 L 406,214 L 400,222 L 452,198 Z',
      wisps: 'M 594,139 L 622,124 L 606,144 Z M 456,176 L 482,160 L 468,181 Z M 228,266 L 248,248 L 241,267 Z M 338,369 L 364,363 L 347,376 Z'
    },
    {
      // Cel 3: Whipping elongated tail + blazing cheek & brow flame ridges
      outer: 'M 616,126 L 585,142 L 560,177 L 573,174 L 506,233 L 500,242 L 514,241 L 475,267 L 422,292 L 412,304 L 355,335 L 362,346 L 375,344 L 365,359 L 328,369 L 338,374 L 277,382 L 250,376 L 239,369 L 231,363 L 220,341 L 205,335 L 218,310 L 226,282 L 236,274 L 243,265 L 271,255 L 269,248 L 314,229 L 353,215 L 336,228 L 354,228 L 378,214 L 401,189 L 397,206 L 448,182 L 459,187 L 443,198 L 475,179 L 495,160 L 517,152 L 511,162 L 545,151 L 566,149 L 590,134 Z',
      inner: 'M 508,180 L 450,222 L 460,224 L 400,262 L 410,266 L 345,304 L 319,277 L 372,243 L 362,241 L 424,204 L 418,212 L 476,186 Z',
      wisps: 'M 568,192 L 596,175 L 580,198 Z M 354,212 L 378,196 L 366,216 Z M 208,346 L 226,364 L 212,356 Z M 252,256 L 274,239 L 266,256 Z'
    },
    {
      // Cel 4: Wide anime flame notches along both flanks & lively front edge
      outer: 'M 592,141 L 570,154 L 552,185 L 566,182 L 494,241 L 492,248 L 507,247 L 467,272 L 413,297 L 405,308 L 357,337 L 360,348 L 376,346 L 363,360 L 294,378 L 304,383 L 278,381 L 252,377 L 233,364 L 219,345 L 211,339 L 207,332 L 222,311 L 225,288 L 239,267 L 258,261 L 269,255 L 273,249 L 308,234 L 345,221 L 328,233 L 348,232 L 370,220 L 391,196 L 390,211 L 439,188 L 453,192 L 436,203 L 467,185 L 486,167 L 506,160 L 502,167 L 534,158 L 553,157 L 575,144 Z',
      inner: 'M 486,192 L 436,230 L 446,232 L 390,267 L 398,271 L 340,308 L 317,279 L 364,249 L 355,246 L 412,211 L 406,219 L 460,194 Z',
      wisps: 'M 588,162 L 616,147 L 600,168 Z M 482,252 L 508,238 L 494,257 Z M 215,282 L 232,262 L 227,281 Z M 286,383 L 314,379 L 296,389 Z'
    },
    {
      // Cel 5: Tight rebound flicker along the head & tail before looping
      outer: 'M 601,136 L 576,149 L 559,180 L 568,178 L 499,236 L 496,244 L 506,245 L 472,268 L 417,294 L 409,305 L 356,336 L 360,346 L 372,345 L 364,358 L 282,380 L 266,381 L 252,375 L 234,366 L 221,342 L 208,335 L 218,314 L 229,285 L 240,268 L 268,256 L 272,250 L 312,231 L 350,218 L 334,230 L 351,230 L 374,216 L 397,193 L 395,208 L 444,184 L 455,188 L 440,200 L 471,181 L 491,163 L 511,156 L 507,164 L 538,154 L 557,153 L 580,141 Z',
      inner: 'M 502,184 L 446,224 L 456,226 L 397,263 L 406,267 L 344,305 L 318,278 L 370,245 L 360,243 L 420,206 L 414,214 L 472,189 Z',
      wisps: 'M 605,132 L 630,118 L 616,137 Z M 436,278 L 462,264 L 448,283 Z M 211,306 L 224,286 L 222,305 Z'
    }
  ]
};

export const DEFAULT_TUNING = {
  bgBlack: '#080706',
  warmYellow: '#FFC00A',
  cream: '#FFF0BE',
  coreWhite: '#FFFFFF',
  introHoldDuration: 1.0,
  entryBurstDuration: 0.46,
  flameFps: 12,
  entryScrollThreshold: 0.12,
  approachStartThreshold: 0.20,
  letterEmergeStart: 0.24,
  letterEmergeEnd: 0.78,
  impactThreshold: 0.88,
  rearmThreshold: 0.65,
  impactFlashDuration: 0.075,
  hitStopDuration: 0.095,
  shockwaveDuration: 0.46,
  settleRecoilDuration: 0.28,
  impactShakeStrength: 1.55,
  driftRadiusX: 14,
  driftRadiusY: 10,
  skyReactivity: 2.4,
  maxPixelRatio: 2.0
};

export function createOpening(canvas, assets = {}, customTuning = {}) {
  if (!canvas) throw new Error('createOpening requires canvas.');
  const ctx = canvas.getContext('2d', { alpha: false });
  const tuning = { ...DEFAULT_TUNING, ...customTuning };
  const pathsData = assets.paths || JAMU_PATHS;

  const cachedLetterPaths = pathsData.letters.map(l => ({
    id: l.id,
    pivot: l.pivot,
    fillRule: l.fillRule || 'nonzero',
    path: new Path2D(l.d),
    strokes: (l.strokes || []).map(st => {
      const [[x1, y1], [x2, y2]] = st.points;
      return {
        x1, y1, x2, y2,
        length: Math.hypot(x2 - x1, y2 - y1),
        width: st.width || 80
      };
    })
  }));

  const cachedCorePath = new Path2D(pathsData.meteorCoreWhite);
  const cachedCrater1Path = new Path2D(pathsData.meteorCrater1);
  const cachedCrater2Path = new Path2D(pathsData.meteorCrater2);
  const cachedFlameCels = pathsData.flameCels.map(cel => ({
    outer: new Path2D(cel.outer),
    inner: cel.inner ? new Path2D(cel.inner) : null,
    wisps: cel.wisps ? new Path2D(cel.wisps) : null
  }));

  let halftonePattern = null;
  let grainPattern = null;

  function buildCachedPatterns() {
    try {
      const htCanvas = document.createElement('canvas');
      htCanvas.width = 16; htCanvas.height = 16;
      const htCtx = htCanvas.getContext('2d');
      htCtx.fillStyle = 'rgba(255, 192, 10, 0.13)';
      htCtx.beginPath();
      htCtx.arc(4, 4, 1.6, 0, Math.PI * 2);
      htCtx.arc(12, 12, 1.1, 0, Math.PI * 2);
      htCtx.fill();
      halftonePattern = ctx.createPattern(htCanvas, 'repeat');

      const grCanvas = document.createElement('canvas');
      grCanvas.width = 48; grCanvas.height = 48;
      const grCtx = grCanvas.getContext('2d');
      for (let i = 0; i < 42; i++) {
        const gx = (i * 19) % 48;
        const gy = (i * 31) % 48;
        grCtx.fillStyle = i % 2 === 0 ? 'rgba(255, 240, 190, 0.035)' : 'rgba(0, 0, 0, 0.12)';
        grCtx.fillRect(gx, gy, 2, 1);
      }
      grainPattern = ctx.createPattern(grCanvas, 'repeat');
    } catch (e) {}
  }
  buildCachedPatterns();

  const STAR_COUNT = 36;
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
    x: ((i * 73 + 19) % 100) / 100,
    y: ((i * 41 + 7) % 100) / 100,
    layer: (i % 3) + 1,
    size: 1.4 + (i % 3) * 1.1,
    phase: (i * 1.37) % (Math.PI * 2),
    speed: 1.6 + (i % 4) * 0.65
  }));

  const EMBER_COUNT = 34;
  const embers = Array.from({ length: EMBER_COUNT }, (_, i) => ({
    active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0.4 + (i % 4) * 0.15, size: 3 + (i % 4) * 2
  }));

  // Stepped anime ghost trail ring-buffer for sudden burst & final dive
  const TRAIL_COUNT = 7;
  const meteorHistory = Array.from({ length: TRAIL_COUNT }, () => ({ x: 1650, y: -1150, rot: -0.12, scale: 0.48, valid: false }));
  let historyTick = 0;

  // Graphic ink-cloud bands in the sky that whip past at high velocity
  const SKY_CLOUDS = [
    { x: 0.18, y: 0.22, w: 460, h: 54, layer: 1.2 },
    { x: 0.65, y: 0.16, w: 620, h: 68, layer: 1.8 },
    { x: 0.38, y: 0.48, w: 540, h: 60, layer: 2.4 },
    { x: 0.82, y: 0.62, w: 490, h: 52, layer: 1.5 },
    { x: 0.12, y: 0.78, w: 580, h: 64, layer: 2.8 }
  ];

  let viewWidth = canvas.clientWidth || 1280;
  let viewHeight = canvas.clientHeight || 720;
  let dpr = 1;

  let currentState = 'intro';
  let isSettled = false;
  let entryTriggered = false;
  let entryTimer = 0;
  let brakeSparkSpawned = false;
  let impactArmed = true;
  let impactActive = false;
  let impactCompleted = false;
  let impactTimer = 0;
  let lastElapsed = 0;
  let lastProgress = 0;
  let scrollSurge = 0;
  let skyTravelDistance = 0;
  let currentFlameFrame = 0;
  let prevMeteorPos = { x: 1650, y: -1150 };
  let meteorVelocity = { vx: 0, vy: 0, speed: 0 };
  let camState = { x: 0, y: 0, zoom: 1, rot: 0 };

  function resize(width, height, pixelRatio = 1) {
    viewWidth = Math.max(1, Math.floor(width));
    viewHeight = Math.max(1, Math.floor(height));
    dpr = Math.min(tuning.maxPixelRatio, Math.max(1, pixelRatio));
    canvas.width = Math.floor(viewWidth * dpr);
    canvas.height = Math.floor(viewHeight * dpr);
  }

  function reset() {
    currentState = 'intro';
    isSettled = false;
    entryTriggered = false;
    entryTimer = 0;
    brakeSparkSpawned = false;
    impactArmed = true;
    impactActive = false;
    impactCompleted = false;
    impactTimer = 0;
    lastElapsed = 0;
    lastProgress = 0;
    scrollSurge = 0;
    skyTravelDistance = 0;
    currentFlameFrame = 0;
    prevMeteorPos = { x: 1650, y: -1150 };
    camState = { x: 0, y: 0, zoom: 1, rot: 0 };
    for (let i = 0; i < EMBER_COUNT; i++) embers[i].active = false;
    for (let i = 0; i < TRAIL_COUNT; i++) meteorHistory[i].valid = false;
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  // Hyper-snappy anime whip-in -> hard brake curve
  function easeOutAnimeBrake(t) { const c = clamp(t, 0, 1); return 1 - Math.pow(1 - c, 8.5); }
  function easeInOutCubic(t) { const c = clamp(t, 0, 1); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; }
  // Stepped high-velocity whip curve on scroll so each scroll bursts forward dramatically
  function easeApproachSlam(t) {
    const c = clamp(t, 0, 1);
    return c < 0.55
      ? Math.pow(c / 0.55, 1.45) * 0.40
      : 0.40 + Math.pow((c - 0.55) / 0.45, 2.85) * 0.60;
  }
  function easeOutBack(t) {
    const c = clamp(t, 0, 1);
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(c - 1, 3) + c1 * Math.pow(c - 1, 2);
  }

  function spawnEmber(x, y, vx, vy) {
    for (let i = 0; i < EMBER_COUNT; i++) {
      const e = embers[i];
      if (!e.active) {
        e.active = true;
        e.x = x + (Math.random() - 0.5) * 28;
        e.y = y + (Math.random() - 0.5) * 28;
        e.vx = vx + (Math.random() - 0.5) * 90;
        e.vy = vy + (Math.random() - 0.5) * 90;
        e.life = 0;
        e.maxLife = 0.28 + Math.random() * 0.35;
        e.size = 3.5 + Math.random() * 5.5;
        break;
      }
    }
  }

  function render({ elapsed = 0, progress = 0, deltaTime = 1 / 60, reducedMotion = false }) {
    const dt = clamp(deltaTime, 0.001, 0.1);
    const normProgress = clamp(progress, 0, 1);
    const progressDelta = Math.abs(normProgress - lastProgress);
    const progressVel = progressDelta / dt;
    // Amplify scroll impulse so every wheel notch triggers a dramatic velocity surge
    scrollSurge = clamp(scrollSurge * Math.pow(0.015, dt) + progressDelta * 14.5, 0, 2.2);
    lastElapsed = elapsed;
    lastProgress = normProgress;

    const introEnd = tuning.introHoldDuration;
    const totalImpactDuration = tuning.impactFlashDuration + tuning.hitStopDuration + tuning.shockwaveDuration + tuning.settleRecoilDuration;

    // Re-arm entry if user scrolls all the way back to the top
    if (normProgress < 0.03 && !impactActive) {
      entryTriggered = false;
      entryTimer = 0;
      brakeSparkSpawned = false;
      for (let i = 0; i < TRAIL_COUNT; i++) meteorHistory[i].valid = false;
    }

    // Trigger the sudden top-right asteroid entry on the SECOND scroll
    if (elapsed >= introEnd && normProgress >= tuning.entryScrollThreshold && !entryTriggered) {
      entryTriggered = true;
      entryTimer = 0;
      brakeSparkSpawned = false;
      prevMeteorPos = { x: 1650, y: -1150 };
      scrollSurge = 1.85;
    }

    if (entryTriggered) {
      entryTimer += dt;
    }

    if (normProgress < tuning.rearmThreshold && !impactActive) {
      impactArmed = true;
      impactCompleted = false;
      isSettled = false;
    }

    if (entryTimer >= tuning.entryBurstDuration && normProgress >= tuning.impactThreshold && impactArmed && !impactActive && !impactCompleted) {
      impactActive = true;
      impactArmed = false;
      impactTimer = 0;
      for (let i = 0; i < 28; i++) {
        const ang = -Math.PI * 0.95 + (i / 28) * Math.PI * 1.25;
        const spd = 420 + (i % 5) * 195;
        spawnEmber(258, 358, Math.cos(ang) * spd, Math.sin(ang) * spd);
      }
    }

    if (impactActive) {
      impactTimer += dt;
      if (impactTimer >= totalImpactDuration) {
        impactActive = false;
        impactCompleted = true;
      }
    }

    if (impactActive) {
      currentState = 'impact';
      isSettled = false;
    } else if (impactCompleted && normProgress >= tuning.impactThreshold - 0.08) {
      currentState = 'settled';
      isSettled = true;
    } else if (!entryTriggered) {
      currentState = 'intro';
      isSettled = false;
    } else if (normProgress >= tuning.approachStartThreshold && entryTimer >= tuning.entryBurstDuration * 0.45) {
      currentState = 'approaching';
      isSettled = false;
    } else {
      currentState = 'drifting';
      isSettled = false;
    }

    // Keep flame cels lively at 12–16 fps even when settled (unless reducedMotion is enabled)
    if (reducedMotion) {
      currentFlameFrame = 0;
    } else {
      const dynamicFlameFps = tuning.flameFps + Math.floor(scrollSurge * 5);
      const rawCelIndex = Math.floor(elapsed * dynamicFlameFps);
      const celSequence = [0, 1, 3, 2, 4, 5, 1, 4, 2, 5];
      currentFlameFrame = celSequence[rawCelIndex % celSequence.length];
    }

    const minDim = Math.min(viewWidth, viewHeight);
    const isPortrait = viewHeight > viewWidth * 1.1;
    const logoBoxSize = isPortrait ? minDim * 0.92 : minDim * 0.86;
    const scale = logoBoxSize / 1000;
    const offsetX = (viewWidth - 1000 * scale) * 0.5;
    const offsetY = (viewHeight - 1000 * scale) * (isPortrait ? 0.48 : 0.5);

    // Asteroid starts way off-screen TOP RIGHT and whips across a huge distance on entry & scroll
    const startPos = { x: 1650, y: -1150, rot: 0, scale: 0.90 };
    const driftAnchor = { x: 420, y: -290, rot: 0, scale: 0.96 };
    const landPos = { x: 0, y: 0, rot: 0, scale: 1.0 };

    let meteorVisible = false;
    let mx = startPos.x, my = startPos.y, mRot = startPos.rot, mScale = startPos.scale;
    let mStretchX = 1.0, mSquashY = 1.0;
    let speedLineIntensity = 0;
    let entryFlashIntensity = 0;
    let brakeRingProgress = -1;

    const entryRaw = entryTriggered ? entryTimer / Math.max(0.1, tuning.entryBurstDuration) : 0;

    if (entryTriggered) {
      meteorVisible = true;
      const entryT = reducedMotion ? 1 : easeOutAnimeBrake(clamp(entryRaw, 0, 1));

      if (!reducedMotion && entryRaw > 0 && entryRaw < 1.1) {
        speedLineIntensity = Math.pow(1 - clamp(entryRaw / 0.9, 0, 1), 1.15);
        if (entryRaw < 0.36) {
          entryFlashIntensity = Math.pow(1 - (entryRaw / 0.36), 1.3);
        }
        if (entryRaw >= 0.26 && entryRaw < 0.72) {
          // Braking sonic air-brake ring without distorting the asteroid shape
          brakeRingProgress = (entryRaw - 0.26) / 0.46;
          if (!brakeSparkSpawned) {
            brakeSparkSpawned = true;
            for (let s = 0; s < 14; s++) {
              const ang = Math.PI * 0.55 + (s / 14) * Math.PI * 0.65;
              const spd = 280 + (s % 3) * 140;
              spawnEmber(278 + driftAnchor.x, 318 + driftAnchor.y, Math.cos(ang) * spd, Math.sin(ang) * spd);
            }
          }
        }
      }

      const approachSpan = Math.max(0.05, tuning.impactThreshold - tuning.approachStartThreshold);
      const approachRaw = clamp((normProgress - tuning.approachStartThreshold) / approachSpan, 0, 1);
      const approachT = easeApproachSlam(approachRaw);

      // Drive intense speed lines on scroll without warping/shearing the asteroid geometry
      if (!reducedMotion && !impactActive && !isSettled) {
        const surgeFactor = clamp(scrollSurge * 0.65 + (approachRaw > 0.6 ? (approachRaw - 0.6) / 0.4 : 0), 0, 1.5);
        speedLineIntensity = Math.max(speedLineIntensity, clamp(surgeFactor * 0.95, 0, 1));
      }

      const driftAmp = reducedMotion ? 0 : 1 - approachT;
      // Add strong anime braking recoil right as entry finishes
      const brakeOvershoot = (!reducedMotion && entryRaw > 0.22 && entryRaw < 1.0)
        ? Math.sin((entryRaw - 0.22) * Math.PI * 2.8) * Math.pow(1 - clamp((entryRaw - 0.22) / 0.78, 0, 1), 2) * 24
        : 0;

      const idleX = Math.sin(elapsed * 1.8) * tuning.driftRadiusX * driftAmp + Math.cos(elapsed * 3.4) * 4.0 * driftAmp - brakeOvershoot * 0.85;
      const idleY = Math.cos(elapsed * 1.5) * tuning.driftRadiusY * driftAmp + Math.sin(elapsed * 2.9) * 3.5 * driftAmp + brakeOvershoot * 0.6;
      const idleRot = Math.sin(elapsed * 1.6) * 0.015 * driftAmp;

      // Add forward whip lunge whenever user scrolls
      const scrollLunge = (!reducedMotion && !impactActive && !isSettled) ? Math.sin(clamp(scrollSurge, 0, 1.4) * Math.PI * 0.5) * 28 * (1 - approachT) : 0;

      const postEntryX = lerp(startPos.x, driftAnchor.x, entryT) + idleX - scrollLunge * 0.82;
      const postEntryY = lerp(startPos.y, driftAnchor.y, entryT) + idleY + scrollLunge * 0.56;
      const postEntryRot = idleRot;
      const postEntryScale = lerp(startPos.scale, driftAnchor.scale, entryT);

      mx = lerp(postEntryX, landPos.x, approachT);
      my = lerp(postEntryY, landPos.y, approachT);
      mRot = lerp(postEntryRot, landPos.rot, approachT);
      mScale = lerp(postEntryScale, landPos.scale, approachT);

      if (impactActive || isSettled) {
        mx = 0; my = 0; mRot = 0; mScale = 1.0;
        mStretchX = 1.0; mSquashY = 1.0;
        if (impactActive && !reducedMotion) {
          const tHitEnd = tuning.impactFlashDuration + tuning.hitStopDuration;
          const tShockEnd = tHitEnd + tuning.shockwaveDuration;
          if (impactTimer < tHitEnd) {
            // Crisp hit-stop vibration on the crown of 'J' without distorting the meteor proportions
            mx = -4 + (Math.sin(impactTimer * 380) * 4.0);
            my = 5 + (Math.cos(impactTimer * 420) * 4.0);
          } else if (impactTimer < tShockEnd) {
            const shP = (impactTimer - tHitEnd) / tuning.shockwaveDuration;
            const reb = Math.sin(shP * Math.PI) * Math.pow(1 - shP, 1.5);
            mx = reb * 18;
            my = -reb * 13;
            mRot = -reb * 0.035;
          } else if (impactTimer >= tShockEnd) {
            const recoilT = clamp((impactTimer - tShockEnd) / tuning.settleRecoilDuration, 0, 1);
            const recoilWave = Math.sin(recoilT * Math.PI) * (1 - recoilT);
            mx = recoilWave * 9; my = -recoilWave * 6; mRot = -recoilWave * 0.015;
          }
        }
      }

      // Record ghost trail every frame so high-speed movement leaves a dense anime afterimage fan
      historyTick++;
      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        meteorHistory[i] = { ...meteorHistory[i - 1] };
      }
      meteorHistory[0] = { x: mx, y: my, rot: mRot, scale: mScale, valid: true };
    }

    const rawVx = (mx - prevMeteorPos.x) / dt;
    const rawVy = (my - prevMeteorPos.y) / dt;
    const rawSpeed = Math.hypot(rawVx, rawVy);
    meteorVelocity.vx = Number.isFinite(rawVx) ? clamp(rawVx, -9000, 9000) : 0;
    meteorVelocity.vy = Number.isFinite(rawVy) ? clamp(rawVy, -9000, 9000) : 0;
    meteorVelocity.speed = Number.isFinite(rawSpeed) ? clamp(rawSpeed, 0, 9000) : 0;
    prevMeteorPos.x = mx; prevMeteorPos.y = my;

    // Accumulate sky travel distance from ambient drift + meteor velocity + scroll surges
    const activeSkySpeed = (!isSettled && meteorVisible)
      ? (85 + meteorVelocity.speed * 0.65 + scrollSurge * 950)
      : (entryTriggered ? 25 : 40 + normProgress * 320);
    skyTravelDistance += activeSkySpeed * dt;

    if (meteorVisible && !isSettled && !reducedMotion && Math.random() < (0.35 + clamp(meteorVelocity.speed / 900, 0, 0.45))) {
      spawnEmber(540 + mx, 175 + my, 120 + Math.random() * 140 + meteorVelocity.speed * 0.15, -85 - Math.random() * 90 - meteorVelocity.speed * 0.1);
    }

    // --- DYNAMIC ANIME ACTION CAMERA ---
    // Camera directly follows the asteroid from top-right all the way into the middle of the frame
    let targetCamX = 0;
    let targetCamY = 0;
    let targetCamZoom = 1.0;
    let targetCamRot = 0;

    if (!reducedMotion) {
      if (!entryTriggered) {
        // During 1st scroll anticipation, camera pans up-right toward the incoming asteroid
        const antP = clamp(normProgress / Math.max(0.02, tuning.entryScrollThreshold), 0, 1);
        targetCamX = -antP * 240 * scale;
        targetCamY = antP * 165 * scale;
        targetCamZoom = 1.0 + antP * 0.14;
        targetCamRot = -antP * 0.028;
      } else if (!impactActive && !isSettled) {
        const approachSpan = Math.max(0.05, tuning.impactThreshold - tuning.approachStartThreshold);
        const approachRaw = clamp((normProgress - tuning.approachStartThreshold) / approachSpan, 0, 1);
        // Smoothly transition camera from locked onto the asteroid to centered on the JAMU middle as approach reaches 1
        const centerBlend = easeInOutCubic(clamp(approachRaw / 0.88, 0, 1));
        const followWeight = 1 - centerBlend;

        // Lock camera tracking onto the asteroid's coordinates (clamped during initial off-screen burst so it whips in cleanly)
        const trackX = clamp(mx, -150, 560);
        const trackY = clamp(my, -400, 150);
        targetCamX = -trackX * 0.78 * scale * followWeight;
        targetCamY = -trackY * 0.78 * scale * followWeight;

        // Dynamic zoom follows the asteroid closely and settles to 1.0 as camera reaches the middle
        const surgeZoom = clamp(scrollSurge * 0.08, 0, 0.12) * followWeight;
        targetCamZoom = 1.0 + (0.22 * followWeight) + surgeZoom;

        // Subtle banking tilt while following the meteor
        targetCamRot = (-0.032 * followWeight) - clamp(scrollSurge * 0.025, 0, 0.04) * followWeight;
      } else {
        // Lock 100% cleanly to 1:1 middle origin when camera reaches center / impact / settled
        targetCamX = 0;
        targetCamY = 0;
        targetCamZoom = 1.0;
        targetCamRot = 0;
      }
    }

    const camLerp = isSettled ? Math.min(1, dt * 15) : Math.min(1, dt * 12);
    camState.x = lerp(camState.x, targetCamX, camLerp);
    camState.y = lerp(camState.y, targetCamY, camLerp);
    camState.zoom = lerp(camState.zoom, targetCamZoom, camLerp);
    camState.rot = lerp(camState.rot, targetCamRot, camLerp);

    let shakeX = 0, shakeY = 0;
    let cameraZoomPunch = camState.zoom;
    let cameraTilt = camState.rot;
    let isImpactFlashFrame = false;
    let impactFlashPhase = 0;
    let shockwaveT = -1;

    // Whip zoom punch during sudden entry burst
    if (entryTriggered && entryRaw > 0 && entryRaw < 0.45 && !reducedMotion) {
      cameraZoomPunch += Math.sin((entryRaw / 0.45) * Math.PI) * 0.14;
      shakeX += (Math.random() - 0.5) * 18 * (1 - entryRaw / 0.45);
      shakeY += (Math.random() - 0.5) * 18 * (1 - entryRaw / 0.45);
    }

    // Subtle high-speed air-turbulence camera vibration when scrolling fast
    if (!reducedMotion && !impactActive && !isSettled && scrollSurge > 0.25) {
      const turb = clamp((scrollSurge - 0.25) * 9, 0, 14);
      shakeX += Math.sin(elapsed * 190) * turb;
      shakeY += Math.cos(elapsed * 210) * turb;
    }

    if (impactActive) {
      const tFlash = tuning.impactFlashDuration;
      const tHitStop = tFlash + tuning.hitStopDuration;
      const tShock = tHitStop + tuning.shockwaveDuration;

      if (impactTimer < tFlash && !reducedMotion) {
        isImpactFlashFrame = true;
        impactFlashPhase = impactTimer < tFlash * 0.5 ? 1 : 2;
        cameraZoomPunch = 1.18;
        cameraTilt = -0.038;
        camState.x *= 0.25;
        camState.y *= 0.25;
      } else if (impactTimer < tHitStop) {
        if (!reducedMotion) {
          cameraZoomPunch = 1.13;
          cameraTilt = 0.026;
          shakeX = (Math.random() - 0.5) * 38 * tuning.impactShakeStrength;
          shakeY = (Math.random() - 0.5) * 38 * tuning.impactShakeStrength;
        }
      } else if (impactTimer >= tHitStop && impactTimer < tShock) {
        shockwaveT = (impactTimer - tHitStop) / tuning.shockwaveDuration;
        if (!reducedMotion) {
          const decay = Math.pow(1 - shockwaveT, 1.75) * tuning.impactShakeStrength;
          // Violent directional slam downwards-left + high-frequency ring decay
          const dirKick = Math.pow(1 - shockwaveT, 3.0) * 44 * tuning.impactShakeStrength;
          shakeX = -dirKick * 0.78 + Math.sin(impactTimer * 260) * 32 * decay;
          shakeY = dirKick * 1.05 + Math.cos(impactTimer * 215) * 28 * decay;
          cameraZoomPunch = 1 + Math.sin((1 - shockwaveT) * Math.PI * 0.5) * 0.095 * decay;
          cameraTilt = Math.sin(shockwaveT * Math.PI * 3.5) * 0.024 * decay;
        }
      }
    }

    // Reset canvas transform every frame so state can never accumulate
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    ctx.save();
    ctx.scale(dpr, dpr);

    // Always paint deep night black base first
    ctx.fillStyle = tuning.bgBlack;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    if (isImpactFlashFrame) {
      // High-contrast dark impact frame with a localized radial burst instead of flooding the screen yellow
      const burstX = offsetX + 256 * scale;
      const burstY = offsetY + 368 * scale;
      const burstGrad = ctx.createRadialGradient(burstX, burstY, 10 * scale, burstX, burstY, Math.max(viewWidth, viewHeight) * 0.55);
      burstGrad.addColorStop(0, impactFlashPhase === 1 ? 'rgba(255, 240, 190, 0.42)' : 'rgba(255, 192, 10, 0.32)');
      burstGrad.addColorStop(0.45, 'rgba(255, 192, 10, 0.08)');
      burstGrad.addColorStop(1, 'rgba(8, 7, 6, 0)');
      ctx.fillStyle = burstGrad;
      ctx.fillRect(0, 0, viewWidth, viewHeight);
    }

    // Apply Dynamic Anime Chase Camera (Pan, Zoom, Dutch Tilt & Impact Shake)
    const finalCamX = (impactActive || isSettled) ? camState.x * 0.15 : camState.x;
    const finalCamY = (impactActive || isSettled) ? camState.y * 0.15 : camState.y;
    ctx.translate(viewWidth * 0.5 + finalCamX + shakeX * scale, viewHeight * 0.5 + finalCamY + shakeY * scale);
    ctx.rotate(cameraTilt);
    ctx.scale(cameraZoomPunch, cameraZoomPunch);
    ctx.translate(-viewWidth * 0.5, -viewHeight * 0.5);

    if (!isImpactFlashFrame) {
      // Pre-Entry Anticipation Glint in the top-right sky when user is on their 1st scroll (0.03 -> 0.12)
      if (!entryTriggered && normProgress > 0.02) {
        const antP = clamp((normProgress - 0.02) / Math.max(0.02, tuning.entryScrollThreshold - 0.02), 0, 1);
        const gx = viewWidth * 0.80;
        const gy = viewHeight * 0.18;
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(-0.56);
        const glintLen = (35 + antP * 220) * scale;
        const glintThick = (2.5 + antP * 8.0) * scale;
        ctx.fillStyle = tuning.warmYellow;
        ctx.beginPath();
        ctx.moveTo(-glintLen, 0); ctx.lineTo(0, -glintThick); ctx.lineTo(glintLen, 0); ctx.lineTo(0, glintThick);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = tuning.coreWhite;
        ctx.beginPath();
        ctx.arc(0, 0, (4 + antP * 9) * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Contained diagonal anime slash beam across upper-right sky during sudden entry
      if (entryFlashIntensity > 0.01) {
        const ef = clamp(entryFlashIntensity, 0, 1);
        ctx.save();
        ctx.translate(viewWidth * 0.68, viewHeight * 0.24);
        ctx.rotate(-0.56);
        const beamH = Math.min(84, (20 + ef * 68) * scale);
        ctx.fillStyle = `rgba(255, 192, 10, ${(ef * 0.36).toFixed(3)})`;
        ctx.fillRect(-viewWidth * 1.5, -beamH, viewWidth * 3, beamH * 2);
        ctx.fillStyle = `rgba(255, 240, 190, ${(ef * 0.75).toFixed(3)})`;
        ctx.fillRect(-viewWidth * 1.5, -beamH * 0.32, viewWidth * 3, beamH * 0.64);
        ctx.restore();
      }

      const headScreenX = offsetX + (278 + mx) * scale;
      const headScreenY = offsetY + (318 + my) * scale;

      // Sky rushes toward top-right as the meteor tears down-left
      const dirX = 0.847; // cos(-0.56)
      const dirY = -0.531; // sin(-0.56)
      const skyShiftX = (meteorVisible ? (mx - driftAnchor.x) * -0.45 * tuning.skyReactivity : 0) + skyTravelDistance * dirX;
      const skyShiftY = (meteorVisible ? (my - driftAnchor.y) * -0.45 * tuning.skyReactivity : 0) + skyTravelDistance * dirY;

      // Rush speed determines how much stars & clouds stretch into anime warp-streaks
      const skyWarpStreak = (!isSettled && !reducedMotion)
        ? clamp((meteorVelocity.speed / 1100) + scrollSurge * 1.35 + (entryRaw > 0 && entryRaw < 0.45 ? 1.8 : 0), 0, 2.6)
        : 0;

      const rawHaze = meteorVisible
        ? 0.09 + (normProgress * 0.05) + entryFlashIntensity * 0.09 + clamp(meteorVelocity.speed / 6000, 0, 0.05)
        : 0.035;
      const hazeStrength = Number.isFinite(rawHaze) ? clamp(rawHaze, 0.02, 0.20) : 0.05;
      const hazeRadius = Math.max(100, Math.max(viewWidth, viewHeight) * 0.48);
      const gx = Number.isFinite(headScreenX) && meteorVisible ? headScreenX : viewWidth * 0.72;
      const gy = Number.isFinite(headScreenY) && meteorVisible ? headScreenY : viewHeight * 0.22;

      const hazeGrad = ctx.createRadialGradient(gx, gy, 8, gx, gy, hazeRadius);
      hazeGrad.addColorStop(0, `rgba(255, 192, 10, ${hazeStrength.toFixed(3)})`);
      hazeGrad.addColorStop(0.45, `rgba(255, 192, 10, ${(hazeStrength * 0.28).toFixed(3)})`);
      hazeGrad.addColorStop(1, 'rgba(8, 7, 6, 0)');
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, 0, viewWidth, viewHeight);

      // Graphic ink-cloud bands rushing diagonally across the sky
      for (let c = 0; c < SKY_CLOUDS.length; c++) {
        const cl = SKY_CLOUDS[c];
        const spanW = viewWidth * 1.6;
        const spanH = viewHeight * 1.6;
        const cx = ((cl.x * spanW + skyShiftX * 0.45 * cl.layer) % spanW + spanW) % spanW - viewWidth * 0.3;
        const cy = ((cl.y * spanH + skyShiftY * 0.45 * cl.layer) % spanH + spanH) % spanH - viewHeight * 0.3;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.56);
        const stretchW = cl.w * (1 + skyWarpStreak * 0.85) * scale;
        const stretchH = cl.h * Math.max(0.45, 1 - skyWarpStreak * 0.2) * scale;
        ctx.fillStyle = c % 2 === 0 ? 'rgba(22, 19, 14, 0.65)' : 'rgba(255, 192, 10, 0.045)';
        ctx.beginPath();
        ctx.ellipse(0, 0, stretchW, stretchH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (halftonePattern && meteorVisible) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(gx, gy, hazeRadius * 0.55, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = halftonePattern;
        ctx.fillRect(0, 0, viewWidth, viewHeight);
        ctx.restore();
      }

      // Glittering stars that stretch into razor-sharp diagonal warp lines when the meteor surges
      for (let i = 0; i < STAR_COUNT; i++) {
        const s = stars[i];
        const wave = Math.sin(elapsed * s.speed + s.phase);
        const thresh = (entryTriggered || skyWarpStreak > 0.2) ? -0.2 : 0.38;
        if (wave > thresh) {
          const alpha = clamp((wave - thresh) / (1 - thresh), 0.25, 1) * (s.layer === 3 ? 0.95 : 0.65);
          const px = ((s.x * viewWidth + skyShiftX * s.layer * 0.38) % viewWidth + viewWidth) % viewWidth;
          const py = ((s.y * viewHeight + skyShiftY * s.layer * 0.38) % viewHeight + viewHeight) % viewHeight;
          const r = s.size * (0.75 + alpha * 0.55);

          ctx.save();
          ctx.translate(px, py);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = s.layer === 3 ? tuning.warmYellow : tuning.cream;

          if (skyWarpStreak > 0.18) {
            // Diagonal anime warp-streak star
            ctx.rotate(-0.56);
            const streakLen = r * (2.5 + skyWarpStreak * 18 * (s.layer * 0.55));
            const streakThick = Math.max(1.2, r * 0.65);
            ctx.beginPath();
            ctx.moveTo(-streakLen, 0);
            ctx.lineTo(0, -streakThick);
            ctx.lineTo(streakLen * 0.35, 0);
            ctx.lineTo(0, streakThick);
            ctx.closePath();
            ctx.fill();
          } else {
            // Crisp 4-point diamond star when sky is quiet
            ctx.beginPath();
            ctx.moveTo(0, -r * 1.8);
            ctx.lineTo(r * 0.42, -r * 0.42);
            ctx.lineTo(r * 1.8, 0);
            ctx.lineTo(r * 0.42, r * 0.42);
            ctx.lineTo(0, r * 1.8);
            ctx.lineTo(-r * 0.42, r * 0.42);
            ctx.lineTo(-r * 1.8, 0);
            ctx.lineTo(-r * 0.42, -r * 0.42);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // Full-screen anime action speed-lines on screen edges during intense scroll or entry bursts
      if (skyWarpStreak > 0.45 && !reducedMotion) {
        const edgeAlpha = clamp((skyWarpStreak - 0.45) * 0.55, 0, 0.75);
        ctx.save();
        ctx.translate(viewWidth * 0.5, viewHeight * 0.5);
        ctx.rotate(-0.56);
        ctx.globalAlpha = edgeAlpha;
        for (let k = -6; k <= 6; k++) {
          if (Math.abs(k) < 2) continue; // Keep center clear for meteor & logo
          const yOff = k * (viewHeight * 0.11) + Math.sin(elapsed * 45 + k) * 18;
          const xSlide = ((elapsed * 2600 + Math.abs(k) * 310) % (viewWidth * 1.6)) - viewWidth * 0.8;
          const lLen = 240 + (Math.abs(k) % 3) * 180;
          const lThick = (Math.abs(k) % 2 === 0) ? 3.5 : 2.0;
          ctx.fillStyle = (Math.abs(k) % 2 === 0) ? tuning.warmYellow : tuning.cream;
          ctx.beginPath();
          ctx.moveTo(xSlide - lLen, yOff);
          ctx.lineTo(xSlide, yOff - lThick);
          ctx.lineTo(xSlide + lLen, yOff);
          ctx.lineTo(xSlide, yOff + lThick);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // Enter 1000x1000 JAMU Logo Coordinate Space
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    const emergeStart = tuning.letterEmergeStart;
    const emergeSpan = Math.max(0.05, tuning.letterEmergeEnd - emergeStart);
    const letterImpactWeights = [
      { delay: 0.00, ampX: -18, ampY: 34, rot: -0.095, squash: 0.16 }, // J takes direct crown impact
      { delay: 0.03, ampX: 8,   ampY: 24, rot: 0.065,  squash: 0.11 }, // A
      { delay: 0.06, ampX: 14,  ampY: 16, rot: 0.045,  squash: 0.08 }, // M
      { delay: 0.09, ampX: 18,  ampY: 11, rot: 0.032,  squash: 0.05 }  // U
    ];

    for (let i = 0; i < cachedLetterPaths.length; i++) {
      const item = cachedLetterPaths[i];
      const w = letterImpactWeights[i];
      const staggerOffset = i * 0.055;
      // Letters emerge during approach and are 100% formed in the middle by the time the camera reaches the center (0.78)
      let emergeT = clamp((normProgress - (emergeStart + staggerOffset)) / (emergeSpan - staggerOffset * 0.5), 0, 1);
      if (impactActive || isSettled || normProgress >= tuning.letterEmergeEnd) emergeT = 1;

      if (emergeT > 0.001) {
        const riseEase = easeOutBack(clamp(emergeT / 0.88, 0, 1));
        const riseAlpha = clamp(emergeT * 2.2, 0, 1);
        let lx = 0;
        // Letters rise up from the bottom (+260px in logo space) into their exact middle position (0)
        let ly = (1 - riseEase) * 260;
        let lRot = (1 - clamp(emergeT / 0.85, 0, 1)) * (i % 2 === 0 ? -0.06 : 0.06);
        let lScaleX = 1;
        let lScaleY = 1;

        if (impactActive && !reducedMotion) {
          const tHitEnd = tuning.impactFlashDuration + tuning.hitStopDuration;
          const localImpactT = impactTimer - tHitEnd - w.delay;
          if (impactTimer < tHitEnd && i === 0) {
            // Direct hit-stop compression on 'J' while asteroid lands on its crown
            ly += 16;
            lx -= 6;
            lScaleX = 1.08;
            lScaleY = 0.92;
          } else if (localImpactT > 0 && localImpactT < tuning.shockwaveDuration) {
            const p = localImpactT / tuning.shockwaveDuration;
            const impulse = Math.sin(p * Math.PI) * Math.pow(1 - p, 1.15) * tuning.impactShakeStrength;
            lx += w.ampX * 1.2 * impulse;
            ly += w.ampY * 1.2 * impulse;
            lRot += w.rot * 1.1 * impulse;
            lScaleX = 1 + w.squash * 0.85 * impulse;
            lScaleY = 1 - w.squash * 0.85 * impulse;
          } else if (impactTimer >= tHitEnd + tuning.shockwaveDuration) {
            const recT = clamp((impactTimer - (tHitEnd + tuning.shockwaveDuration)) / tuning.settleRecoilDuration, 0, 1);
            const recWave = Math.sin(recT * Math.PI) * (1 - recT) * 0.45;
            ly -= recWave * w.ampY * 0.55;
          }
        }

        ctx.save();
        ctx.globalAlpha = riseAlpha;
        ctx.translate(item.pivot.x + lx, item.pivot.y + ly);
        ctx.rotate(lRot);
        ctx.scale(lScaleX, lScaleY);
        ctx.translate(-item.pivot.x, -item.pivot.y);

        // Impact shockwave graphic echo behind completed letter
        if (!isSettled && !isImpactFlashFrame && shockwaveT > 0) {
          ctx.save();
          const offsetEcho = (1 - shockwaveT) * 24;
          ctx.translate(-offsetEcho, offsetEcho * 1.15);
          ctx.fillStyle = 'rgba(255, 192, 10, 0.72)';
          ctx.fill(item.path, item.fillRule);
          ctx.restore();
        }

        if (emergeT >= 0.995 || reducedMotion) {
          // Fully revealed exact SVG letter silhouette
          ctx.fillStyle = isImpactFlashFrame ? tuning.coreWhite : tuning.cream;
          ctx.fill(item.path, item.fillRule);
        } else {
          // Faint graphic ghost wireframe so you feel the letter carving into space
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 192, 10, 0.22)';
          ctx.lineWidth = 2.5;
          ctx.stroke(item.path);
          ctx.restore();

          // Sequential stroke-by-stroke reveal clipped strictly inside the exact letter silhouette
          const activeSparkTips = [];
          ctx.save();
          ctx.clip(item.path, item.fillRule);
          ctx.lineCap = 'butt';
          ctx.lineJoin = 'miter';

          const strokes = item.strokes;
          const numStrokes = strokes.length;

          for (let s = 0; s < numStrokes; s++) {
            const st = strokes[s];
            const strokeStart = (s / numStrokes) * 0.74;
            const strokeDuration = (1 / numStrokes) * 1.26;
            const rawStrokeT = clamp((emergeT - strokeStart) / strokeDuration, 0, 1);

            if (rawStrokeT > 0.001) {
              const easedStrokeT = easeInOutCubic(rawStrokeT);
              const curX = lerp(st.x1, st.x2, easedStrokeT);
              const curY = lerp(st.y1, st.y2, easedStrokeT);

              // Leading warm-yellow + white hot brush tip accent while the stroke is actively drawing
              if (easedStrokeT < 0.98) {
                const tipX = lerp(st.x1, st.x2, Math.min(1, easedStrokeT + 0.16));
                const tipY = lerp(st.y1, st.y2, Math.min(1, easedStrokeT + 0.16));
                ctx.strokeStyle = tuning.warmYellow;
                ctx.lineWidth = st.width * 1.12;
                ctx.beginPath();
                ctx.moveTo(st.x1, st.y1);
                ctx.lineTo(tipX, tipY);
                ctx.stroke();

                activeSparkTips.push({ x: curX, y: curY });
              }

              // Main cream letter stroke fill
              ctx.strokeStyle = isImpactFlashFrame ? tuning.coreWhite : tuning.cream;
              ctx.lineWidth = st.width;
              ctx.beginPath();
              ctx.moveTo(st.x1, st.y1);
              ctx.lineTo(curX, curY);
              ctx.stroke();
            }
          }
          ctx.restore();

          // Draw unclipped anime brush-spark flares at each active stroke tip so you feel the carving energy
          for (let k = 0; k < activeSparkTips.length; k++) {
            const tip = activeSparkTips[k];
            ctx.save();
            ctx.translate(tip.x, tip.y);
            ctx.rotate(elapsed * 9 + k);
            const sr = 22;
            ctx.fillStyle = tuning.warmYellow;
            ctx.beginPath();
            ctx.moveTo(-sr, 0); ctx.lineTo(-4, -4); ctx.lineTo(0, -sr); ctx.lineTo(4, -4);
            ctx.lineTo(sr, 0); ctx.lineTo(4, 4); ctx.lineTo(0, sr); ctx.lineTo(-4, 4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = tuning.coreWhite;
            ctx.beginPath();
            ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.restore();
      }
    }

    // Anime Braking Sonic-Ring when the asteroid decelerates hard from its top-right burst
    if (brakeRingProgress > 0 && brakeRingProgress < 1 && !isImpactFlashFrame && !reducedMotion) {
      const bp = easeOutAnimeBrake(brakeRingProgress);
      const bAlpha = Math.pow(1 - brakeRingProgress, 1.5);
      const pivotX = pathsData.meteorHeadPivot.x + mx;
      const pivotY = pathsData.meteorHeadPivot.y + my;
      ctx.save();
      ctx.translate(pivotX - 18, pivotY + 14);
      ctx.rotate(-0.56);
      ctx.scale(0.42, 1.18);
      ctx.strokeStyle = `rgba(255, 240, 190, ${(bAlpha * 0.85).toFixed(3)})`;
      ctx.lineWidth = Math.max(2, (1 - bp) * 14);
      ctx.beginPath();
      ctx.arc(0, 0, 45 + bp * 155, -Math.PI * 0.78, Math.PI * 0.78);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 192, 10, ${(bAlpha * 0.65).toFixed(3)})`;
      ctx.lineWidth = Math.max(1.5, (1 - bp) * 8);
      ctx.beginPath();
      ctx.arc(18, 0, 30 + bp * 115, -Math.PI * 0.65, Math.PI * 0.65);
      ctx.stroke();
      ctx.restore();
    }

    if (speedLineIntensity > 0.01 && !isImpactFlashFrame) {
      ctx.save();
      ctx.globalAlpha = clamp(speedLineIntensity * 1.15, 0, 1);
      const pivotX = pathsData.meteorHeadPivot.x + mx;
      const pivotY = pathsData.meteorHeadPivot.y + my;
      ctx.translate(pivotX, pivotY);
      // Aligned with TOP-RIGHT to BOTTOM-LEFT trajectory (-0.56 rad points back toward top-right)
      ctx.rotate(-0.56);

      const slashLines = [
        { y: -115, len: 760, thick: 6,  color: tuning.cream },
        { y: -62,  len: 960, thick: 12, color: tuning.warmYellow },
        { y: -12,  len: 1120, thick: 7, color: tuning.coreWhite },
        { y: 34,   len: 860, thick: 10, color: tuning.warmYellow },
        { y: 82,   len: 680, thick: 5,  color: tuning.cream },
        { y: 125,  len: 520, thick: 4,  color: tuning.warmYellow }
      ];

      for (let i = 0; i < slashLines.length; i++) {
        const sl = slashLines[i];
        const slide = (1 - speedLineIntensity) * 180 + (i * 28);
        ctx.fillStyle = sl.color;
        ctx.beginPath();
        ctx.moveTo(45 + slide, sl.y - sl.thick * 0.5);
        ctx.lineTo(45 + slide + sl.len * speedLineIntensity, sl.y);
        ctx.lineTo(45 + slide, sl.y + sl.thick * 0.5);
        ctx.closePath();
        ctx.fill();
      }

      // Flashy anime 4-point entry star flare at the asteroid head during top-right burst
      if (entryFlashIntensity > 0.02) {
        ctx.save();
        ctx.rotate(0.56);
        const flareR = 260 * entryFlashIntensity;
        ctx.fillStyle = tuning.coreWhite;
        ctx.beginPath();
        ctx.moveTo(-flareR, 0); ctx.lineTo(-flareR * 0.12, -flareR * 0.12);
        ctx.lineTo(0, -flareR * 0.85); ctx.lineTo(flareR * 0.12, -flareR * 0.12);
        ctx.lineTo(flareR, 0); ctx.lineTo(flareR * 0.12, flareR * 0.12);
        ctx.lineTo(0, flareR * 0.85); ctx.lineTo(-flareR * 0.12, flareR * 0.12);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    // Impact centered directly over the 'J' crown where the asteroid places itself
    const impactCenter = { x: 256, y: 368 };
    if (isImpactFlashFrame) {
      ctx.save();
      ctx.translate(impactCenter.x, impactCenter.y);
      ctx.fillStyle = impactFlashPhase === 1 ? tuning.warmYellow : tuning.cream;
      // Dense 24-ray Sakuga impact spikes tearing outward over the dark sky
      for (let i = 0; i < 24; i++) {
        const ang = (i / 24) * Math.PI * 2 + (impactFlashPhase * 0.14);
        const innerR = 32 + (i % 3) * 28;
        const outerR = 680 + (i % 4) * 320;
        const spread = i % 2 === 0 ? 0.045 : 0.022;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * innerR, Math.sin(ang) * innerR);
        ctx.lineTo(Math.cos(ang - spread) * outerR, Math.sin(ang - spread) * outerR);
        ctx.lineTo(Math.cos(ang + spread) * outerR, Math.sin(ang + spread) * outerR);
        ctx.closePath();
        ctx.fill();
      }
      // Core white impact cross-slash
      ctx.fillStyle = tuning.coreWhite;
      ctx.rotate(-0.45);
      ctx.fillRect(-520, -9, 1040, 18);
      ctx.fillRect(-9, -360, 18, 720);
      ctx.restore();
    }

    if (shockwaveT >= 0 && shockwaveT <= 1 && !reducedMotion) {
      ctx.save();
      ctx.translate(impactCenter.x, impactCenter.y);
      const easeWave = 1 - Math.pow(1 - shockwaveT, 3.1);
      const radius = 45 + easeWave * 440;
      const alpha = Math.pow(1 - shockwaveT, 1.25);

      // Horizontal anime ground-slam shear wave across the top of the JAMU letters
      ctx.save();
      ctx.rotate(-0.12);
      const slashW = 80 + easeWave * 640;
      const slashH = Math.max(2, (1 - shockwaveT) * 26);
      ctx.fillStyle = `rgba(255, 240, 190, ${(alpha * 0.95).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(-slashW, 0);
      ctx.lineTo(0, -slashH);
      ctx.lineTo(slashW, 0);
      ctx.lineTo(0, slashH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Outer broken graphic shockwave ring
      const segments = 10;
      for (let s = 0; s < segments; s++) {
        const startAng = (s / segments) * Math.PI * 2 + 0.2;
        const endAng = startAng + (Math.PI * 2 / segments) * 0.68;
        const segR = radius + (s % 2 === 0 ? 18 : -12);
        const thick = Math.max(3, (1 - shockwaveT) * (s % 2 === 0 ? 26 : 15));

        ctx.fillStyle = s % 2 === 0 ? `rgba(255, 192, 10, ${alpha})` : `rgba(255, 240, 190, ${alpha * 0.95})`;
        ctx.beginPath();
        ctx.moveTo(Math.cos(startAng) * segR, Math.sin(startAng) * segR);
        ctx.lineTo(Math.cos((startAng + endAng) * 0.5) * (segR + thick * 0.85), Math.sin((startAng + endAng) * 0.5) * (segR + thick * 0.85));
        ctx.lineTo(Math.cos(endAng) * segR, Math.sin(endAng) * segR);
        ctx.lineTo(Math.cos((startAng + endAng) * 0.5) * (segR - thick * 0.65), Math.sin((startAng + endAng) * 0.5) * (segR - thick * 0.65));
        ctx.closePath();
        ctx.fill();
      }

      // High-velocity radial debris spikes shooting outward from the 'J' crown
      for (let d = 0; d < 8; d++) {
        const dAng = -Math.PI * 0.85 + (d / 7) * Math.PI * 1.15;
        const dStart = 40 + easeWave * 190;
        const dLen = (1 - shockwaveT) * (95 + (d % 3) * 45);
        ctx.strokeStyle = d % 2 === 0 ? `rgba(255, 240, 190, ${alpha})` : `rgba(255, 192, 10, ${alpha})`;
        ctx.lineWidth = Math.max(2, (1 - shockwaveT) * 7);
        ctx.beginPath();
        ctx.moveTo(Math.cos(dAng) * dStart, Math.sin(dAng) * dStart);
        ctx.lineTo(Math.cos(dAng) * (dStart + dLen), Math.sin(dAng) * (dStart + dLen));
        ctx.stroke();
      }
      ctx.restore();
    }

    if (shockwaveT >= 0 && shockwaveT <= 1 && !reducedMotion) {
      ctx.save();
      ctx.translate(impactCenter.x, impactCenter.y);
      const easeWave = 1 - Math.pow(1 - shockwaveT, 2.6);
      const radius = 55 + easeWave * 330;
      const alpha = Math.pow(1 - shockwaveT, 1.4);

      const segments = 8;
      for (let s = 0; s < segments; s++) {
        const startAng = (s / segments) * Math.PI * 2 + 0.2;
        const endAng = startAng + (Math.PI * 2 / segments) * 0.62;
        const segR = radius + (s % 2 === 0 ? 14 : -10);
        const thick = Math.max(2, (1 - shockwaveT) * (s % 2 === 0 ? 18 : 11));

        ctx.fillStyle = s % 2 === 0 ? `rgba(255, 192, 10, ${alpha})` : `rgba(255, 240, 190, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.moveTo(Math.cos(startAng) * segR, Math.sin(startAng) * segR);
        ctx.lineTo(Math.cos((startAng + endAng) * 0.5) * (segR + thick * 0.8), Math.sin((startAng + endAng) * 0.5) * (segR + thick * 0.8));
        ctx.lineTo(Math.cos(endAng) * segR, Math.sin(endAng) * segR);
        ctx.lineTo(Math.cos((startAng + endAng) * 0.5) * (segR - thick * 0.6), Math.sin((startAng + endAng) * 0.5) * (segR - thick * 0.6));
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    for (let i = 0; i < EMBER_COUNT; i++) {
      const e = embers[i];
      if (e.active) {
        e.life += dt;
        if (e.life >= e.maxLife) { e.active = false; continue; }
        e.x += e.vx * dt; e.y += e.vy * dt;
        const p = 1 - e.life / e.maxLife;
        const s = e.size * p;

        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.life * 8);
        ctx.fillStyle = i % 2 === 0 ? tuning.warmYellow : tuning.cream;
        ctx.globalAlpha = p;
        ctx.beginPath();
        ctx.moveTo(-s, 0); ctx.lineTo(0, -s * 0.6); ctx.lineTo(s, 0); ctx.lineTo(0, s * 0.6);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }

    if (meteorVisible) {
      const pivot = pathsData.meteorHeadPivot;
      const activeCel = cachedFlameCels[currentFlameFrame] || cachedFlameCels[0];

      // Draw stepped anime afterimage ghosts during high-velocity burst or dive
      if (!isSettled && !impactActive && !reducedMotion && (speedLineIntensity > 0.08 || meteorVelocity.speed > 450)) {
        for (let g = TRAIL_COUNT - 1; g >= 1; g--) {
          const gh = meteorHistory[g];
          if (!gh.valid) continue;
          const dist = Math.hypot(gh.x - mx, gh.y - my);
          if (dist < 8) continue;
          ctx.save();
          ctx.globalAlpha = (1 - g / (TRAIL_COUNT + 1)) * 0.34;
          ctx.translate(pivot.x + gh.x, pivot.y + gh.y);
          ctx.rotate(gh.rot);
          ctx.scale(gh.scale, gh.scale);
          ctx.translate(-pivot.x, -pivot.y);
          ctx.fillStyle = g % 2 === 0 ? tuning.warmYellow : tuning.cream;
          ctx.fill(activeCel.outer);
          ctx.restore();
        }
      }

      ctx.save();
      ctx.translate(pivot.x + mx, pivot.y + my);
      ctx.rotate(mRot);
      // Uniform scale only so the asteroid and its rocky core are never skewed or distorted
      ctx.scale(mScale, mScale);
      ctx.translate(-pivot.x, -pivot.y);

      if (isImpactFlashFrame) {
        ctx.fillStyle = tuning.coreWhite;
        ctx.fill(activeCel.outer);
        ctx.fillStyle = tuning.bgBlack;
        ctx.fill(cachedCorePath);
      } else {
        // Outer hand-drawn 2D flame silhouette with animated fiery edges around both the head and tail
        ctx.fillStyle = tuning.warmYellow;
        ctx.fill(activeCel.outer);

        // Animated 2D flame edge licks & detached wisps dancing around the asteroid rim
        if (activeCel.wisps && !reducedMotion) {
          ctx.fillStyle = currentFlameFrame % 2 === 0 ? tuning.warmYellow : tuning.cream;
          ctx.fill(activeCel.wisps);
        }

        // Lively internal cream flame tongues inside the tail
        if (!reducedMotion && activeCel.inner) {
          ctx.save();
          ctx.globalAlpha = 0.48 + Math.sin(elapsed * 28) * 0.16;
          ctx.fillStyle = tuning.cream;
          ctx.fill(activeCel.inner);
          ctx.restore();
        }

        // Inner fireball patch kept deep black (#080706) instead of white
        ctx.fillStyle = tuning.bgBlack;
        ctx.fill(cachedCorePath);

        // Two warm-yellow inner craters preserved inside the black core
        ctx.fillStyle = tuning.warmYellow;
        ctx.fill(cachedCrater1Path);
        ctx.fill(cachedCrater2Path);
      }
      ctx.restore();
    }

    ctx.restore();

    // Foreground grain stays removed per the approved clean-screen refinement.

    ctx.restore();
  }

  function getState() {
    return {
      state: currentState,
      settled: isSettled,
      progress: lastProgress,
      elapsed: lastElapsed,
      flameFrame: currentFlameFrame,
      entryReady: entryTriggered && entryTimer >= tuning.entryBurstDuration,
      impactArmed,
      impactActive
    };
  }

  function setTuning(partial = {}) {
    Object.assign(tuning, partial);
  }

  function getTuning() { return { ...tuning }; }
  function dispose() { halftonePattern = null; grainPattern = null; }

  return { resize, render, reset, getState, setTuning, getTuning, dispose };
}

import assert from 'node:assert/strict';import {revealEffects} from '../dist/pc-portfolio-world.js';
for(const p of [0,.08,.16,.25,.349,.35])assert.equal(revealEffects(p),0);
assert.ok(revealEffects(.38)>0&&revealEffects(.38)<1);assert.equal(revealEffects(.43),1);
assert.equal(revealEffects(-1),0);assert.equal(revealEffects(1),1);console.log('PASS: aberration/vibrance disabled until desk reveal ends, then smoothly enabled.');

import assert from 'node:assert/strict';import fs from 'node:fs';
import {monitorPlan,createRoomResolution} from '../dist/room-performance.js';
for(const p of [0,.16,.178,.29]){const x=monitorPlan(p,1920,1080,2);assert.equal(x.width,1920);assert.equal(x.dpr,2);assert.equal(x.interval,0);}
const desk=monitorPlan(.4,1920,1080,2);assert.equal(desk.width,1280);assert.equal(desk.height,720);assert.equal(desk.interval,1/30);
assert.equal(monitorPlan(.7,1920,1080,2).visible,false);assert.equal(monitorPlan(.91,1920,1080,2).visible,true);
assert.equal(monitorPlan(.4,390,844,3).width,390);
const quality=createRoomResolution(1920,1080,2);const initial=quality.ratio;
for(let i=0;i<500;i++)quality.sample(1/60);assert.equal(quality.ratio,initial);
for(let i=0;i<1200;i++)quality.sample(1/25);assert.ok(quality.ratio<initial);assert.ok(quality.ratio>=initial*.75);
const host=fs.readFileSync(new URL('../dist/pc-portfolio.js',import.meta.url),'utf8');
assert.ok(host.includes("fillText('FEATURED WORKS'"));assert.ok(host.includes('opacity<1||!roomWarmed'));
console.log('PASS: full-resolution intro, bounded 30fps monitor, offscreen suspension, stable adaptive room resolution and prewarm.');

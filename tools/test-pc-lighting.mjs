import assert from 'node:assert/strict';
import {defaults,validateSettings,attachLighting} from '../dist/pc-lighting.js';
import {createInkMaterial} from '../dist/pc-new-materials.js';
import * as T from '../dist/vendor/three.module.min.js';
import fs from 'node:fs';
const s=defaults();assert.deepEqual(validateSettings(JSON.parse(JSON.stringify(s))),s);
for(const bad of [{...s,scene:'wrong'},{...s,ambient:NaN},{...s,glow:2},{...s,lights:[]}])assert.throws(()=>validateSettings(bad));
const meta=JSON.parse(fs.readFileSync(new URL('../dist/assets/pc-new/scene.json',import.meta.url)));
const ink=createInkMaterial(meta.materials['JAMU Ink'],null),body=new T.MeshBasicMaterial(),outline=new T.MeshBasicMaterial();
const mats=new Map([['JAMU Ink',ink],['BODY',body],['test-outline',outline]]);meta.materials['test-outline']={kind:'outline'};
const untouched=outline.onBeforeCompile,update=attachLighting(mats,meta);assert.equal(outline.onBeforeCompile,untouched);
const a={uniforms:{...ink.uniforms},vertexShader:ink.vertexShader,fragmentShader:ink.fragmentShader};ink.onBeforeCompile(a);
const b={uniforms:{},vertexShader:T.ShaderLib.basic.vertexShader,fragmentShader:T.ShaderLib.basic.fragmentShader};body.onBeforeCompile(b);
for(const shader of [a,b]){assert.ok(shader.vertexShader.includes('editWorld=(modelMatrix*vec4(transformed,1.)).xyz'));assert.ok(shader.fragmentShader.includes('gl_FragColor.rgb*=editorLight()'));assert.ok(shader.fragmentShader.indexOf('gl_FragColor.rgb*=editorLight()')<shader.fragmentShader.indexOf('#include <tonemapping_fragment>'));}
update(s);assert.equal(a.uniforms.editMix.value,s.mix);assert.equal(b.uniforms.editPositions.value[0].y,s.lights[0].y);
for(const shader of [a,b]){assert.ok(shader.vertexShader.includes('editSmoothNormal=inverseTransformDirection(normalMatrix*objectNormal,viewMatrix)'));assert.ok(shader.fragmentShader.includes('vec3 n=normalize(editSmoothNormal)'));assert.ok(!shader.fragmentShader.includes('cross(dFdx(editWorld)'));}
s.lights[0].x=3;s.lights[0].intensity=2;update(s);assert.equal(a.uniforms.editPositions.value[0].x,3);assert.equal(b.uniforms.editPowers.value[0],2);
s.enabled=false;update(s);assert.equal(a.uniforms.editMix.value,0);
console.log('PASS: export/import round trip, validation, ink + character lighting hooks, uniform updates and original-look bypass. GPU compile not verified.');

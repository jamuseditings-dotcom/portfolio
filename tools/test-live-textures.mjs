import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {makeLiveMaterials} from '../dist/live-materials.js';
import {buildStudio} from '../dist/live-world.js';
import {suppliedTextures} from '../dist/live-texture-bindings.js';
const root=new URL('../dist/assets/live/',import.meta.url);
const bytes=fs.readFileSync(new URL('scene.glb',root));
const meta=JSON.parse(fs.readFileSync(new URL('scene.json',root)));
const originalLoad=T.TextureLoader.prototype.loadAsync;
// No DOM/GPU in this test: validate real model bindings, not rendered pixels.
T.TextureLoader.prototype.loadAsync=async url=>{assert.ok(fs.existsSync(new URL(url.split('/').pop(),root)));const t=new T.Texture();t.name=url.split('/').pop();return t;};
try {
 const loader=new GLTFLoader();loader.register(parser=>({name:'TextureBindingTest',loadTexture:async index=>{
  const def=parser.json.textures[index];const file=parser.json.images[def.source].uri;
  assert.ok(fs.existsSync(new URL(file,root)));const t=new T.Texture();t.name=file;t.flipY=false;return t;
 }}));
 const gltf=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 let nativeCount=0;
 gltf.scene.traverse(o=>{if(o.isMesh&&suppliedTextures[o.material.name]){
  assert.equal(o.material.map?.name,suppliedTextures[o.material.name]);nativeCount++;
 }});
 assert.ok(nativeCount>=5,'Native GLB must bind supplied files before adaptation');
 const mats=await makeLiveMaterials(meta);
 const world=buildStudio({source:gltf.scene,meta,liveMaterials:mats,clips:gltf.animations});
 let mappedCount=0;
 world.source.traverse(o=>{if(!o.isMesh||!suppliedTextures[o.material.name])return;
  assert.equal(o.material.map?.name,suppliedTextures[o.material.name]);
  assert.equal(o.material.map.flipY,false);assert.equal(o.material.map.colorSpace,T.SRGBColorSpace);
  const uv=o.geometry.attributes.uv;assert.ok(uv);
  for(const component of [0,1]){let lo=Infinity,hi=-Infinity;for(let i=0;i<uv.count;i++){const v=uv.array[i*2+component];assert.ok(Number.isFinite(v));lo=Math.min(lo,v);hi=Math.max(hi,v);}assert.ok(hi>lo,'Nonconstant UV component');}
  mappedCount++;
 });
 assert.equal(mappedCount,nativeCount);
 for(const name of ['dress','SpiderVerse_Fast','light','pc.001']){
  const shader={uniforms:{},vertexShader:T.ShaderLib.lambert.vertexShader,fragmentShader:T.ShaderLib.lambert.fragmentShader};
  mats.get(name).onBeforeCompile(shader);
  assert.ok(shader.fragmentShader.includes('texture2D(map,vMapUv)'));
  assert.ok(shader.fragmentShader.includes('outgoingLight=mix(paint,'));
  assert.ok(!shader.fragmentShader.includes('artTexture'));
 }
 world.update(.4,1);world.update(.4,2);
 console.log(`PASS: ${mappedCount} textured mesh bindings before and after material adaptation; native UV/map shader path; animation updates.`);
} finally {T.TextureLoader.prototype.loadAsync=originalLoad;}

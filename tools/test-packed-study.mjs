import fs from 'node:fs';import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {makeLiveMaterials} from '../dist/packed-materials.js';
import {createAmbientMotion} from '../dist/live-motion.js';
const root=new URL('../dist/assets/packed-study/',import.meta.url);
const meta=JSON.parse(fs.readFileSync(new URL('scene.json',root))),bytes=fs.readFileSync(new URL('scene.glb',root));
assert.equal(meta.source_sha256,'b07c74b8467dc05db5728450de759ffc676098466de0f95f517a646239074041');
assert.deepEqual(meta.objects.table.uvs,['automap']);assert.deepEqual(meta.objects.wall.uvs,['automap']);assert.deepEqual(meta.objects['floor.001'].uvs,['UVMap']);
for(const f of fs.readdirSync(root))assert.ok(fs.statSync(new URL(f,root)).size<25*1024*1024,'Asset too large: '+f);
T.TextureLoader.prototype.loadAsync=async url=>{assert.equal(url,'assets/live/ME-DIFFUSE.jpg');assert.ok(fs.existsSync(new URL('../dist/'+url,import.meta.url)));const t=new T.Texture();t.name='ME-DIFFUSE.jpg';return t;};
const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const materials=await makeLiveMaterials(meta);let count=0;
gltf.scene.traverse(o=>{if(!o.isMesh)return;const m=materials.get(o.material.name);if(!m?.map)return;assert.ok(o.geometry.attributes.uv,'Missing UV on '+o.name);assert.equal(m.map.name,'ME-DIFFUSE.jpg');count++;});
assert.ok(count>=2);
for(const n of ['BODY','dress']){const m=materials.get(n);assert.ok(m.isMeshBasicMaterial);assert.equal(m.toneMapped,false);assert.equal(m.color.getHex(),0xffffff);assert.equal(m.map.flipY,false);assert.equal(m.map.colorSpace,T.SRGBColorSpace);}
for(const [name,m] of materials){if(m.userData.character)continue;assert.ok(!m.map,'Room image unexpectedly loaded: '+name);if(!m.userData.hatch)continue;const shader={uniforms:{},vertexShader:T.ShaderLib.lambert.vertexShader,fragmentShader:T.ShaderLib.lambert.fragmentShader};m.onBeforeCompile(shader);assert.ok(!shader.fragmentShader.includes('NaN'));assert.ok(shader.fragmentShader.includes('float ink='));}
const motion=createAmbientMotion(gltf.scene,gltf.animations);assert.ok(motion.fans.length);assert.ok(motion.fingers.length);const finger=motion.fingers[0],fan=gltf.scene.getObjectByName(motion.fans[0].name.split('.')[0]);motion.update(1,0);const a=finger.quaternion.clone(),b=fan.quaternion.clone();motion.update(1.3,0);assert.ok(a.angleTo(finger.quaternion)>1e-5);assert.ok(b.angleTo(fan.quaternion)>1e-5);const c=finger.quaternion.clone();for(let i=0;i<100;i++)motion.update(1.3,0);assert.ok(c.angleTo(finger.quaternion)<1e-6);
console.log(`PASS: ${count} character meshes with unlit original texture; room maps removed; hatch shader hooks; source identity; live fan and finger motion; no bone drift. GPU rendering not tested.`);

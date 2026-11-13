import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import * as T from '../dist/vendor/three.module.min.js';import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';import {makePCMaterials} from '../dist/pc-new-materials.js';import {buildStudio} from '../dist/pc-portfolio-world.js';import {attachLighting,defaults} from '../dist/pc-lighting.js';
const root=new URL('../dist/',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
assert.ok(read('index.html').includes('app.js?v=pc-main-11'));assert.ok(read('app.js').includes("import('./pc-portfolio.js?v=pc-main-11')"));assert.ok(!read('pc-portfolio.js').includes('assets/live/'));
const meta=JSON.parse(read('assets/pc-new/scene.json')),bytes=zlib.gunzipSync(Buffer.concat(meta.chunks.map(f=>fs.readFileSync(new URL('assets/pc-new/'+f,root))))),gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
T.TextureLoader.prototype.loadAsync=async()=>new T.Texture();const mats=await makePCMaterials(meta);attachLighting(mats,meta)(defaults());const model=buildStudio({source:gltf.scene,meta,liveMaterials:mats,clips:gltf.animations,headingTexture:new T.Texture()});
assert.deepEqual(model.source.position.toArray(),[0,0,0]);assert.ok(model.source.getObjectByName('DOOR'));assert.ok(model.source.getObjectByName('window'));assert.equal(model.phone.name,'phone');assert.ok(model.personMeshes.length>0);assert.equal(model.projectMeshes.length,3);
const bounds=new T.Box3().setFromObject(model.screen),size=bounds.getSize(new T.Vector3());assert.ok(size.x>1.6&&size.x<2);assert.ok(size.y>.7&&size.y<1);assert.ok(size.z>.08,'Monitor screen must follow the source curve');
const cameraMatrix=new T.Matrix4().set(...meta.camera.matrix.flat()).premultiply(new T.Matrix4().makeRotationX(-Math.PI/2));model.update(.4,1,16/9);assert.ok(model.camera.position.distanceTo(new T.Vector3().setFromMatrixPosition(cameraMatrix))<1e-8);
const expectedQ=new T.Quaternion().setFromRotationMatrix(cameraMatrix);assert.ok(model.camera.quaternion.angleTo(expectedQ)<1e-5,'Desk camera must match approved preview');
for(const [p,active] of [[.61,0],[.71,1],[.8,2]])assert.equal(model.update(p,2,16/9).active,active);assert.equal(model.update(.99,2,16/9).contactVisible,true);
for(const aspect of [16/9,9/16])for(let i=0;i<=100;i++){model.update(i/100,4,aspect);assert.ok(model.camera.position.toArray().every(Number.isFinite));}
const track=gltf.animations.flatMap(c=>c.tracks).find(t=>/^Object_528/.test(t.name)),fan=gltf.scene.getObjectByName(track.name.split('.')[0]);model.update(.4,1,16/9);const q=fan.quaternion.clone();model.update(.4,1.3,16/9);assert.ok(q.angleTo(fan.quaternion)>1e-6,'Fans must animate at fixed scroll');
assert.equal(defaults().exposure,.63);assert.equal(defaults().lights[0].color,'#ffbb00');assert.equal(defaults().lights[2].color,'#009dff');
const ray=new T.Raycaster();for(const aspect of [16/9,9/16])for(const p of [0,.08,.155]){model.update(p,1,aspect);for(const xy of [[0,0],[-.4,.2],[.4,.2],[0,-.4]]){ray.setFromCamera(new T.Vector2(...xy),model.camera);const hit=ray.intersectObjects([model.source,model.screen],true).find(h=>h.object.visible&&h.object.material.visible&&h.object.material.opacity!==0);assert.equal(hit?.object,model.screen,'Meteor must not be occluded by monitor shell');}}
assert.equal(model.personMeshes.filter(o=>['BODY','JAMU Ink'].includes(o.material.name)&&o.geometry.userData.characterSmooth).length,2);
for(const aspect of [21/9,16/9,4/3,1,9/16])for(const p of [0,.08,.16]){
 model.update(p,0,aspect,true);
 for(const xy of [[-1,-1],[-1,1],[1,-1],[1,1],[0,-1],[0,1],[-1,0],[1,0]]){
  ray.setFromCamera(new T.Vector2(...xy),model.camera);
  assert.ok(ray.intersectObject(model.screen,false).length,`Opening edge exposed at aspect ${aspect}, corner ${xy}`);
 }
}
// Conservative posed-body slices, padded for the camera near plane.
model.update(.4,0,16/9,true);const bands=new Map();for(const mesh of model.personMeshes){if(mesh.material.name==='BLK')continue;for(let i=0;i<mesh.geometry.attributes.position.count;i++){const p=mesh.getVertexPosition(i,new T.Vector3()).applyMatrix4(mesh.matrixWorld),band=Math.floor(p.y*4);if(!bands.has(band))bands.set(band,new T.Box3());bands.get(band).expandByPoint(p);}}
for(const box of bands.values())box.expandByScalar(.04);
for(const aspect of [16/9,9/16])for(let i=0;i<=1000;i++){const p=i/1000;model.update(p,0,aspect,true);assert.ok(![...bands.values()].some(b=>b.containsPoint(model.camera.position)),`Camera intersects padded character at progress ${p}, aspect ${aspect}: ${model.camera.position.toArray()}`);}
console.log({result:'PASS',route:'main portfolio',source:'PC NEW',curvedDisplay:size.toArray(),phone:model.phone.name,personMeshes:model.personMeshes.length,sourceCameraMatched:true,continuousFans:true,gpuVisualVerified:false});
const worksHeading=model.scene.getObjectByName('selected-works-heading');assert.ok(worksHeading);model.update(.61,0,16/9);assert.equal(worksHeading.visible,true);assert.ok(worksHeading.position.y<4.4-1.3);model.update(.4,0,16/9);assert.equal(worksHeading.visible,false);

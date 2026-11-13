import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.min.js';
import {openingOpacity,createOpeningHandoff} from '../dist/opening-handoff.js';
for(const p of [0,.08,.16])assert.equal(openingOpacity(p),1);
assert.ok(openingOpacity(.169)>0&&openingOpacity(.169)<1);
for(const p of [.178,.35,1])assert.equal(openingOpacity(p),0);
const screen=new T.Mesh(new T.PlaneGeometry(2,1),new T.MeshBasicMaterial());
const original=screen.material,texture=new T.Texture(),handoff=createOpeningHandoff(screen,texture);
const camera=new T.PerspectiveCamera(45,16/9,.01,100);camera.position.set(0,0,1);camera.updateMatrixWorld();
for(const aspect of [16/9,9/16,21/9]){
 camera.aspect=aspect;camera.updateProjectionMatrix();handoff.calibrate(camera);
 for(const point of [new T.Vector3(-.5,.2,.1),new T.Vector3(.3,-.1,0)]){
  const projected=point.clone().project(camera);
  const clip=new T.Vector4(point.x,point.y,point.z,1).applyMatrix4(screen.material.uniforms.openingProjection.value);
  assert.ok(Math.abs(clip.x/clip.w-projected.x)<1e-10);
  assert.ok(Math.abs(clip.y/clip.w-projected.y)<1e-10);
 }
}
assert.equal(screen.material.uniforms.openingMap.value,texture);
assert.equal(screen.material.toneMapped,false);
handoff.dispose();assert.equal(screen.material,original);
console.log('PASS: shared texture, projective alignment, portrait recalibration, handoff opacity, disposal. GPU shader compile not verified.');

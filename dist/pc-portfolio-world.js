import * as T from './vendor/three.module.min.js';
import {smoothCharacter} from './pc-smooth.js?v=refine-1';
const ease=v=>{v=T.MathUtils.clamp(v,0,1);return v*v*v*(v*(v*6-15)+10);};
export const revealEffects=progress=>ease((progress-.35)/.07);
const curved=(a,b,c,d,t)=>new T.CubicBezierCurve3(a,b,c,d).getPoint(t);
export const workStops=[{id:'megaverse',title:'MEGAverse',tag:'IDENTITY / MOTION',x:-1.98,y:4.4,angle:-.035},{id:'aavaasaa',title:'Aavaasaa',tag:'VISUAL STORYTELLING',x:-1.22,y:7.3,angle:.025},{id:'caliber',title:'Caliber / 25 Years',tag:'EDITORIAL',x:-1.85,y:10.2,angle:-.025}];

// Reuse the curved display surface, not the previous scene's flat monitor.
export function makeDisplaySurface(source){
 source.updateMatrixWorld(true);let monitor;source.traverse(o=>{if(o.isMesh&&o.material.name==='screen')monitor=o;});
 if(!monitor)throw Error('PC NEW curved monitor is missing.');
 const surface=monitor.parent.children.find(o=>o.isMesh&&o.material.name==='Outline ink');
 if(!surface)throw Error('PC NEW monitor shell is missing.');
 const p=surface.geometry.attributes.position,index=surface.geometry.index,points=[];
 for(let i=0;i<(index?.count||p.count);i+=3){const v=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,index?index.getX(i+j):i+j).applyMatrix4(surface.matrixWorld));const n=v[1].clone().sub(v[0]).cross(v[2].clone().sub(v[0])).normalize();
  if(n.z>.9&&v.every(a=>a.y>1.56&&a.z>-.15)){for(const a of v){a.z+=.001;points.push(a);}}
 }
 if(points.length<6)throw Error('Could not locate the PC NEW display surface.');
 const bounds=new T.Box3().setFromPoints(points),size=bounds.getSize(new T.Vector3()),geometry=new T.BufferGeometry();
 geometry.setAttribute('position',new T.Float32BufferAttribute(points.flatMap(p=>p.toArray()),3));geometry.setAttribute('uv',new T.Float32BufferAttribute(points.flatMap(p=>[(p.x-bounds.min.x)/size.x,(p.y-bounds.min.y)/size.y]),2));geometry.computeVertexNormals();
 return {geometry,bounds,center:bounds.getCenter(new T.Vector3()),size};
}

export function buildStudio({source,meta,liveMaterials,clips=[],screenTexture=null,projectTextures=[],labelTextures=[],phoneTexture=null,headingTexture=null}){
 smoothCharacter(source);
 const scene=new T.Scene();scene.background=new T.Color('#080808');scene.add(source);source.updateMatrixWorld(true);
 const display=makeDisplaySurface(source),personMeshes=[];let phone;
 source.traverse(o=>{if(o.userData.sourceObject==='phone'||o.name==='phone')phone=o;if(!o.isMesh)return;
  const adapt=m=>{const replacement=liveMaterials.get(m.name);if(!replacement)throw Error('Unmapped PC NEW material '+m.name);return replacement;};o.material=Array.isArray(o.material)?o.material.map(adapt):adapt(o.material);
  if(o.isSkinnedMesh){o.frustumCulled=false;o.userData.about=true;personMeshes.push(o);}
 });
 if(!phone)throw Error('PC NEW phone is missing.');phone.traverse(o=>{o.userData.contact=true;});
 const basic=(color,map=null)=>new T.MeshBasicMaterial({color,map,toneMapped:false});
 function mesh(g,m,parent=scene,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
 const screen=mesh(display.geometry,new T.MeshBasicMaterial({map:screenTexture,side:T.DoubleSide,toneMapped:false}));screen.name='pc-new-curved-display';
 const phoneBounds=new T.Box3().setFromObject(phone),phoneCenter=phoneBounds.getCenter(new T.Vector3()),phoneSize=phoneBounds.getSize(new T.Vector3());
 const phoneScreen=mesh(new T.PlaneGeometry(phoneSize.x*.87,phoneSize.z*.88),basic('#ffffff',phoneTexture),scene,phoneCenter.x,phoneBounds.max.y+.001,phoneCenter.z);phoneScreen.rotation.x=-Math.PI/2;phoneScreen.userData.contact=true;
 // Extend the wall only above the supplied room, for the vertical work sequence.
 mesh(new T.PlaneGeometry(14,12),liveMaterials.get('wall'),scene,-1.608,12.24,-1.4);
 const projectMeshes=[];
 workStops.forEach((p,i)=>{const group=new T.Group();group.position.set(p.x,p.y,-1.18);group.rotation.z=p.angle;scene.add(group);
  mesh(new T.BoxGeometry(3.02,2.48,.028),basic('#090909'),group,0,-.04);
  function addProjectPanel(texture,width,height,y){
   if(!texture)return;
   const panel=mesh(new T.PlaneGeometry(width,height),basic('#ffffff',texture),group,0,y,.026);
   panel.userData.project=p.id;projectMeshes.push(panel);
  }
  addProjectPanel(projectTextures[i],2.9,1.63125,0);
  addProjectPanel(headingTexture,2.9,.32,1.00);
  addProjectPanel(labelTextures[i],2.9,.42,-1.045);
 });
 const cm=new T.Matrix4().set(...meta.camera.matrix.flat()).premultiply(new T.Matrix4().makeRotationX(-Math.PI/2)),desk=new T.Vector3(),deskQuat=new T.Quaternion();cm.decompose(desk,deskQuat,new T.Vector3());
 const deskLook=desk.clone().add(new T.Vector3(0,0,-3).applyQuaternion(deskQuat)),fov=2*T.MathUtils.radToDeg(Math.atan(Math.tan(T.MathUtils.degToRad(meta.camera.fov/2))/(meta.render.width/meta.render.height))),camera=new T.PerspectiveCamera(fov,1,.008,80);
 const tracks=clips.flatMap(c=>c.tracks),fans=tracks.filter(t=>/^Object_528/.test(t.name)),body=tracks.filter(t=>!/^Object_528|^FANS|^Camera/.test(t.name)),pose=new T.AnimationMixer(source),spin=new T.AnimationMixer(source);
 if(body.length){const a=pose.clipAction(new T.AnimationClip('PC NEW saved pose',-1,body));a.setLoop(T.LoopOnce,1);a.clampWhenFinished=true;a.play();pose.setTime((meta.frame-meta.frameStart)/meta.fps);}
 if(fans.length)spin.clipAction(new T.AnimationClip('Continuous fans',-1,fans)).play();
 const bones=[];let head;source.traverse(o=>{if(o.isBone){bones.push({o,q:o.quaternion.clone()});if(/Head$/.test(o.name))head=o;}});
 // Retain live bone/fan transforms; bake only objects that never change at runtime.
 const animatedNames=new Set(fans.map(t=>T.PropertyBinding.parseTrackName(t.name).nodeName));
 scene.traverse(o=>{if(!o.isBone&&!animatedNames.has(o.name)&&!animatedNames.has(o.uuid)){o.updateMatrix();o.matrixAutoUpdate=false;}});
 scene.updateMatrixWorld(true);
 function update(raw,time=0,aspect=1,reduced=false){
  const relax=ease((raw-.37)/.12);spin.setTime(reduced?0:time);for(const {o,q} of bones){o.quaternion.copy(q);if(reduced)continue;const i=o.id;if(/Hand(Index|Middle|Ring|Pinky)[123]$/.test(o.name))o.rotation.z+=Math.max(0,Math.sin(time*(8.5+i%3*.7)+i*1.83))**2*.14*(1-relax*.85);if(/(Left|Right)Hand$/.test(o.name))o.rotation.x+=Math.sin(time*5.2+i*2.2)*.012;if(/Spine2$/.test(o.name))o.rotation.x+=relax*.04+Math.sin(time*1.4)*.005;}
  camera.aspect=aspect;const deskFov=aspect<1?Math.min(75,fov*1.5):fov;camera.fov=45+(deskFov-45)*ease((raw-.16)/.19);camera.updateProjectionMatrix();
  // Overscan the curved panel so its bowed edges stay outside the opening frame.
  const tan=Math.tan(T.MathUtils.degToRad(deskFov/2)),distance=Math.min(display.size.y,display.size.x/aspect)/(2*Math.tan(Math.PI/8))*.85;
  const start=display.center.clone().add(new T.Vector3(0,0,distance));let position=start.clone(),look=display.center.clone();
  if(raw>.16){const t=ease((raw-.16)/.19);position=curved(start,new T.Vector3(-3.9,2.45,.5),new T.Vector3(-4,2.65,2.7),desk,t);look.lerp(deskLook,t);}
  const wallDistance=Math.max(4.5,3.65/(2*tan*aspect),2.9/(2*tan)),wp=i=>new T.Vector3(workStops[i].x,workStops[i].y-.08,-1.18+wallDistance),wl=i=>new T.Vector3(workStops[i].x,workStops[i].y-.12,-1.18);
  if(raw>.49){const t=ease((raw-.49)/.10);position=desk.clone().lerp(wp(0),t);look=deskLook.clone().lerp(wl(0),t);}
  if(raw>.63){const t=ease((raw-.63)/.06);position=wp(0).lerp(wp(1),t);look=wl(0).lerp(wl(1),t);}
  if(raw>.73){const t=ease((raw-.73)/.06);position=wp(1).lerp(wp(2),t);look=wl(1).lerp(wl(2),t);}
  if(raw>.81){const t=ease((raw-.81)/.10);position=wp(2).lerp(desk,t);look=wl(2).lerp(deskLook,t);}
  if(raw>.91){const t=ease((raw-.91)/.075),phoneLook=new T.Vector3(phoneCenter.x,phoneBounds.max.y+.002,phoneCenter.z),phonePos=phoneLook.clone().add(new T.Vector3(0,1,.25).normalize().multiplyScalar(Math.max(.36,.27/(2*tan*aspect))));position=curved(desk,new T.Vector3(-3.8,4.2,3),new T.Vector3(.6,4.2,.8),phonePos,t);look=deskLook.clone().lerp(phoneLook,t);}
  camera.position.copy(position);camera.lookAt(look);camera.updateMatrixWorld();scene.updateMatrixWorld();
  const point=head?head.getWorldPosition(new T.Vector3()):new T.Vector3(-1.9,2.65,1.4);point.y+=.18;point.project(camera);
  return {active:raw>=.59&&raw<=.63?0:raw>=.69&&raw<=.73?1:raw>=.79&&raw<=.81?2:-1,contactVisible:raw>.965,aboutVisible:(raw>.33&&raw<.51)||(raw>.875&&raw<.925),aboutPoint:{x:(point.x+1)/2,y:(1-point.y)/2}};
 }
 update(0);return {scene,camera,update,projectMeshes,personMeshes,phone,phoneScreen,screen,source};
}

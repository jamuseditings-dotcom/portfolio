import * as T from './vendor/three.module.min.js';
import {createAmbientMotion} from './live-motion.js';
const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*v*(v*(v*6-15)+10)};
export const workStops=[{id:'megaverse',title:'MEGAverse',tag:'IDENTITY / MOTION',x:-.38,y:4.4,angle:-.035},{id:'aavaasaa',title:'Aavaasaa',tag:'VISUAL STORYTELLING',x:.38,y:7.3,angle:.025},{id:'caliber',title:'Caliber / 25 Years',tag:'EDITORIAL',x:-.25,y:10.2,angle:-.025}];
export function buildStudio({source,meta,liveMaterials,clips=[],screenTexture=null,projectTextures=[],labelTextures=[],phoneTexture=null,glassMaps={}}={}){
 if(!source)throw new Error('The source Blender environment is required.');
 const scene=new T.Scene();scene.background=new T.Color('#030303');
 const camera=new T.PerspectiveCamera(32.27,1,.008,60),mats={wall:new T.MeshStandardMaterial({color:0x171717,roughness:1,side:T.DoubleSide}),adapted:m=>liveMaterials.get(m.name)||m},basic=color=>new T.MeshBasicMaterial({color});
 const ink=basic('#090909'),yellow=basic('#b58d08'),cream=basic('#b7ad85');
 function mesh(geometry,material,parent,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);(parent||scene).add(m);return m;}
 function box(w,h,d,x,y,z,mat=ink,parent){return mesh(new T.BoxGeometry(w,h,d),mat,parent,x,y,z)}
 // Original geometry and scale, centered along X only.
 source.position.x+=1.608247;scene.add(source);
 const personMeshes=[],character=source.getObjectByName('CHAR'),head=source.getObjectByName('mixamorigHead');
 source.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;const original=o.material,name=original.name;o.userData.sourceMaterial=name;
  if(name==='Material.107'){o.visible=false;return;}
  let parent=o;while(parent){if(parent.name==='CHAR'||parent.name==='CHAIR'){o.userData.about=true;personMeshes.push(o);break;}parent=parent.parent;}
  o.material=name==='Material'?mats.wall:mats.adapted(original);
  if(name==='BLK')o.castShadow=false;
  if(o.isSkinnedMesh)o.frustumCulled=false;
 });
 const motion=createAmbientMotion(source,clips);
 const conversion=new T.Matrix4().makeRotationX(-Math.PI/2),cm=new T.Matrix4().set(...meta.camera.matrix.flat()).premultiply(conversion),sourceDesk=new T.Vector3().setFromMatrixPosition(cm);sourceDesk.x+=1.608247;
 const sourceLook=sourceDesk.clone().add(new T.Vector3(0,0,-3).transformDirection(cm).multiplyScalar(3));
 // Plain charcoal plaster with continuous seamless grain, as requested.
 const wall=mesh(new T.PlaneGeometry(24,18),mats.wall,null,0,7.5,-1.49);wall.name='seamless-charcoal-wall';
 // Exact bounds and tilt of the original monitor's two display triangles.
 const screen=mesh(new T.PlaneGeometry(1.48867917,.814302),new T.MeshBasicMaterial({map:screenTexture,color:screenTexture?'#ffffff':'#080808',toneMapped:false}),null,-.247397,2.056103,-.1185);
 screen.rotation.x=-Math.atan2(.0568032,.8123184);screen.name='live-monitor';
 const monitorNormal=new T.Vector3(0,Math.sin(-screen.rotation.x),Math.cos(screen.rotation.x)),screenCenter=screen.position.clone();
 // Browser key follows the updated area light's orientation; lamp adds local warmth.
 const light=meta.lights[0],lm=new T.Matrix4().set(...light.matrix.flat()).premultiply(conversion);const key=new T.DirectionalLight(new T.Color().fromArray(light.color),3.2);key.position.setFromMatrixPosition(lm);key.position.x+=1.608247;key.target.position.copy(key.position).add(new T.Vector3(0,0,-1).transformDirection(lm));key.castShadow=true;
 key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-4,right:4,top:5,bottom:-3,near:.1,far:20});key.shadow.bias=-.00015;key.shadow.normalBias=.004;scene.add(key,key.target);scene.add(new T.AmbientLight(0xffffff,.11));
 const lamp=new T.PointLight('#ffd367',1.1,2.2,2);lamp.position.set(-1.42,1.88,.18);scene.add(lamp);
 // Contact phone added to the clear front-right corner of the supplied desk.
 const phone=new T.Group();phone.position.set(1.11,1.425,.86);phone.rotation.y=-.12;scene.add(phone);
 box(.258,.028,.493,0,0,0,ink,phone);box(.253,.005,.486,0,.017,0,yellow,phone);
 const phoneScreen=mesh(new T.PlaneGeometry(.234,.454),new T.MeshBasicMaterial({map:phoneTexture,color:phoneTexture?'#ffffff':'#fcbf10',toneMapped:false}),phone,0,.020,0);phoneScreen.rotation.x=-Math.PI/2;
 box(.058,.002,.01,0,.023,-.212,ink,phone);box(.074,.002,.005,0,.023,.211,cream,phone);phone.traverse(o=>{if(o.isMesh)o.userData.contact=true;});
 const projectMeshes=[];
 for(let i=0;i<workStops.length;i++){
  const item=workStops[i],group=new T.Group();group.position.set(item.x,item.y,-1.20);group.rotation.z=item.angle;scene.add(group);
  box(3.02,1.76,.028,0,0,0,ink,group);box(2.98,1.72,.008,0,0,.019,yellow,group);
  const art=mesh(new T.PlaneGeometry(2.9,1.63125),new T.MeshBasicMaterial({map:projectTextures[i]||null,color:projectTextures[i]?'#ffffff':'#8b7c38',toneMapped:false}),group,0,0,.026);art.userData.project=item.id;projectMeshes.push(art);
  if(labelTextures[i])mesh(new T.PlaneGeometry(2.9,.351),new T.MeshBasicMaterial({map:labelTextures[i],transparent:true,toneMapped:false}),group,0,-1.12,.04);
  for(const x of [-1.3,1.3]){const tape=box(.28,.09,.008,x,.85,.04,cream,group);tape.rotation.z=x<0?-.4:.3;}
  for(let n=0;n<2;n++){const stripe=box(.055,.4,.01,1.78+n*.12,-.45,.02,yellow,group);stripe.rotation.z=-.22;}
 }
 function update(raw,time=0,aspect=1,reduced=false){
  const progress=raw;camera.aspect=aspect;camera.fov=45+(32.27-45)*ease((raw-.16)/.19);camera.updateProjectionMatrix();
  const tan=Math.tan(T.MathUtils.degToRad(32.27/2)),closeDistance=Math.min(.814302,1.48867917/aspect)/(2*Math.tan(T.MathUtils.degToRad(22.5)))*.994;
  const start=screenCenter.clone().addScaledVector(monitorNormal,closeDistance),deskDistance=Math.max(6.25,2.0+4.65/(2*tan*aspect));
  const deskLook=sourceLook.clone(),desk=sourceDesk.clone();let position=start,look=screenCenter.clone();
  motion.update(time,ease((raw-.37)/.12),reduced);
  lamp.intensity=reduced?1.1:1.1+.035*Math.sin(time*2.7)+.015*Math.sin(time*5.3);
  if(progress>.16){const t=ease((progress-.16)/.19);position=start.clone().lerp(desk,t);position.x-=.9*Math.sin(Math.PI*t);position.z-=1.1*Math.sin(Math.PI*t);look.lerp(deskLook,t);}
  const wallDistance=Math.max(4.5,3.65/(2*tan*aspect)),wallPos=i=>new T.Vector3(workStops[i].x,workStops[i].y-.08,-1.20+wallDistance),wallLook=i=>new T.Vector3(workStops[i].x,workStops[i].y-.12,-1.20);
  if(progress>.49){const t=ease((progress-.49)/.10);position=desk.clone().lerp(wallPos(0),t);look=deskLook.clone().lerp(wallLook(0),t);}
  if(progress>.63){const t=ease((progress-.63)/.06);position=wallPos(0).lerp(wallPos(1),t);look=wallLook(0).lerp(wallLook(1),t);}
  if(progress>.73){const t=ease((progress-.73)/.06);position=wallPos(1).lerp(wallPos(2),t);look=wallLook(1).lerp(wallLook(2),t);}
  if(raw>.81){const t=ease((raw-.81)/.10);position=wallPos(2).lerp(desk,t);look=wallLook(2).lerp(deskLook,t);}
  if(raw>.91){const t=ease((raw-.91)/.075),distance=Math.max(1.1,.55/(2*tan*aspect)),phoneLook=phone.position.clone().add(new T.Vector3(0,.02,0)),phonePos=phoneLook.clone().add(new T.Vector3(0,.97,.25).normalize().multiplyScalar(distance));position=desk.clone().lerp(phonePos,t);look=deskLook.clone().lerp(phoneLook,t);}
  camera.position.copy(position);camera.lookAt(look);camera.updateMatrixWorld();scene.updateMatrixWorld();
  const point=head?head.getWorldPosition(new T.Vector3()):new T.Vector3(-.34,2.65,1.4);point.y+=.18;point.project(camera);
  const aboutVisible=(raw>.33&&raw<.51)||(raw>.875&&raw<.925);
  return {active:raw>=.59&&raw<=.63?0:raw>=.69&&raw<=.73?1:raw>=.79&&raw<=.81?2:-1,contactVisible:raw>.965,aboutVisible,aboutPoint:{x:(point.x+1)/2,y:(1-point.y)/2}};
 }
 update(0);return {scene,camera,update,projectMeshes,personMeshes,phone,phoneScreen,screen,source};
}


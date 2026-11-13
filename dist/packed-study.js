import * as T from './vendor/three.module.min.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {makeLiveMaterials} from './packed-materials.js?v=hatch-1';
import {drawScene} from './scene.js?v=authored-eevee-2';
import {createAmbientMotion} from './live-motion.js';
const $=s=>document.querySelector(s),canvas=$('#live'),status=$('#status');
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches,relax=0,raw=false;
$('#motion').onclick=()=>{paused=!paused;$('#motion').textContent=paused?'Resume motion':'Pause motion';$('#motion').setAttribute('aria-pressed',String(paused));};
$('#pose').oninput=e=>relax=+e.target.value;$('#compare').onclick=()=>$('#reference').showModal();$('#close-reference').onclick=()=>$('#reference').close();
async function image(src){const i=new Image();i.src='assets/'+src;await i.decode();return i;}
async function start(){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.AgXToneMapping;renderer.toneMappingExposure=1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const [meta,gltf,images]=await Promise.all([fetch('assets/packed-study/scene.json?v=packed-2').then(r=>r.json()),new GLTFLoader().loadAsync('assets/packed-study/scene.glb?v=packed-2'),Promise.all(['desk-halftone.webp','planet-halftone.webp','letters-layer.svg','flame-1.svg',...Array.from({length:6},(_,i)=>`flame-${i+1}.svg`)].map(image))]);
 const materials=await makeLiveMaterials(meta),scene=new T.Scene();scene.background=new T.Color('#080808');scene.add(gltf.scene);
 const checks=[];
 const conversion=new T.Matrix4().makeRotationX(-Math.PI/2),cm=new T.Matrix4().set(...meta.camera.matrix.flat()).premultiply(conversion),camera=new T.PerspectiveCamera(32.27,innerWidth/innerHeight,.015,80);cm.decompose(camera.position,camera.quaternion,camera.scale);const baseCamera=camera.position.clone(),baseRotation=camera.quaternion.clone();
 const dc=document.createElement('canvas');dc.width=1280;dc.height=700;const ctx=dc.getContext('2d'),display=new T.CanvasTexture(dc);display.colorSpace=T.SRGBColorSpace;display.minFilter=T.LinearFilter;
 const assets={desk:images[0],planet:images[1],letters:images[2],meteor:images[3],flameFrames:images.slice(4)};
 const sourceNames=[];gltf.scene.traverse(o=>{if(o.isBone)sourceNames.push(o.name);if(!o.isMesh)return;const apply=m=>materials.get(m.name)||m;o.material=Array.isArray(o.material)?o.material.map(apply):apply(o.material);o.castShadow=true;o.receiveShadow=true;if(o.isSkinnedMesh)o.frustumCulled=false;
  if(o.material.name==='Material.107'){o.visible=false;return;}
  if(o.material.map){const styled=o.material,check=new T.MeshBasicMaterial({map:styled.map,color:0xffffff,side:styled.side,toneMapped:false});checks.push({o,styled,check});}
 });
 $('#textures').onclick=()=>{raw=!raw;for(const {o,styled,check} of checks)o.material=raw?check:styled;$('#textures').textContent=raw?'Return to styled':'Texture check';$('#textures').setAttribute('aria-pressed',String(raw));};
 const screen=new T.Mesh(new T.PlaneGeometry(1.48867917,.814302),new T.MeshBasicMaterial({map:display,toneMapped:false}));screen.position.set(-1.855644,2.056103,-.1185);screen.rotation.x=-Math.atan2(.0568032,.8123184);scene.add(screen);
 // The source area-light position, colour and aiming direction are retained. A small directional shadow proxy supplies browser-compatible shadowing.
 for(const l of meta.lights){const lm=new T.Matrix4().set(...l.matrix.flat()).premultiply(conversion),pos=new T.Vector3().setFromMatrixPosition(lm),dir=new T.Vector3(0,0,-1).transformDirection(lm);const key=new T.DirectionalLight(new T.Color().fromArray(l.color),3.2);key.position.copy(pos);key.target.position.copy(pos).add(dir);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-4,right:4,top:5,bottom:-5,near:.1,far:24});key.shadow.normalBias=.002;key.shadow.bias=-.0001;scene.add(key,key.target);}
 scene.add(new T.AmbientLight(0xffffff,.11));
 const lamp=new T.PointLight(0xffc25b,.8,2.5,2);lamp.position.set(-3.02,1.88,.18);scene.add(lamp);
 const motion=createAmbientMotion(gltf.scene,gltf.animations),fans=motion.fans;
 let time=0,last=performance.now(),count=0,measure=last,frames=0;
 function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<650?54:32.27;camera.updateProjectionMatrix();}resize();addEventListener('resize',resize);
 $('#loading').hidden=true;
 function render(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!paused&&!document.hidden)time+=dt;
  motion.update(time,relax,paused);
  camera.position.copy(baseCamera);camera.quaternion.copy(baseRotation);
  drawScene(ctx,assets,{width:1280,height:700,progress:.43,landingAge:3,elapsed:time,reduced:true});display.needsUpdate=true;
  renderer.render(scene,camera);frames++;count++;
  if(now-measure>1000){status.textContent=`LIVE DESK · ${Math.round(frames*1000/(now-measure))} FPS · ${paused?'PAUSED':'MOTION ON'}`;frames=0;measure=now;canvas.dataset.frame=String(count);canvas.dataset.fans=String(fans.length);canvas.dataset.time=time.toFixed(2);}
  requestAnimationFrame(render);
 }requestAnimationFrame(render);
}
start().catch(e=>{console.error(e);$('#loading').hidden=false;$('#load-message').textContent='Scene could not start: '+e.message;});

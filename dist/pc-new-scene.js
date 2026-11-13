import * as T from './vendor/three.module.min.js';import {GLTFLoader} from './vendor/GLTFLoader.js';import {makePCMaterials} from './pc-new-materials.js?v=pc-new-1';
import {createPCGlow} from './pc-new-glow.js?v=motion-1';
import {createLightingEditor} from './pc-lighting.js?v=motion-1';
import {smoothCharacter} from './pc-smooth.js?v=refine-1';
const $=s=>document.querySelector(s);let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#motion').onclick=()=>{paused=!paused;$('#motion').textContent=paused?'Resume motion':'Pause motion';};
async function start(){
 const renderer=new T.WebGLRenderer({canvas:$('#live'),antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.AgXToneMapping;
 const glowSupported=renderer.extensions.has('EXT_color_buffer_float'),glow=glowSupported?createPCGlow(renderer):null;
 const renderScene=()=>glow?glow.render(scene,camera):renderer.render(scene,camera);
 const meta=await fetch('assets/pc-new/scene.json?v=pc-new-1').then(r=>r.json());$('#message').textContent='Loading PC NEW · full geometry, about 59 MB…';
 const [parts,materials]=await Promise.all([Promise.all(meta.chunks.map(async f=>{const r=await fetch('assets/pc-new/'+f);if(!r.ok)throw Error('Scene download failed');return r.arrayBuffer();})),makePCMaterials(meta)]);
 const buffer=await new Response(new Blob(parts).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();const gltf=await new GLTFLoader().parseAsync(buffer,''),scene=new T.Scene();scene.background=new T.Color('#080808');scene.add(gltf.scene);
 smoothCharacter(gltf.scene);
 gltf.scene.traverse(o=>{if(!o.isMesh)return;const apply=m=>{const next=materials.get(m.name);if(!next)throw Error('Unmapped material '+m.name);return next;};o.material=Array.isArray(o.material)?o.material.map(apply):apply(o.material);if(o.isSkinnedMesh)o.frustumCulled=false;});
 createLightingEditor({materials,meta,renderer,glow});
 const cm=new T.Matrix4().set(...meta.camera.matrix.flat()).premultiply(new T.Matrix4().makeRotationX(-Math.PI/2)),camera=new T.PerspectiveCamera(32.27,1,.015,80);cm.decompose(camera.position,camera.quaternion,camera.scale);const startPos=camera.position.clone(),startQuat=camera.quaternion.clone();
 const tracks=gltf.animations.flatMap(c=>c.tracks),fans=tracks.filter(t=>/^Object_528/.test(t.name)),body=tracks.filter(t=>!/^Object_528|^FANS|^Camera/.test(t.name)),pose=new T.AnimationMixer(gltf.scene),spin=new T.AnimationMixer(gltf.scene);
 if(body.length){const a=pose.clipAction(new T.AnimationClip('Saved pose',-1,body));a.setLoop(T.LoopOnce,1);a.clampWhenFinished=true;a.play();pose.setTime((meta.frame-meta.frameStart)/meta.fps);}
 if(fans.length)spin.clipAction(new T.AnimationClip('Live fans',-1,fans)).play();
 const fingers=[],wrists=[];gltf.scene.traverse(o=>{if(!o.isBone)return;if(/Hand(Index|Middle|Ring|Pinky)[123]$/.test(o.name))fingers.push({o,q:o.quaternion.clone()});if(/(Left|Right)Hand$/.test(o.name))wrists.push({o,q:o.quaternion.clone()});});
 $('#reset').onclick=()=>{camera.position.copy(startPos);camera.quaternion.copy(startQuat);};$('#textures').onclick=()=>{const m=materials.get('JAMU Ink');m.uniforms.textureWeight.value=m.uniforms.textureWeight.value===1?meta.materials['JAMU Ink'].textureMix:1;$('#textures').classList.toggle('active');};
 function resize(){renderer.setSize(innerWidth,innerHeight,false);const size=renderer.getDrawingBufferSize(new T.Vector2());glow?.setSize(size.x,size.y);camera.aspect=innerWidth/innerHeight;camera.fov=2*T.MathUtils.radToDeg(Math.atan(Math.tan(T.MathUtils.degToRad(meta.camera.fov/2))/(meta.render.width/meta.render.height)));if(camera.aspect<1)camera.fov=Math.min(75,camera.fov*1.5);camera.updateProjectionMatrix();}resize();addEventListener('resize',resize);
 let drag=null;const canvas=$('#live'),target=startPos.clone().add(new T.Vector3(0,0,-1).applyQuaternion(startQuat).multiplyScalar(3));canvas.style.touchAction='none';canvas.onpointerdown=e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);};canvas.onpointerup=canvas.onpointercancel=()=>drag=null;
 canvas.onpointermove=e=>{if(!drag)return;const s=new T.Spherical().setFromVector3(camera.position.clone().sub(target));s.theta-=(e.clientX-drag[0])*.004;s.phi=Math.max(.2,Math.min(Math.PI-.2,s.phi+(e.clientY-drag[1])*.004));camera.position.copy(target).add(new T.Vector3().setFromSpherical(s));camera.lookAt(target);drag=[e.clientX,e.clientY];};
 let last=performance.now(),time=0,frames=0,measure=last;$('#loading').hidden=true;
 renderer.setAnimationLoop(now=>{const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused&&!document.hidden)time+=dt;spin.setTime(time);fingers.forEach(({o,q},i)=>{o.quaternion.copy(q);if(!paused)o.rotation.z+=Math.max(0,Math.sin(time*(8.5+i%3*.7)+i*1.83))**2*.14;});wrists.forEach(({o,q},i)=>{o.quaternion.copy(q);if(!paused)o.rotation.x+=Math.sin(time*5.2+i*2.2)*.012;});renderScene();frames++;if(now-measure>1000){$('#status').textContent=`PC NEW · ${Math.round(frames*1000/(now-measure))} FPS · ${paused?'PAUSED':'LIVE MOTION'}`;frames=0;measure=now;}});
}
start().catch(e=>{$('#loading').hidden=false;$('#message').textContent='Preview could not start: '+e.message;console.error(e);});

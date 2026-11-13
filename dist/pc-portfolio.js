import * as T from './vendor/three.module.min.js';
import {buildStudio,workStops,revealEffects} from './pc-portfolio-world.js?v=pc-main-11';
import {makePCMaterials} from './pc-new-materials.js?v=pc-new-1';
import {attachLighting,defaults} from './pc-lighting.js?v=motion-1';
import {createPCGlow} from './pc-new-glow.js?v=screen-colour-2';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {createOpeningDriver} from './anime-opening-driver.js?v=anime-4';
import {createOpeningHandoff,openingOpacity} from './opening-handoff.js?v=1';
import {monitorPlan,createRoomResolution} from './room-performance.js?v=2';
export async function createStudio(canvas,assets,onProject,onAbout,onContact){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.AgXToneMapping;
 const lighting=defaults();renderer.toneMappingExposure=lighting.exposure;
 const glow=renderer.extensions.has('EXT_color_buffer_float')?createPCGlow(renderer):null;glow?.setStrength(lighting.glow);glow?.setReveal(0);
 const display=document.createElement('canvas');display.className='native-opening';display.setAttribute('aria-hidden','true');const opening=createOpeningDriver(display);
 const texture=new T.CanvasTexture(display);texture.colorSpace=T.SRGBColorSpace;texture.minFilter=T.LinearFilter;texture.generateMipmaps=false;
 const loader=new T.TextureLoader();
 const projectTextures=await Promise.all(workStops.map(async p=>{const source=await loader.loadAsync(`assets/${p.id}.webp`);const image=source.image,c=document.createElement('canvas');c.width=1280;c.height=720;const cc=c.getContext('2d');cc.fillStyle='#080808';cc.fillRect(0,0,1280,720);const scale=Math.min(1280/image.width,720/image.height);cc.drawImage(image,(1280-image.width*scale)/2,(720-image.height*scale)/2,image.width*scale,image.height*scale);source.dispose();const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return tex;}));
 const labelTextures=workStops.map((p,i)=>{const c=document.createElement('canvas');c.width=1024;c.height=124;const c2=c.getContext('2d');c2.fillStyle='#fcbf10';c2.font='bold 47px Arial';c2.fillText(`0${i+1}`,0,49);c2.fillStyle='#ffeeba';c2.font='bold 42px Arial';c2.fillText(p.title,96,49);c2.fillStyle='#bdb693';c2.font='19px monospace';c2.fillText(p.tag,98,91);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return tex;});
 const pc=document.createElement('canvas');pc.width=512;pc.height=1024;const pctx=pc.getContext('2d');
 pctx.fillStyle='#10130e';pctx.fillRect(0,0,512,1024);pctx.fillStyle='#fcbf10';pctx.fillRect(0,78,512,10);
 pctx.font='20px monospace';pctx.fillText('JAMU / CONTACT',42,139);
 pctx.font='bold 77px Arial';pctx.fillText("LET’S",36,290);pctx.fillText('TALK.',36,370);
 pctx.font='25px monospace';pctx.fillStyle='#ffeeba';pctx.fillText('Visual design',42,462);pctx.fillText('Motion + 3D',42,502);
 pctx.fillStyle='#fcbf10';pctx.fillRect(35,600,442,104);pctx.fillStyle='#080808';pctx.font='bold 27px Arial';pctx.fillText('ganijamu@gmail.com',57,660);
 pctx.fillStyle='#a59d7b';pctx.font='23px monospace';pctx.fillText('Hyderabad, India',42,800);pctx.fillStyle='#ffeeba';pctx.font='24px monospace';pctx.fillText('Tap to say hello ↗',42,887);
 const phoneTexture=new T.CanvasTexture(pc);phoneTexture.colorSpace=T.SRGBColorSpace;
 const meta=await fetch('assets/pc-new/scene.json?v=pc-main-4').then(r=>{if(!r.ok)throw Error('PC NEW metadata could not load');return r.json();});
 const [parts,liveMaterials]=await Promise.all([Promise.all(meta.chunks.map(async file=>{const response=await fetch('assets/pc-new/'+file);if(!response.ok)throw Error('PC NEW scene download failed');return response.arrayBuffer();})),makePCMaterials(meta)]);
 const bytes=await new Response(new Blob(parts).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 const gltf=await new GLTFLoader().parseAsync(bytes,'');
 attachLighting(liveMaterials,meta)(lighting);
 const hc=document.createElement('canvas');hc.width=1536;hc.height=160;const hctx=hc.getContext('2d');hctx.fillStyle='#FFC00A';hctx.font='900 104px Arial';hctx.textBaseline='middle';hctx.textAlign='center';hctx.fillText('SELECTED WORKS',768,80);
 const headingTexture=new T.CanvasTexture(hc);headingTexture.colorSpace=T.SRGBColorSpace;
 const model=buildStudio({meta,liveMaterials,source:gltf.scene,clips:gltf.animations,screenTexture:texture,projectTextures,labelTextures,phoneTexture,headingTexture});
 const handoff=createOpeningHandoff(model.screen,texture);canvas.after(display);
 let width=1,height=1,active=-1,state=null,treatment=0,previousTime=0;
 let openingSize='',lastOpeningFrame=-Infinity,resolution=null,roomWarmed=false;
 function sizeRoom(){renderer.setPixelRatio(resolution.ratio);renderer.setSize(width,height,false);const size=renderer.getDrawingBufferSize(new T.Vector2());glow?.setSize(size.x,size.y);}
 const edgeRay=new T.Raycaster(),edgeSamples=[[-1,-1],[-1,1],[1,-1],[1,1],[0,-1],[0,1],[-1,0],[1,0]].map(v=>new T.Vector2(...v));
 function resize(w,h){width=w;height=h;resolution=createRoomResolution(w,h,devicePixelRatio||1);sizeRoom();openingSize='';lastOpeningFrame=-Infinity;
  model.update(0,0,w/h,true);handoff.calibrate(model.camera);
 }
 function render(p,time,landingAge,reduced){
  const plan=monitorPlan(p,width,height,devicePixelRatio||1),sizeKey=[plan.width,plan.height,plan.dpr].join('/');
  if(sizeKey!==openingSize){opening.resize(plan.width,plan.height,null,Math.min(plan.dpr,renderer.capabilities.maxTextureSize/Math.max(plan.width,plan.height)));openingSize=sizeKey;lastOpeningFrame=-Infinity;texture.dispose();}
  const opacity=openingOpacity(p);display.style.opacity=String(opacity);display.style.visibility=opacity===0?'hidden':'visible';
  if(time<lastOpeningFrame||plan.visible&&(time-lastOpeningFrame>=plan.interval-1e-6)){
   opening.render(time,p,reduced);lastOpeningFrame=time;if(opacity<1)texture.needsUpdate=true;
  }
  state=model.update(p,time,width/height,reduced);active=state.active;
  const outside=p>=.35||(p>.16&&edgeSamples.some(point=>{edgeRay.setFromCamera(point,model.camera);return edgeRay.intersectObject(model.screen,false).length===0;}));
  if(opacity<1&&resolution.sample(time-previousTime))sizeRoom();
  const dt=Math.max(0,Math.min(.05,time-previousTime));previousTime=time;
  treatment=p<=.16?0:T.MathUtils.damp(treatment,outside?1:0,10,dt);
  glow?.setTreatment(treatment);glow?.setReveal(revealEffects(p));if(opacity<1||!roomWarmed){if(glow)glow.render(model.scene,model.camera);else renderer.render(model.scene,model.camera);roomWarmed=true;}return state;
 }
 const ray=new T.Raycaster(),pointer=new T.Vector2();let down=null;
 function pick(e){if(!state)return null;const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,model.camera);
  const targets=[...(active>=0?model.projectMeshes:[]),...(state.aboutVisible?model.personMeshes:[]),...(state.contactVisible?[model.phone,model.phoneScreen]:[])];
  return ray.intersectObjects(targets,true)[0]?.object;
 }
 let lastHover=0;canvas.addEventListener('pointermove',e=>{const now=performance.now();if(now-lastHover<70)return;lastHover=now;canvas.style.cursor=pick(e)?'pointer':'default';});
 canvas.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});
 canvas.addEventListener('pointercancel',()=>{down=null;});
 canvas.addEventListener('pointerup',e=>{const start=down;down=null;if(!start||Math.hypot(e.clientX-start[0],e.clientY-start[1])>8)return;const hit=pick(e);if(hit?.userData.project)onProject(hit.userData.project);else if(hit?.userData.about)onAbout();else if(hit?.userData.contact)onContact();});
 return {resize,render,getOpeningState:()=>opening.getState(),dispose(){display.remove();handoff.dispose();opening.dispose();renderer.dispose();texture.dispose();phoneTexture.dispose();headingTexture.dispose();projectTextures.forEach(t=>t.dispose());labelTextures.forEach(t=>t.dispose());}};
}

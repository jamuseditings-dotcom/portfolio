import * as T from './vendor/three.module.min.js';
import {buildStudio,workStops} from './live-world.js?v=continuous-1';
import {makeLiveMaterials} from './live-materials.js?v=texture-links-2';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {drawScene} from './scene.js?v=character-room-3';
export async function createStudio(canvas,assets,onProject,onAbout,onContact){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.AgXToneMapping;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const display=document.createElement('canvas');display.width=1280;display.height=705;const dc=display.getContext('2d');
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
 const gltf=await new GLTFLoader().loadAsync('assets/live/scene.glb?v=texture-links-2');
 const meta=await fetch('assets/live/scene.json?v=texture-links-2').then(r=>r.json());const liveMaterials=await makeLiveMaterials(meta);
 const model=buildStudio({meta,liveMaterials,source:gltf.scene,clips:gltf.animations,screenTexture:texture,projectTextures,labelTextures,phoneTexture});
 let width=1,height=1,active=-1,lastTexture=-1,state=null;
 function resize(w,h){width=w;height=h;renderer.setSize(w,h,false);lastTexture=-1;}
 function render(p,time,landingAge,reduced){
  // The monitor texture is composed for the visible opening crop at every aspect ratio.
  if(time-lastTexture>1/24||lastTexture<0){
   const aspect=width/height,vw=Math.min(1280,705*aspect),vh=Math.min(705,1280/aspect);
   dc.fillStyle='#080808';dc.fillRect(0,0,1280,705);dc.save();dc.translate((1280-vw)/2,(705-vh)/2);
   drawScene(dc,assets,{width:vw,height:vh,progress:Math.min(p/.16*.43,.43),landingAge,elapsed:time,reduced:false});dc.restore();texture.needsUpdate=true;lastTexture=time;
  }
  state=model.update(p,time,width/height,reduced);active=state.active;renderer.render(model.scene,model.camera);return state;
 }
 const ray=new T.Raycaster(),pointer=new T.Vector2();let down=null;
 function pick(e){if(!state)return null;const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,model.camera);
  const targets=[...(active>=0?model.projectMeshes:[]),...(state.aboutVisible?model.personMeshes:[]),...(state.contactVisible?[model.phone]:[])];
  return ray.intersectObjects(targets,true)[0]?.object;
 }
 canvas.addEventListener('pointermove',e=>{canvas.style.cursor=pick(e)?'pointer':'default';});
 canvas.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});
 canvas.addEventListener('pointercancel',()=>{down=null;});
 canvas.addEventListener('pointerup',e=>{const start=down;down=null;if(!start||Math.hypot(e.clientX-start[0],e.clientY-start[1])>8)return;const hit=pick(e);if(hit?.userData.project)onProject(hit.userData.project);else if(hit?.userData.about)onAbout();else if(hit?.userData.contact)onContact();});
 return {resize,render,dispose(){renderer.dispose();texture.dispose();phoneTexture.dispose();projectTextures.forEach(t=>t.dispose());labelTextures.forEach(t=>t.dispose());}};
}


import * as T from './vendor/three.module.min.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {inkMaterial,outlineMaterial} from './ink-shader.js';
const status=document.querySelector('#status'),error=document.querySelector('#error');
try{
 const renderer=new T.WebGLRenderer({canvas:document.querySelector('canvas'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.NoToneMapping;
 const scene=new T.Scene();scene.background=new T.Color('#181a1d');const camera=new T.OrthographicCamera(),loader=new GLTFLoader();
 let root,revision=null,busy=false,yaw,pitch,zoom,settings,original,paint,hull;
 function update(){const next=inkMaterial(settings);for(const [k,u] of Object.entries(next.uniforms))paint.uniforms[k].value=u.value;next.dispose();hull.uniforms.width.value=settings['Outline width'];hull.uniforms.ink.value.set(...settings.Ink.slice(0,3));}
 function controls(){
  const panel=document.querySelector('#controls');panel.replaceChildren();
  const ranges={'Shadow threshold':[0,1,.01],'Highlight threshold':[0,1,.01],'Hatch frequency':[1,60,1],'Hatch thickness':[0,.8,.01],'Hatch angle':[-3.14,3.14,.01],'Hatch opacity':[0,1,.01],'Crosshatch':[0,1,.01],'Grain amount':[0,.2,.005],'Rim width':[0,.5,.01],'Rim strength':[0,1,.01],'Outline width':[0,.08,.001]};
  for(const key of Object.keys(settings)){
   if(['schema','revision'].includes(key))continue;
   const row=document.createElement('label'),name=document.createElement('span');name.textContent=key;row.append(name);panel.append(row);
   if(Array.isArray(settings[key])&&key!=='Light direction'){
    const input=document.createElement('input');input.type='color';input.value='#'+new T.Color().fromArray(settings[key]).getHexString();input.oninput=()=>{const c=new T.Color(input.value);settings[key]=[c.r,c.g,c.b,1];update();};row.append(input);
   }else if(key==='Light direction'){
    row.className='vector';for(let i=0;i<3;i++){const input=document.createElement('input');input.type='range';input.min=-1;input.max=1;input.step=.01;input.value=settings[key][i];input.setAttribute('aria-label','Light '+['X','Y','Z'][i]);input.oninput=()=>{settings[key][i]=+input.value;update();};row.append(input);}
   }else{
    const input=document.createElement('input'),value=document.createElement('output');input.type='range';[input.min,input.max,input.step]=ranges[key];input.value=settings[key];value.textContent=Number(input.value).toFixed(2);input.oninput=()=>{settings[key]=+input.value;value.textContent=Number(input.value).toFixed(2);update();};row.append(input,value);
   }
  }
 }
 function resize(){renderer.setSize(innerWidth,innerHeight);const a=innerWidth/innerHeight;camera.left=-zoom*a/2;camera.right=zoom*a/2;camera.top=zoom/2;camera.bottom=-zoom/2;camera.near=.01;camera.far=100;camera.updateProjectionMatrix();}
 function reset(){yaw=Math.atan2(3,6);pitch=Math.atan2(2.1,Math.hypot(3,6));zoom=4.6;resize();}
 function dispose(node){const mats=new Set(),geoms=new Set();node.traverse(o=>{if(o.isMesh){geoms.add(o.geometry);mats.add(o.material);}});for(const g of geoms)g.dispose();for(const m of mats)m.dispose();}
 async function refresh(force=false){if(busy)return;busy=true;try{
  const r=await fetch('settings.json',{cache:'no-store'});if(!r.ok)throw Error('Export from Blender first.');const p=await r.json();if(!force&&p.revision===revision)return;
  const gltf=await loader.loadAsync('suzanne.glb?v='+p.revision),next=gltf.scene,ink=inkMaterial(p),outline=outlineMaterial(p),meshes=[];
  next.traverse(o=>{if(o.isMesh)meshes.push(o);});for(const o of meshes){o.material.dispose();o.material=ink;o.add(new T.Mesh(o.geometry,outline));}
  if(root){scene.remove(root);dispose(root);}root=next;scene.add(root);revision=p.revision;settings=p;original=structuredClone(p);paint=ink;hull=outline;controls();status.textContent='LIVE WEBGL · Drag to rotate';error.textContent='';
 }catch(e){error.textContent=e.message;}finally{busy=false;}}
 const canvas=renderer.domElement;let drag=null;canvas.style.touchAction='none';
 canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-drag[0])*.008;pitch=Math.max(-1.35,Math.min(1.35,pitch+(e.clientY-drag[1])*.008));drag=[e.clientX,e.clientY];});canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(2,Math.min(10,zoom*Math.exp(e.deltaY*.001)));resize();},{passive:false});
 document.querySelector('#reset').onclick=reset;document.querySelector('#reload').onclick=()=>{if(original){settings=structuredClone(original);update();controls();}};addEventListener('resize',resize);reset();await refresh();
 renderer.setAnimationLoop(()=>{camera.position.set(8*Math.sin(yaw)*Math.cos(pitch),8*Math.sin(pitch),8*Math.cos(yaw)*Math.cos(pitch));camera.lookAt(0,0,0);renderer.render(scene,camera);});
}catch(e){error.textContent='WebGL could not start: '+e.message;status.textContent='Static Blender reference · not a live web render';document.querySelector('#fallback').hidden=false;}

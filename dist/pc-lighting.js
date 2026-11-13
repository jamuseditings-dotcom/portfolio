import * as T from './vendor/three.module.min.js';
const sceneId='pc-new-f49887e6f51f',storageKey='jamu-pc-lighting-approved-20261028';
export function defaults(){return {version:1,scene:sceneId,enabled:true,ambient:.21,mix:1,exposure:.63,glow:.18,lights:[
 {name:'Key',color:'#ffbb00',intensity:5,range:30,x:-5.2,y:2.15,z:-1.05},
 {name:'Fill',color:'#090806',intensity:0,range:.1,x:-20,y:3,z:1},
 {name:'Rim',color:'#009dff',intensity:5,range:18.9,x:12.65,y:4,z:3}
]};}
export function validateSettings(v){
 if(!v||v.version!==1||v.scene!==sceneId||typeof v.enabled!=='boolean'||!Array.isArray(v.lights)||v.lights.length!==3)throw Error('Choose a PC NEW lighting settings file (version 1).');
 const num=(n,a,b)=>{if(typeof n!=='number'||!Number.isFinite(n)||n<a||n>b)throw Error('Settings contain an invalid number.');return n;};
 const d=defaults();d.enabled=v.enabled;for(const [k,a,b] of [['ambient',0,2],['mix',0,1],['exposure',.1,3],['glow',0,1]])d[k]=num(v[k],a,b);
 d.lights=v.lights.map((l,i)=>{if(!l||!/^#[0-9a-f]{6}$/i.test(l.color))throw Error('Invalid light colour.');return {name:d.lights[i].name,color:l.color,intensity:num(l.intensity,0,5),range:num(l.range,.1,30),x:num(l.x,-20,20),y:num(l.y,-20,20),z:num(l.z,-20,20)};});return d;
}
export function attachLighting(materials,meta){
 const uniforms={editPositions:{value:Array.from({length:3},()=>new T.Vector3())},editColors:{value:Array.from({length:3},()=>new T.Color())},editPowers:{value:[0,0,0]},editRanges:{value:[1,1,1]},editAmbient:{value:1},editMix:{value:0}};
 const fragment=`varying vec3 editWorld;
 uniform vec3 editPositions[3],editColors[3];uniform float editPowers[3],editRanges[3],editAmbient,editMix;
 vec3 editorLight(){vec3 n=normalize(cross(dFdx(editWorld),dFdy(editWorld)));vec3 light=vec3(editAmbient);
 for(int i=0;i<3;i++){vec3 delta=editPositions[i]-editWorld;float dist=length(delta);float diffuse=max(dot(n,delta/max(dist,.0001)),0.);float falloff=1./(1.+pow(dist/editRanges[i],2.));light+=editColors[i]*editPowers[i]*diffuse*falloff;}return mix(vec3(1.),light,editMix);}
 `;
 for(const [name,m] of materials){const d=meta.materials[name];if(d.kind==='outline'||d.rgb||m.visible===false)continue;
  const smooth=name==='BODY'||name==='JAMU Ink';
  const previous=m.onBeforeCompile.bind(m);m.onBeforeCompile=shader=>{previous(shader);Object.assign(shader.uniforms,uniforms);
   shader.vertexShader='varying vec3 editWorld;\n'+shader.vertexShader;
   if(m.isShaderMaterial)shader.vertexShader=shader.vertexShader.replace('gl_Position=projectionMatrix*mv;','editWorld=(modelMatrix*vec4(transformed,1.)).xyz;gl_Position=projectionMatrix*mv;');
   else shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\neditWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
   if(smooth){
    shader.vertexShader='varying vec3 editSmoothNormal;\n'+shader.vertexShader;
    const normalCode=m.isShaderMaterial?'editSmoothNormal=inverseTransformDirection(normalMatrix*objectNormal,viewMatrix);':`\n#if defined(USE_SKINNING) || defined(USE_ENVMAP)\neditSmoothNormal=inverseTransformDirection(normalMatrix*objectNormal,viewMatrix);\n#else\neditSmoothNormal=inverseTransformDirection(normalMatrix*normal,viewMatrix);\n#endif\n`;
    shader.vertexShader=shader.vertexShader.replace('editWorld=(modelMatrix*vec4(transformed,1.)).xyz;','editWorld=(modelMatrix*vec4(transformed,1.)).xyz;'+normalCode);
   }
   shader.fragmentShader=(smooth?'varying vec3 editSmoothNormal;\n'+fragment.replace('normalize(cross(dFdx(editWorld),dFdy(editWorld)))','normalize(editSmoothNormal)'):fragment)+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <tonemapping_fragment>','gl_FragColor.rgb*=editorLight();\n#include <tonemapping_fragment>');
  };m.customProgramCacheKey=()=>`pc-editor-smooth-v2-${name}`;m.needsUpdate=true;
 }
 return s=>{uniforms.editAmbient.value=s.ambient;uniforms.editMix.value=s.enabled?s.mix:0;s.lights.forEach((l,i)=>{uniforms.editPositions.value[i].set(l.x,l.y,l.z);uniforms.editColors.value[i].set(l.color);uniforms.editPowers.value[i]=l.intensity;uniforms.editRanges.value[i]=l.range;});};
}
export function createLightingEditor({materials,meta,renderer,glow}){
 let settings=defaults(),initialMessage='Changes save in this browser. Export the JSON to send to me.';
 try{const saved=localStorage.getItem(storageKey);if(saved){settings=validateSettings(JSON.parse(saved));initialMessage='Restored your saved lighting.';}}catch{initialMessage='Could not restore saved settings. Using defaults.';}
 const applyLights=attachLighting(materials,meta);
 const style=document.createElement('style');style.textContent=`#lighting-panel{position:fixed;right:18px;top:18px;width:300px;max-height:calc(100dvh - 120px);overflow:auto;z-index:5;background:#111e;border:1px solid #ffdc6455;border-radius:8px;padding:16px;color:#eee;backdrop-filter:blur(12px)}#lighting-panel summary{font-weight:700;color:#ffdc64;cursor:pointer}#lighting-panel p{line-height:1.5;margin:12px 0;color:#aaa}#lighting-panel label{display:grid;grid-template-columns:1fr 72px;gap:6px;align-items:center;margin:10px 0;font-size:12px}#lighting-panel input[type=range]{grid-column:1/-1;width:100%;accent-color:#ffdc64}#lighting-panel input[type=number]{width:72px;background:#222;color:#fff;border:1px solid #555;padding:4px}#lighting-panel input[type=color]{width:72px;height:28px;background:#222;border:0}#lighting-panel fieldset{border:1px solid #444;margin:16px 0;padding:8px}#lighting-panel legend{color:#ffdc64}#lighting-panel .actions{display:flex;flex-wrap:wrap;gap:8px}#lighting-panel button{padding:8px;font-size:12px}#lighting-note{display:block;font-size:11px;line-height:1.5;margin-top:12px;color:#c3c3c3}@media(max-width:650px){#lighting-panel{right:8px;top:70px;width:260px;max-height:calc(100dvh - 230px)}}`;document.head.append(style);
 const panel=document.createElement('details');panel.id='lighting-panel';panel.open=innerWidth>650;document.body.append(panel);
 const summary=document.createElement('summary');summary.textContent='Lighting studio';panel.append(summary);
 const content=document.createElement('div');panel.append(content);
 function apply(save=true){applyLights(settings);renderer.toneMappingExposure=settings.exposure;glow?.setStrength(settings.glow);if(save){try{localStorage.setItem(storageKey,JSON.stringify(settings));note.textContent='Saved in this browser. Export settings to share this look.';}catch{note.textContent='Browser storage unavailable. Export settings to keep your changes.';}}}
 let note;
 function draw(){content.replaceChildren();const intro=document.createElement('p');intro.textContent='Live stylized lights. Y = height; X/Z = position. No cast shadows. RGB emitters keep their own colour.';content.append(intro);
  const checkbox=document.createElement('label');checkbox.textContent='Enable lighting layer';const enabled=document.createElement('input');enabled.type='checkbox';enabled.checked=settings.enabled;enabled.onchange=()=>{settings.enabled=enabled.checked;apply();};checkbox.append(enabled);content.append(checkbox);
  function slider(parent,obj,key,title,min,max,step){const label=document.createElement('label');label.append(document.createTextNode(title));const number=document.createElement('input'),range=document.createElement('input');number.type='number';range.type='range';for(const el of [number,range]){el.min=min;el.max=max;el.step=step;el.value=obj[key];el.setAttribute('aria-label',title);el.oninput=()=>{if(el.value===''||!Number.isFinite(el.valueAsNumber))return;obj[key]=Math.max(min,Math.min(max,el.valueAsNumber));number.value=range.value=obj[key];apply();};}label.append(number,range);parent.append(label);}
  slider(content,settings,'mix','Lighting blend',0,1,.01);slider(content,settings,'ambient','Ambient brightness',0,2,.01);slider(content,settings,'exposure','Exposure',.1,3,.01);if(glow)slider(content,settings,'glow','Glow strength',0,1,.01);
  settings.lights.forEach(l=>{const group=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=l.name+' light';group.append(legend);const label=document.createElement('label');label.textContent='Colour';const color=document.createElement('input');color.type='color';color.value=l.color;color.setAttribute('aria-label',l.name+' light colour');color.oninput=()=>{l.color=color.value;apply();};label.append(color);group.append(label);slider(group,l,'intensity',l.name+' intensity',0,5,.01);for(const axis of ['x','y','z'])slider(group,l,axis,l.name+' '+axis.toUpperCase(),-20,20,.05);slider(group,l,'range',l.name+' reach',.1,30,.1);content.append(group);});
  const actions=document.createElement('div');actions.className='actions';content.insertBefore(actions,content.children[1]);
  const button=(title,fn)=>{const b=document.createElement('button');b.textContent=title;b.onclick=fn;actions.append(b);};
  button('Export settings',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({...settings,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='jamu-lighting.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);note.textContent='Downloaded jamu-lighting.json. Send that file in chat.';});
  const file=document.createElement('input');file.type='file';file.accept='.json,application/json';file.hidden=true;content.append(file);button('Import settings',()=>file.click());file.onchange=async()=>{try{const f=file.files[0];if(!f)return;if(f.size>50000)throw Error('Settings file is too large.');const next=validateSettings(JSON.parse(await f.text()));settings=next;draw();apply();note.textContent='Imported and saved your lighting.';}catch(e){note.textContent=e.message;}finally{file.value='';}};
  button('Reset',()=>{settings=defaults();draw();apply();});note=document.createElement('span');note.id='lighting-note';note.setAttribute('role','status');note.textContent=initialMessage;content.append(note);
 }
 draw();apply(false);return {getSettings:()=>structuredClone(settings)};
}

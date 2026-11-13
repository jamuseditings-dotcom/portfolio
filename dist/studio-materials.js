import * as T from './vendor/three.module.min.js';
// Browser equivalent of the source Eevee toon/halftone materials.
export function sourceMaterials(maps={}){
 const ramp=new T.DataTexture(new Uint8Array([1,1,2,3,8,76,182,255]),8,1,T.RedFormat);ramp.minFilter=ramp.magFilter=T.NearestFilter;ramp.needsUpdate=true;
 const paint=new T.MeshToonMaterial({color:'#ffd000',gradientMap:ramp});
 paint.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <dithering_fragment>',`float dotMask=1.0-smoothstep(.16,.30,length(fract(gl_FragCoord.xy/3.5)-.5));float mid=smoothstep(.02,.12,gl_FragColor.r)*(1.0-smoothstep(.52,.8,gl_FragColor.r));gl_FragColor.rgb*=1.0-dotMask*mid*.62;\n#include <dithering_fragment>`);};
 const ink=new T.MeshToonMaterial({color:'#080808',gradientMap:ramp});
 const red=new T.MeshToonMaterial({color:'#690510',gradientMap:ramp,emissive:'#180004',emissiveIntensity:.25});
 const glass=new T.MeshPhysicalMaterial({color:'#322c16',metalness:.65,roughness:.5,transparent:true,opacity:.30,depthWrite:false,normalMap:maps.normal||null,normalScale:new T.Vector2(.1,.1),roughnessMap:maps.roughness||null});
 const wall=new T.MeshBasicMaterial({color:'#151515',side:T.DoubleSide});
 wall.onBeforeCompile=s=>{s.vertexShader='varying vec3 wallPosition;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nwallPosition=(modelMatrix*vec4(transformed,1.0)).xyz;');
 s.fragmentShader=`varying vec3 wallPosition;float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise21(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}float fractal(vec2 p){return noise21(p)*.5+noise21(p*2.03)*.25+noise21(p*4.11)*.125+noise21(p*8.13)*.0625;}\n`+s.fragmentShader;
 s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>\n// Continuous world-space plaster grain: no image edges or visible tile seams.
vec2 p=wallPosition.xy;
float grain=noise21(p*65.0)*.7+noise21(p*137.0)*.3;
float textureStrength=1.0-smoothstep(.4,1.4,max(fwidth(p.x),fwidth(p.y))*65.0);
float plaster=.0075+(grain-.5)*.003*textureStrength;
diffuseColor.rgb=vec3(plaster);`);};
 const outline=new T.MeshBasicMaterial({color:'#020202'});
 const characterRamp=new T.DataTexture(new Uint8Array([8,12,18,30,75,150,220,255]),8,1,T.RedFormat);characterRamp.minFilter=characterRamp.magFilter=T.NearestFilter;characterRamp.needsUpdate=true;
 const characterMaterials=new Map();
 function adapted(original){
  const name=original.name;
  if(characterMaterials.has(name))return characterMaterials.get(name);
  let mat;
  if(name==='BLK')mat=outline;
  else if(name==='BODY'||name==='DRESS'||name==='Leather'||name==='Material.001'){
   const color=name==='BODY'?'#dda36b':name==='DRESS'?'#bb954c':name==='Leather'?'#8f743c':'#c19b53';
   mat=new T.MeshToonMaterial({color,map:original.map,gradientMap:characterRamp});
   mat.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
    vec4 sampledDiffuseColor=texture2D(map,vMapUv);
    float albedo=dot(sampledDiffuseColor.rgb,vec3(.2126,.7152,.0722));
    diffuseColor.rgb*=mix(.16,1.0,sqrt(albedo));
    diffuseColor.a*=sampledDiffuseColor.a;
   #endif`);};
  }else if(name.startsWith('RGB Glow'))mat=new T.MeshBasicMaterial({color:'#9b4dff'});
  else if(name==='emison')mat=new T.MeshBasicMaterial({color:'#ffe1a0'});
  else if(['Material.184','Material.094','Material.098','Material.101'].includes(name))mat=new T.MeshPhysicalMaterial({color:'#171510',metalness:.1,roughness:.45,transparent:true,opacity:.2,depthWrite:false});
  else if(name==='Material.324')mat=ink;
  else if(name==='shader.001')mat=new T.MeshToonMaterial({color:'#342d1b',gradientMap:ramp});
  else mat=paint;
  characterMaterials.set(name,mat);return mat;
 }
 return {paint,ink,red,glass,wall,adapted};
}

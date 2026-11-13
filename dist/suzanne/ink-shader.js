import * as T from './vendor/three.module.min.js';
export function inkMaterial(p){
 const uniforms={},names={Highlight:'highlight',Midtone:'midtone',Shadow:'shadow',Ink:'ink','Rim colour':'rimColor','Light direction':'key','Shadow threshold':'shadowThreshold','Highlight threshold':'highlightThreshold','Hatch frequency':'frequency','Hatch thickness':'thickness','Hatch angle':'angle','Hatch opacity':'opacity','Crosshatch':'crosshatch','Grain amount':'grain','Rim width':'rimWidth','Rim strength':'rimStrength'};
 for(const [key,name] of Object.entries(names))uniforms[name]={value:Array.isArray(p[key])?new T.Vector3(...p[key].slice(0,3)):p[key]};
 return new T.ShaderMaterial({uniforms,toneMapped:false,vertexShader:`
varying vec3 localPosition;varying vec3 localNormal;varying vec3 viewNormal;
void main(){
 localPosition=vec3(position.x,-position.z,position.y);
 localNormal=vec3(normal.x,-normal.z,normal.y);
 viewNormal=normalMatrix*normal;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}`,fragmentShader:`
uniform vec3 highlight,midtone,shadow,ink,rimColor,key;
uniform float shadowThreshold,highlightThreshold,frequency,thickness,angle,opacity,crosshatch,grain,rimWidth,rimStrength;
varying vec3 localPosition;varying vec3 localNormal;varying vec3 viewNormal;
float stripe(float x){float wave=abs(sin(x*frequency*3.141592653589793));float aa=max(fwidth(wave),.001);return 1.-smoothstep(thickness-aa,thickness+aa,wave);}
void main(){
 float shade=dot(normalize(localNormal),key/max(length(key),.000001))*.5+.5;
 float dark=1.-step(shadowThreshold,shade),lit=step(highlightThreshold,shade);
 vec3 paint=mix(midtone,shadow,dark);paint=mix(paint,highlight,lit);
 float c=cos(angle),s=sin(angle);
 float u=localPosition.x*c+localPosition.z*s,v=localPosition.z*c-localPosition.x*s;
 float lines=max(stripe(u)*(1.-lit),stripe(v)*dark*crosshatch);
 paint=mix(paint,ink,lines*opacity);
 float noise=(sin(dot(localPosition,vec3(173.,291.,127.)))+1.)*.5;
 paint=mix(paint,ink,noise*grain);
 float facing=abs(normalize(viewNormal).z);
 paint=mix(paint,rimColor,(1.-step(rimWidth,facing))*rimStrength);
 gl_FragColor=vec4(paint,1.);
 #include <colorspace_fragment>
}`});
}
export function outlineMaterial(p){return new T.ShaderMaterial({side:T.BackSide,toneMapped:false,uniforms:{width:{value:p['Outline width']},ink:{value:new T.Vector3(...p.Ink.slice(0,3))}},vertexShader:`uniform float width;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*width,1.);}`,fragmentShader:`uniform vec3 ink;void main(){gl_FragColor=vec4(ink,1.);
#include <colorspace_fragment>
}`});}

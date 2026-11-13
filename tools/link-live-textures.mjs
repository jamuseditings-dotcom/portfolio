// Add portable glTF texture references without re-exporting geometry or animation.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {bindSuppliedTextures} from '../dist/live-texture-bindings.js';
const root=new URL('../dist/assets/live/',import.meta.url);
const path=new URL('scene.glb',root),bytes=fs.readFileSync(path);
assert.equal(bytes.readUInt32LE(0),0x46546c67);
const jsonLength=bytes.readUInt32LE(12);
const model=JSON.parse(bytes.subarray(20,20+jsonLength));
const binary=bytes.subarray(20+jsonLength);
const meta=bindSuppliedTextures(JSON.parse(fs.readFileSync(new URL('scene.json',root))));
model.images=[];model.textures=[];
model.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];
const indices=new Map();
for(const material of model.materials){
 const file=meta.materials[material.name]?.texture;
 if(!file)continue;
 assert.ok(fs.existsSync(new URL(file,root)),`Missing ${file}`);
 if(!indices.has(file)){
  const index=model.images.length;indices.set(file,index);
  model.images.push({uri:file,name:file});model.textures.push({source:index,sampler:0});
 }
 material.pbrMetallicRoughness.baseColorTexture={index:indices.get(file),texCoord:0};
 // An albedo map is not multiplied by the temporary export carrier's grey.
 material.pbrMetallicRoughness.baseColorFactor=[1,1,1,1];
}
const json=Buffer.from(JSON.stringify(model));
const padded=Buffer.alloc(Math.ceil(json.length/4)*4,0x20);json.copy(padded);
const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);
header.writeUInt32LE(20+padded.length+binary.length,8);header.writeUInt32LE(padded.length,12);header.writeUInt32LE(0x4e4f534a,16);
const result=Buffer.concat([header,padded,binary]);
assert.ok(result.length<25*1024*1024,'Site asset size limit');
fs.writeFileSync(path,result);
console.log(`Linked ${indices.size} original images in ${fileURLToPath(path)}; geometry and animation bytes unchanged.`);

import bpy,sys,json,hashlib,gzip
from pathlib import Path
src=Path(sys.argv[1]);out=Path(__file__).resolve().parents[1]/'dist/assets/pc-new';out.mkdir(parents=True,exist_ok=True)
sha=hashlib.sha256(src.read_bytes()).hexdigest();assert sha=='f49887e6f51ff076fef5c0a735fdb99d662a2d2f6f1a0752148c290eb3e85607'
bpy.ops.wm.open_mainfile(filepath=str(src),load_ui=False,use_scripts=False)
s=bpy.context.scene;s.render.engine='CYCLES';bpy.context.view_layer.update()
def val(v):
 try:return list(v)
 except:return v if isinstance(v,(str,int,float,bool)) else str(v)
visible=[o for o in s.objects if not o.hide_render]
meta={'source':'PC NEW.blend','source_sha256':sha,'frame':s.frame_current,'frameStart':s.frame_start,'fps':s.render.fps/s.render.fps_base,'camera':{'matrix':[list(r) for r in s.camera.matrix_world],'fov':s.camera.data.angle*180/3.141592653589793},'render':{'width':s.render.resolution_x,'height':s.render.resolution_y,'view':s.view_settings.view_transform},'materials':{},'objects':{},'textures':{}}
used={m.name:m for o in visible if o.type=='MESH' for m in o.data.materials if m}
for name in ['INK | Single-sided black shell','BLK']:
 if bpy.data.materials.get(name):used[name]=bpy.data.materials[name]
for o in visible:
 if o.type!='MESH':continue
 for mod in o.modifiers:
  if mod.type=='SOLIDIFY':
   width=mod.thickness
   if o.animation_data:
    for driver in o.animation_data.drivers:
     if driver.data_path==mod.path_from_id('thickness'):driver.mute=True
   mod.thickness=width
for name,m in used.items():
 d={'params':{},'base':list(m.diffuse_color),'kind':'basic'};meta['materials'][name]=d
 if not m.use_nodes:continue
 ns=m.node_tree.nodes
 group=next((n for n in ns if n.type=='GROUP' and n.node_tree and n.node_tree.name.startswith('JAMU · Portable Ink')),None)
 if group:d.update(kind='jamu',params={i.name:val(i.default_value) for i in group.inputs if hasattr(i,'default_value')})
 d['legacyParams']={i.name:val(i.default_value) for n in ns if n.type=='GROUP' for i in n.inputs if hasattr(i,'default_value')}
 p=next((n for n in ns if n.type=='BSDF_PRINCIPLED'),None);e=next((n for n in ns if n.type=='EMISSION'),None)
 if p:d.update(base=list(p.inputs['Base Color'].default_value),alpha=p.inputs['Alpha'].default_value)
 if e:d['base']=list(e.inputs['Color'].default_value)
 if name=='BODY':d['kind']='character'
 if name in ['Outline ink','BLK','INK | Single-sided black shell']:d['kind']='outline'
 mix=next((n for n in ns if n.type=='MIX_SHADER' and any(l.from_node.type=='BSDF_TRANSPARENT' for i in n.inputs for l in i.links)),None)
 if mix and d['kind']!='outline':
  slot=next(i for i in [1,2] if any(l.from_node.type=='BSDF_TRANSPARENT' for l in mix.inputs[i].links));d['alpha']=mix.inputs[0].default_value if slot==1 else 1-mix.inputs[0].default_value
 tex=next((n for n in ns if n.type=='TEX_IMAGE' and n.image),None)
 if tex:
  im=tex.image;assert im.packed_file,'Unpacked '+im.name
  if im.name not in meta['textures']:
   data=bytes(im.packed_file.data);ext='.png' if data[:4]==b'\x89PNG' else '.jpg';file=f'texture-{len(meta["textures"])}{ext}';(out/file).write_bytes(data);meta['textures'][im.name]={'file':file,'sha256':hashlib.sha256(data).hexdigest(),'size':list(im.size)}
  d.update(texture=meta['textures'][im.name]['file'],textureName=im.name)
  if group:
   mix=next(n for n in ns if n.type=='MIX_SHADER');d['textureMix']=mix.inputs[0].default_value;d['textureSlot']=next(i for i in [1,2] if any(l.from_node==tex for l in mix.inputs[i].links))
 if name.startswith('RGB Glow') or name=='PC_RGB_Fan_Simple':
  ramp=next((n for n in ns if n.type=='VALTORGB'),None);value=next((n for n in ns if n.type=='VALUE'),None)
  d['rgb']={'strength':e.inputs['Strength'].default_value if e else 1,'offset':value.outputs[0].default_value if value else 0,'ramp':[(e.position,list(e.color)) for e in ramp.color_ramp.elements] if ramp else None}
 ns.clear();p=ns.new('ShaderNodeBsdfPrincipled');p.inputs['Base Color'].default_value=d['base'];output=ns.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs[0],output.inputs['Surface'])
for o in visible:
 if o.type!='MESH':continue
 meta['objects'][o.name]={'vertices':len(o.data.vertices),'materials':[m.name if m else '' for m in o.data.materials]};o['sourceObject']=o.name;bpy.context.view_layer.objects.active=o
 arms=[m for m in o.modifiers if m.type=='ARMATURE']
 for m in arms:m.show_viewport=False
 for m in list(o.modifiers):
  if m.type in {'NODES','SOLIDIFY'}:bpy.ops.object.modifier_apply(modifier=m.name)
 for m in arms:m.show_viewport=True
 meta['objects'][o.name]['exportVertices']=len(o.data.vertices)
bpy.ops.object.select_all(action='DESELECT')
for o in visible:
 if o.type in {'MESH','ARMATURE','EMPTY'}:o.select_set(True)
raw=src.parent/'pc-new-export.glb'
bpy.ops.export_scene.gltf(filepath=str(raw),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_animations=True,export_animation_mode='SCENE',export_anim_scene_split_object=False,export_force_sampling=True,export_optimize_animation_size=True)
data=raw.read_bytes();compressed=gzip.compress(data,compresslevel=6,mtime=0);meta['chunks']=[]
for i,start in enumerate(range(0,len(compressed),20*1024*1024)):
 file=f'scene-{i}.glb.gz.part';(out/file).write_bytes(compressed[start:start+20*1024*1024]);meta['chunks'].append(file)
meta.update(geometryBytes=len(data),compressedBytes=len(compressed));(out/'scene.json').write_text(json.dumps(meta));assert hashlib.sha256(src.read_bytes()).hexdigest()==sha;print('EXPORT COMPLETE',len(data),len(compressed),flush=True)

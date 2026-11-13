"""Export a separate live test. Never writes or resaves the authored Blender file."""
import bpy,sys,json,hashlib,math
from pathlib import Path
from mathutils import Vector
src=Path(sys.argv[1]);root=Path(__file__).resolve().parents[1];out=root/'dist/assets/packed-study';out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(src),load_ui=False,use_scripts=False)
s=bpy.context.scene;s.frame_set(88);bpy.context.view_layer.update()
missing=bpy.data.images.get('Color.jpg.001')
if missing and not missing.packed_file:raise RuntimeError('Character texture is not packed')
def val(v):
 if isinstance(v,(str,int,float,bool)):return v
 try:return list(v)
 except:return v if isinstance(v,(str,int,float,bool)) else str(v)
def graph(t):
 return {'nodes':[{'name':n.name,'type':n.bl_idname,'inputs':[{'name':i.name,'value':val(i.default_value) if hasattr(i,'default_value') else None} for i in n.inputs],'props':{k:val(getattr(n,k)) for k in ['operation','blend_type','data_type','wave_type','bands_direction','wave_profile','use_clamp'] if hasattr(n,k)},'group':graph(n.node_tree) if n.type=='GROUP' else None} for n in t.nodes],'links':[[l.from_node.name,list(l.from_node.outputs).index(l.from_socket),l.to_node.name,list(l.to_node.inputs).index(l.to_socket)] for l in t.links]}
meta={'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'camera':{'matrix':[list(r) for r in s.camera.matrix_world],'lens':s.camera.data.lens},'materials':{},'lights':[],'objects':{},'graphs':{}}
uv_names={o.name:next((n.uv_map for m in o.data.materials if m and m.use_nodes for n in m.node_tree.nodes if n.type=='UVMAP' and n.uv_map in o.data.uv_layers),next((u.name for u in o.data.uv_layers if u.active_render),None)) for o in s.objects if o.type=='MESH'}
used={m.name:m for o in s.objects if o.type=='MESH' and not o.hide_render for m in o.data.materials if m}
textures={}
for name,m in used.items():
 if not m.use_nodes:continue
 ns=m.node_tree.nodes;groups=[n for n in ns if n.type=='GROUP'];tex=[n.image for n in ns if n.type=='TEX_IMAGE' and n.image]
 params={i.name:val(i.default_value) for n in groups for i in n.inputs if hasattr(i,'default_value')}
 p=next((n for n in ns if n.type=='BSDF_PRINCIPLED'),None);e=next((n for n in ns if n.type=='EMISSION'),None)
 desc={'params':params,'base':list(p.inputs['Base Color'].default_value) if p else [1,1,1,1],'roughness':p.inputs['Roughness'].default_value if p else 1,'metallic':p.inputs['Metallic'].default_value if p else 0,'emission':list(e.inputs['Color'].default_value) if e else list(p.inputs['Emission Color'].default_value) if p else [0,0,0,1],'emissionStrength':e.inputs['Strength'].default_value if e else p.inputs['Emission Strength'].default_value if p else 0}
 mapping=next((n for n in ns if n.type=='MAPPING'),None)
 desc['coordinates']='UV';desc['mapping']={'scale':[1,1,1],'rotation':[0,0,0],'location':[0,0,0]}
 if mapping:
  desc['mapping']={k.lower():list(mapping.inputs[k].default_value) for k in ['Scale','Rotation','Location']}
  for l in mapping.inputs['Scale'].links:
   if l.from_node.type=='VALUE':desc['mapping']['scale']=[l.from_socket.default_value]*3
  for l in mapping.inputs['Vector'].links:desc['coordinates']=l.from_socket.name
 if tex:
  im=tex[0]
  if im.name not in textures:
   data=im.packed_file.data if im.packed_file else Path(sys.argv[2]).read_bytes() if im.name.startswith('Color.jpg') else None
   if data:
    ext='.png' if data[:4]==b'\x89PNG' else '.jpg';filename='texture-'+str(len(textures))+ext;(out/filename).write_bytes(data);textures[im.name]=filename
   else:raise RuntimeError('Missing source texture: '+im.name)
  desc['texture']=textures[im.name];desc['textureName']=im.name
 meta['materials'][name]=desc
 for n in groups:
  if n.node_tree.name not in meta['graphs']:meta['graphs'][n.node_tree.name]=graph(n.node_tree)
  desc['group']=n.node_tree.name
 # Interchange carrier only. Runtime compiles the original style parameters, not this placeholder.
 ns.clear();p=ns.new('ShaderNodeBsdfPrincipled');p.inputs['Base Color'].default_value=desc['base'];p.inputs['Roughness'].default_value=desc['roughness'];o=ns.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs['BSDF'],o.inputs['Surface'])
for o in s.objects:
 if o.type=='LIGHT':meta['lights'].append({'name':o.name,'type':o.data.type,'color':list(o.data.color),'power':o.data.energy,'size':getattr(o.data,'size',0),'matrix':[list(r) for r in o.matrix_world]})
 if o.type=='MESH' and not o.hide_render:
  meta['objects'][o.name]={'materials':[m.name if m else '' for m in o.data.materials],'vertices':len(o.data.vertices)}
  o['sourceObject']=o.name;bpy.context.view_layer.objects.active=o
  arms=[m for m in o.modifiers if m.type=='ARMATURE']
  for m in arms:m.show_viewport=False
  for m in list(o.modifiers):
   if m.type=='NODES':bpy.ops.object.modifier_apply(modifier=m.name)
  for m in arms:m.show_viewport=True
  if o.name=='pc2' and len(o.data.vertices)>100000:
   d=o.modifiers.new('Web internal detail budget','DECIMATE');d.ratio=.08;bpy.ops.object.modifier_apply(modifier=d.name)
  keep=uv_names.get(o.name)
  for uv in list(o.data.uv_layers):
   if keep and uv.name!=keep:o.data.uv_layers.remove(uv)
  if o.data.uv_layers:o.data.uv_layers.active_index=0;o.data.uv_layers[0].active_render=True
  meta['objects'][o.name]['uvs']=[u.name for u in o.data.uv_layers]
bpy.ops.object.select_all(action='DESELECT')
for o in s.objects:
 if not o.hide_render and o.type in ['MESH','ARMATURE','EMPTY']:o.select_set(True)
(out/'scene.json').write_text(json.dumps(meta))
bpy.ops.export_scene.gltf(filepath=str(out/'scene.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_cameras=False,export_lights=False,export_animations=True,export_animation_mode='SCENE',export_anim_scene_split_object=False,export_force_sampling=True,export_optimize_animation_size=True)
assert hashlib.sha256(src.read_bytes()).hexdigest()==meta['source_sha256'];print('LIVE_EXPORT_COMPLETE',flush=True)

"""Export supplied Blender scene without modifying the upload. Run using Blender Python."""
import bpy,json,sys,hashlib
from pathlib import Path
from mathutils import Vector
src=Path(sys.argv[1]);out=Path(__file__).resolve().parents[1]/'dist/assets/studio';out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(src),load_ui=False,use_scripts=False)
s=bpy.context.scene;bpy.context.view_layer.update()
meta={'source':src.name,'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'frame':s.frame_current,'fps':s.render.fps/s.render.fps_base,'camera':{'position':list(s.camera.matrix_world.translation),'matrix':[list(r) for r in s.camera.matrix_world],'lens':s.camera.data.lens},'objects':{},'lights':[],'materials':{},'animations':[]}
for o in s.objects:
 if o.type=='LIGHT' and not o.hide_render:meta['lights'].append({'name':o.name,'type':o.data.type,'energy':o.data.energy,'color':list(o.data.color),'matrix':[list(r) for r in o.matrix_world]})
 if o.type=='MESH' and not o.hide_render:
  pts=[o.matrix_world@Vector(v) for v in o.bound_box];meta['objects'][o.name]={'min':[min(p[i] for p in pts) for i in range(3)],'max':[max(p[i] for p in pts) for i in range(3)],'sourceVertices':len(o.data.vertices)}
 if o.name=='screen.001':
  ps=[p for p in o.data.polygons if o.data.materials[p.material_index].name=='Material.107'];pts=[o.matrix_world@o.data.vertices[v].co for p in ps for v in p.vertices];meta['display']={'min':[min(p[i] for p in pts) for i in range(3)],'max':[max(p[i] for p in pts) for i in range(3)]}
# Capture embedded colour maps in web-sized JPEGs. Original image bytes are unchanged.
images={}
for name,filename,size in [('Color.jpg.001','character-color.jpg',2048),('Brown Wood_Diffuse.jpg','desk-wood.jpg',1024),('Image_7.001','chair-color.jpg',1024)]:
 im=bpy.data.images.get(name)
 if im and im.has_data:
  if max(im.size)>size:im.scale(size,size)
  im.file_format='JPEG';im.filepath_raw=str(out/filename);im.save();images[name]=im
# Material nodes unsupported by glTF are translated in studio-materials.js.
used={m.name:m for o in s.objects if o.type=='MESH' and not o.hide_render for m in o.data.materials if m}
for name,m in used.items():
 base=[.45,.29,.02,1];emission=None;image=None
 if name in ['BODY','DRESS']:base=[1,1,1,1];image=images.get('Color.jpg.001')
 elif name=='Material.001':base=[1,1,1,1];image=images.get('Brown Wood_Diffuse.jpg')
 elif name=='Leather':base=[1,1,1,1];image=images.get('Image_7.001')
 elif name=='BLK' or name=='Material.324':base=[.001,.001,.001,1]
 elif name.startswith('RGB Glow'):base=[.18,.01,.8,1];emission=[.3,.01,1,1]
 elif name=='emison':base=[1,.6,.03,1];emission=[1,.6,.03,1]
 elif name=='Material.107':base=[0,0,0,1]
 meta['materials'][name]={'base':base,'image':image.name if image else None}
 m.use_nodes=True;m.node_tree.nodes.clear();p=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');p.inputs['Base Color'].default_value=base;p.inputs['Roughness'].default_value=.9
 if image:
  tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image;m.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color'])
 if emission:p.inputs['Emission Color'].default_value=emission;p.inputs['Emission Strength'].default_value=1
 output=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs['BSDF'],output.inputs['Surface'])
# Keep the character rig intact. Apply its outline geometry in the undeformed pose.
for o in list(s.objects):
 if o.hide_render or o.type!='MESH':continue
 o['sourceObject']=o.name;o['about']=o.name in ['CHAR','CHAIR']
 bpy.context.view_layer.objects.active=o
 while len(o.data.uv_layers)>1:o.data.uv_layers.remove(o.data.uv_layers[-1])
 arm=[m for m in o.modifiers if m.type=='ARMATURE']
 for m in arm:m.show_viewport=False
 if o.name=='CHAIR':
  dec=o.modifiers.new('Web chair reduction','DECIMATE');dec.ratio=.45;dec.use_collapse_triangulate=True
  bpy.ops.object.modifier_move_to_index(modifier=dec.name,index=0);bpy.ops.object.modifier_apply(modifier=dec.name)
 for m in list(o.modifiers):
  if m.type=='NODES':bpy.ops.object.modifier_apply(modifier=m.name)
 for m in arm:m.show_viewport=True
 if o.name=='pc2':
  # Retain case silhouette and component layout at a browser-appropriate density.
  dec=o.modifiers.new('Web geometry reduction','DECIMATE');dec.ratio=.03;dec.use_collapse_triangulate=True;bpy.ops.object.modifier_apply(modifier=dec.name)
 meta['objects'][o.name]['exportVertices']=len(o.data.vertices)
# Export one synchronized source animation for the character and PC fans.
bpy.ops.object.select_all(action='DESELECT')
for o in s.objects:
 if not o.hide_render and o.type in ['MESH','ARMATURE','EMPTY']:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/'updated-scene.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_cameras=False,export_lights=False,export_animations=True,export_animation_mode='SCENE',export_anim_scene_split_object=False,export_force_sampling=True,export_optimize_animation_size=True,export_image_format='JPEG',export_jpeg_quality=85)
(out/'updated-scene.json').write_text(json.dumps(meta,indent=2));print('EXPORT_COMPLETE',str(out/'updated-scene.glb'),flush=True)

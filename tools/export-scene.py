import bpy,json,sys,hashlib
from pathlib import Path
from mathutils import Vector
src=Path(sys.argv[1]);out=Path(__file__).resolve().parents[1]/'dist/assets/studio';out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(src),load_ui=False,use_scripts=False)
bpy.context.view_layer.update()
report={}
for name,filename in [('garage_floor_nor_gl_4k.jpg.001','glass-normal.jpg'),('SP_2K_Roughness.jpg','glass-roughness.jpg')]:
 im=bpy.data.images.get(name)
 if im and im.packed_file:(out/filename).write_bytes(im.packed_file.data)
for o in bpy.context.scene.objects:
 if o.type!='MESH':continue
 pts=[o.matrix_world@Vector(v) for v in o.bound_box]
 report[o.name]={'min':[min(p[i] for p in pts) for i in range(3)],'max':[max(p[i] for p in pts) for i in range(3)]}
 o['sourceObject']=o.name
 while len(o.data.uv_layers)>1:o.data.uv_layers.remove(o.data.uv_layers[-1])
used={m.name:m for o in bpy.context.scene.objects if o.type=='MESH' for m in o.data.materials if m}
for name,m in used.items():
 m.use_nodes=True;m.node_tree.nodes.clear();p=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');p.inputs['Base Color'].default_value=(.4,.25,.01,1);p.inputs['Roughness'].default_value=.8
 output=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs['BSDF'],output.inputs['Surface'])
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
 if o.type=='MESH':o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/'pc-scene.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_cameras=False,export_lights=False,export_animations=False)
(out/'source-bounds.json').write_text(json.dumps(report,indent=2))
(out/'provenance.json').write_text(json.dumps({'source':'pc.blend','sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'blender':bpy.app.version_string,'missing':['red-grunge-background.jpg'],'sun':{'energy':1.65,'directionZUp':[.6601681,.0790882,-.7469426]},'note':'Source geometry and packed glass maps. Eevee NPR shaders adapted in studio-materials.js. Wall deliberately replaced with seamless charcoal plaster. Source file untouched.'},indent=2))
print('EXPORT_COMPLETE')

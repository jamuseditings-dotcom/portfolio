"""Native Eevee scroll frames. Original materials and source file remain untouched."""
import bpy,sys,json,time,math,hashlib
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
from PIL import Image,ImageDraw
import numpy as np
src=Path(sys.argv[1]);texture=Path(sys.argv[2])
root=Path(__file__).resolve().parents[1];out=root/'dist/assets/studio/frames';out.mkdir(parents=True,exist_ok=True)
temporary=Path(sys.argv[3]);temporary.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(src),load_ui=False,use_scripts=False)
s=bpy.context.scene;s.frame_set(88)
source_sha=hashlib.sha256(src.read_bytes()).hexdigest()
im=bpy.data.images.get('Color.jpg.001')
if im and not im.has_data:im.filepath=str(texture);im.reload()
source_materials={m.name:m.node_tree.as_pointer() for m in bpy.data.materials if m.use_nodes}
original=s.camera;desk_matrix=original.matrix_world.copy();desk_pos=desk_matrix.translation.copy();desk_q=desk_matrix.to_quaternion();desk_look=desk_pos+desk_q@Vector((0,0,-3))
cam_data=original.data.copy();cam_data.animation_data_clear();cam_data.dof.use_dof=False
cam=bpy.data.objects.new('Portfolio render camera',cam_data);s.collection.objects.link(cam);s.camera=cam
s.render.resolution_x=1280;s.render.resolution_y=720;s.render.resolution_percentage=100
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.image_settings.color_depth='8'
s.render.threads_mode='FIXED';s.render.threads=8;s.eevee.taa_render_samples=4
s.render.use_motion_blur=False;s.render.use_compositing=True;s.render.film_transparent=False
def flat(name,col):
 m=bpy.data.materials.new('Portfolio '+name);m.use_nodes=True;t=m.node_tree;t.nodes.clear();e=t.nodes.new('ShaderNodeEmission');e.inputs['Color'].default_value=(*col,1);e.inputs['Strength'].default_value=1;o=t.nodes.new('ShaderNodeOutputMaterial');t.links.new(e.outputs[0],o.inputs['Surface']);return m
ink=flat('Ink',(.003,.003,.003));paper=flat('Paper',(.56,.51,.37))
def cube(name,loc,scale,mat):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name='Portfolio '+name;o.scale=scale;o.data.materials.append(mat);return o
projects=[]
for name,x,z,a in [('megaverse',-1.99,4.4,-.035),('aavaasaa',-1.23,7.3,.025),('caliber',-1.86,10.2,-.025)]:
 frame=cube('frame '+name,(x,1.19,z),(3.02,.035,1.76),ink);frame.rotation_euler.y=a
 corners=[[x+u*1.45*math.cos(a)+v*.815625*math.sin(a),1.165,z-u*1.45*math.sin(a)+v*.815625*math.cos(a)] for u,v in [(-1,-1),(1,-1),(1,1),(-1,1)]]
 projects.append({'id':name,'center':Vector((x,1.165,z)),'corners':corners})
 for side in [-1,1]:
  tape=cube('tape '+name,(x+side*1.27,1.14,z+.84),(.29,.015,.09),paper);tape.rotation_euler.y=side*.3
phone=Vector((-.49,-.86,1.439));body=cube('phone',phone,(.30,.57,.035),ink)
bpy.context.view_layer.objects.active=body;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
b=body.modifiers.new('Rounded phone corners','BEVEL');b.width=.026;b.segments=4;body.modifiers.new('Phone normals','WEIGHTED_NORMAL')
phone_corners=[list(phone+Vector((x,y,.020))) for x,y in [(-.134,.258),(.134,.258),(.134,-.258),(-.134,-.258)]]
o=s.objects['screen.001'];polys=[p for p in o.data.polygons if o.data.materials[p.material_index] and o.data.materials[p.material_index].name=='Material.107']
pts=[o.matrix_world@o.data.vertices[i].co for p in polys for i in p.vertices]
xmin,xmax=min(p.x for p in pts),max(p.x for p in pts);zmin,zmax=min(p.z for p in pts),max(p.z for p in pts)
bottom=min(pts,key=lambda p:p.z).y;top=max(pts,key=lambda p:p.z).y
screen_corners=[[xmin,top-.002,zmax],[xmax,top-.002,zmax],[xmax,bottom-.002,zmin],[xmin,bottom-.002,zmin]]
center=Vector(((xmin+xmax)/2,(top+bottom)/2,(zmin+zmax)/2));normal=Vector((0,-(zmax-zmin),top-bottom)).normalized()
distance=(xmax-xmin)/(2*math.tan(cam_data.angle_x/2))*.985;start=center+normal*distance
def ease(v):v=max(0,min(1,v));return v*v*v*(v*(v*6-15)+10)
def lerp(a,b,t):return a.lerp(b,t)
def wall_pose(i):
 look=projects[i]['center'];return look+Vector((0,-3.8,.10)),look.copy()
def pose(p):
 pos=start.copy();look=center.copy()
 if p>.16:
  t=ease((p-.16)/.19);pos=lerp(start,desk_pos,t);pos.x-=.48*math.sin(math.pi*t);look=lerp(center,desk_look,t)
 if .35<=p<=.49:pos=desk_pos.copy();look=desk_look.copy()
 if p>.49:
  t=ease((p-.49)/.10);a,b=wall_pose(0);pos=lerp(desk_pos,a,t);look=lerp(desk_look,b,t)
 if p>.63:
  t=ease((p-.63)/.06);a,b=wall_pose(0);c,d=wall_pose(1);pos=lerp(a,c,t);look=lerp(b,d,t)
 if p>.73:
  t=ease((p-.73)/.06);a,b=wall_pose(1);c,d=wall_pose(2);pos=lerp(a,c,t);look=lerp(b,d,t)
 if p>.81:
  t=ease((p-.81)/.10);a,b=wall_pose(2);pos=lerp(a,desk_pos,t);look=lerp(b,desk_look,t)
 if p>.91:
  t=ease((p-.91)/.075);look=lerp(desk_look,phone,t);pos=lerp(desk_pos,phone+Vector((0,-.24,1.15)),t)
 return pos,look
def project(pt):
 v=world_to_camera_view(s,cam,Vector(pt));return [round(v.x,7),round(1-v.y,7),round(v.z,5)]
segments=[(.16,.35,42),(.35,.49,18),(.49,.59,24),(.59,.63,1),(.63,.69,18),(.69,.73,1),(.73,.79,18),(.79,.81,1),(.81,.91,30),(.91,.985,22),(.985,1,1)]
values=[]
for a,b,n in segments:values.extend(a+(b-a)*i/n for i in range(n))
values.append(1.0);values=sorted(set(values[::2]+[.16,.35,.49,.59,.63,.69,.73,.79,.81,.91,.985,1.0]))
entries=[]
for idx,p in enumerate(values):
 source_frame=round(1+199*min(1,max(0,(p-.16)/.33)));s.frame_set(source_frame)
 pos,look=pose(p);cam.location=pos;cam.rotation_euler=(look-pos).to_track_quat('-Z','Y').to_euler();bpy.context.view_layer.update()
 head=s.objects['ME'].pose.bones.get('mixamorig:HeadTop_End');hp=s.objects['ME'].matrix_world@head.head if head else Vector((-2,-1.4,2.5))
 entry={'p':round(p,7),'file':f'{idx:03d}.webp','screen':[project(c) for c in screen_corners],'projects':[[project(c) for c in q['corners']] for q in projects],'phone':[project(c) for c in phone_corners],'head':project(hp),'sourceFrame':source_frame}
 if .16<=p<=.49 or .885<p<.93:entry['mask']=f'{idx:03d}-mask.webp'
 entries.append(entry)
meta={'source':src.name,'sha256':source_sha,'width':1280,'height':720,'materials':'Original Eevee node trees; no shader replacements','camera':'Close source-camera reveal, fixed scroll path','frames':entries}
(out.parent/'rendered-scene.json').write_text(json.dumps(meta,separators=(',',':')))
def mask_frame(dest):
 dg=bpy.context.evaluated_depsgraph_get();proj=cam.calc_matrix_camera(dg,x=1280,y=720);view=cam.matrix_world.inverted()
 mask=Image.new('RGBA',(1280,720),(0,0,0,0));draw=ImageDraw.Draw(mask)
 for name in ['CHAR','CHAIR']:
  o=s.objects.get(name)
  if not o:continue
  ev=o.evaluated_get(dg);mesh=ev.to_mesh();mesh.calc_loop_triangles()
  coords=np.empty(len(mesh.vertices)*3,dtype=np.float32);mesh.vertices.foreach_get('co',coords);coords=coords.reshape(-1,3)
  verts=np.ones((len(coords),4),dtype=np.float32);verts[:,:3]=coords
  clip=verts@np.asarray(proj@view@ev.matrix_world,dtype=np.float32).T
  valid=clip[:,3]>.01;ndc=clip[:,:2]/np.maximum(clip[:,3:4],.00001);xy=(ndc+1)*np.array([640,360]);xy[:,1]=720-xy[:,1]
  triangles=np.empty(len(mesh.loop_triangles)*3,dtype=np.int32);mesh.loop_triangles.foreach_get('vertices',triangles);triangles=triangles.reshape(-1,3)
  for tri in triangles:
   if not valid[tri].all():continue
   p=xy[tri]
   if p[:,0].max()<0 or p[:,0].min()>1280 or p[:,1].max()<0 or p[:,1].min()>720:continue
   draw.polygon([tuple(v) for v in p],fill=(255,255,255,255))
  ev.to_mesh_clear()
 mask.save(dest,lossless=True,method=4)
# Encode each completed frame immediately. Resume from durable WebP assets.
for idx,p in enumerate(values):
 entry=entries[idx];dest=out/entry['file'];mask_dest=out/entry['mask'] if 'mask' in entry else None
 if dest.exists() and (not mask_dest or mask_dest.exists()):continue
 s.frame_set(entry['sourceFrame']);pos,look=pose(p);cam.location=pos;cam.rotation_euler=(look-pos).to_track_quat('-Z','Y').to_euler();bpy.context.view_layer.update()
 if mask_dest and not mask_dest.exists():mask_frame(mask_dest)
 if not dest.exists():
  key=any(abs(p-k)<.00001 for k in [.16,.35,.49,.59,.63,.69,.73,.79,.81,.91,.985,1.0])
  s.eevee.taa_render_samples=12 if key else 4;s.render.resolution_percentage=100 if key or .35<=p<=.49 else 75
  png=temporary/f'{idx:03d}.png';s.render.filepath=str(png);started=time.time();bpy.ops.render.render(write_still=True)
  with Image.open(png) as im:im.save(dest,format='WEBP',quality=90,method=4)
  print('FRAME_DONE',idx,len(values),round(time.time()-started,2),flush=True)
assert all(bpy.data.materials[n].node_tree.as_pointer()==ptr for n,ptr in source_materials.items())
assert hashlib.sha256(src.read_bytes()).hexdigest()==source_sha
print('SOURCE_UNCHANGED',source_sha,flush=True)

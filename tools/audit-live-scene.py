import bpy,json,sys
bpy.ops.wm.open_mainfile(filepath=sys.argv[1],load_ui=False,use_scripts=False)
s=bpy.context.scene;s.frame_set(88)
def value(v):
 try:return list(v)
 except:return v if isinstance(v,(str,int,float,bool)) else str(v)
def tree(t,depth=0):
 return {'nodes':[{'name':n.name,'type':n.bl_idname,'inputs':{i.name:value(i.default_value) for i in n.inputs if hasattr(i,'default_value') and not i.is_linked},'image':n.image.name if getattr(n,'image',None) else None,'ramp':[(e.position,list(e.color)) for e in n.color_ramp.elements] if hasattr(n,'color_ramp') else None,'operation':getattr(n,'operation',None),'blend_type':getattr(n,'blend_type',None),'group':tree(n.node_tree,depth+1) if n.type=='GROUP' and depth<2 else None} for n in t.nodes],'links':[(l.from_node.name,l.from_socket.name,l.to_node.name,l.to_socket.name) for l in t.links]}
print('AUDIT_JSON',json.dumps({'materials':{m.name:tree(m.node_tree) for m in bpy.data.materials if m.use_nodes and m.users},'lights':[{'name':o.name,'type':o.data.type,'energy':o.data.energy,'color':list(o.data.color),'size':getattr(o.data,'size',0),'matrix':[list(r) for r in o.matrix_world]} for o in s.objects if o.type=='LIGHT'],'camera':{'matrix':[list(r) for r in s.camera.matrix_world],'lens':s.camera.data.lens},'images':[{'name':i.name,'size':list(i.size),'packed':bool(i.packed_file)} for i in bpy.data.images],'objects':[(o.name,o.type) for o in s.objects],'color':{'view':s.view_settings.view_transform,'look':s.view_settings.look,'exposure':s.view_settings.exposure,'gamma':s.view_settings.gamma}}),flush=True)

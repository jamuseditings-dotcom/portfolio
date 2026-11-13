"""Recover an original packed image from the user's scene backup, without resaving it."""
import bpy,sys,hashlib
from pathlib import Path
bpy.ops.wm.open_mainfile(filepath=sys.argv[1],load_ui=False,use_scripts=False)
for im in bpy.data.images:
    if im.name.startswith('Color.jpg') and im.packed_file:
        data=im.packed_file.data
        assert hashlib.sha256(data).hexdigest()=='fb85d86cf2df36496514b29a275e31c70dd8268055a2e9f191db855ffd77719c'
        output=Path(sys.argv[2]);output.parent.mkdir(parents=True,exist_ok=True);output.write_bytes(data)
        print('Recovered original packed texture',flush=True)
        break
else:
    raise RuntimeError('Original packed texture not found')

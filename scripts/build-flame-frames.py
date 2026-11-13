"""Six cels from the original vector, preserving the head and all internal cutouts."""
from pathlib import Path
import math,re,copy,xml.etree.ElementTree as ET
assets=Path(__file__).resolve().parents[1]/'dist/assets'
ET.register_namespace('', 'http://www.w3.org/2000/svg')
source=ET.parse(assets/'meteor-layer.svg').getroot()
main=list(source[0])[-1]
outer,inner=main.get('d').split('ZM',1)
tokens=re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)',outer)
points=[];x=y=0;i=0;cmd=None
while i<len(tokens):
 if tokens[i].isalpha():cmd=tokens[i];i+=1;continue
 if cmd in ('M','l','L'):
  a,b=float(tokens[i]),float(tokens[i+1]);i+=2
  x,y=(x+a,y+b) if cmd=='l' else (a,b)
 elif cmd=='h':x+=float(tokens[i]);i+=1
 elif cmd=='v':y+=float(tokens[i]);i+=1
 else:raise ValueError(cmd)
 points.append((x,y))
for frame in range(6):
 root=copy.deepcopy(source);root.set('width','1200');root.set('height','1200')
 if frame:
  phase=frame*math.tau/6
  def warp(x,y):
   weight=max(0,min(1,(x-1640)/1270))
   # Travelling bend only in the trailing edge, within 4% of its length.
   dx=weight*(36*math.sin(phase)+20*math.sin(phase*1.0+x*.011))
   dy=weight*(54*math.sin(phase-x*.006)+18*math.sin(phase+x*.019))
   return x+dx,y+dy
  coords=[warp(x,y) for x,y in points]
  path='M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in coords)+'ZM'+inner
  list(root[0])[-1].set('d',path)
 ET.ElementTree(root).write(assets/f'flame-{frame+1}.svg',encoding='unicode')
# Each letter retains precisely the original polygon geometry.
letters=ET.parse(assets/'letters-layer.svg').getroot()
polys=list(letters[0]);start=0
for name,count in zip('jamu',[2,3,4,3]):
 root=ET.Element('{http://www.w3.org/2000/svg}svg',{'viewBox':'0 0 5000 5000','width':'1200','height':'1200'})
 for poly in polys[start:start+count]:root.append(copy.deepcopy(poly))
 start+=count;ET.ElementTree(root).write(assets/f'letter-{name}.svg',encoding='unicode')
print('Six flame SVG cels and four original letter layers created.')

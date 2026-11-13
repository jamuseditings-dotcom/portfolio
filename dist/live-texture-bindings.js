// User-supplied originals. Only image bindings change; keep shader parameters intact.
export const suppliedTextures = Object.freeze({
 'pc.001': 'red-grunge-background.jpg',
 BODY: 'ME-DIFFUSE.jpg',
 dress: 'ME-DIFFUSE.jpg',
 SpiderVerse_Fast: 'Texturelabs_Wood_169XL.png',
 light: 'Texturelabs_Wood_169XL.png',
});

export function bindSuppliedTextures(meta) {
 return {...meta, materials: Object.fromEntries(Object.entries(meta.materials).map(([name, material]) => [
  name, suppliedTextures[name]
   ? {...material, texture: suppliedTextures[name], textureName: suppliedTextures[name]}
   : material,
 ]))};
}

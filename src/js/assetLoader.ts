export const enum BlockType {
  AIR,
  GRASS,
  DIRT,
  MISSING,
}

const imageDefinitions = [
  {src: `./img/tiles/tile_021.png`, key: BlockType.DIRT},
  {src: `./img/tiles/tile_023.png`, key: BlockType.GRASS},
  {src: `./img/missing.png`, key: BlockType.MISSING},
];

export const imageMap: {[key: number]: HTMLImageElement} = {};

const loadImages = () => {
  for (const {src, key} of imageDefinitions) {
    const img = new Image();
    img.onload = () => {
      imageMap[key] = img;
    };
    img.onerror = (error) => {
      console.error(`Incorrect block image paths for ${src}:`, error);
    };
    img.src = src;
  }
};

loadImages();
const imageDefinitions = [
    { src: `./img/tiles/tile_021.png`, key: 2 /* BlockType.DIRT */ },
    { src: `./img/tiles/tile_023.png`, key: 1 /* BlockType.GRASS */ },
    { src: `./img/missing.png`, key: 3 /* BlockType.MISSING */ },
];
export const imageMap = {};
const loadImages = () => {
    for (const { src, key } of imageDefinitions) {
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

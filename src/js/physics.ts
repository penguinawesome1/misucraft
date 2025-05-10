export type Velocity2D = {
  x: number, y: number;
};
export type Position2D = {
  x: number; y: number;
};
export type Size2D = {
  width: number; height: number;
};
export type Hitbox2D = Position2D&Size2D;

export type Velocity3D = {
  x: number, y: number, z: number;
};
export type Position3D = {
  x: number; y: number; z: number;
};
export type Size3D = {
  width: number; height: number; depth: number;
};
export type Hitbox3D = Position3D&Size3D;

export function isCollision2D(hitbox1: Hitbox2D, hitbox2: Hitbox2D) {
  return (
      hitbox1.x < hitbox2.x + hitbox2.width &&
      hitbox1.x + hitbox1.width > hitbox2.x &&
      hitbox1.y < hitbox2.y + hitbox2.height &&
      hitbox1.y + hitbox1.height > hitbox2.y);
}

export function isCollision3D(hitbox1: Hitbox3D, hitbox2: Hitbox3D) {
  return (
      hitbox1.x < hitbox2.x + hitbox2.width &&
      hitbox1.x + hitbox1.width > hitbox2.x &&
      hitbox1.y < hitbox2.y + hitbox2.height &&
      hitbox1.y + hitbox1.height > hitbox2.y &&
      hitbox1.z < hitbox2.z + hitbox2.depth &&
      hitbox1.z + hitbox1.depth > hitbox2.z);
}
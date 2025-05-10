export function isCollision2D(hitbox1, hitbox2) {
    return (hitbox1.x < hitbox2.x + hitbox2.width &&
        hitbox1.x + hitbox1.width > hitbox2.x &&
        hitbox1.y < hitbox2.y + hitbox2.height &&
        hitbox1.y + hitbox1.height > hitbox2.y);
}
export function isCollision3D(hitbox1, hitbox2) {
    return (hitbox1.x < hitbox2.x + hitbox2.width &&
        hitbox1.x + hitbox1.width > hitbox2.x &&
        hitbox1.y < hitbox2.y + hitbox2.height &&
        hitbox1.y + hitbox1.height > hitbox2.y &&
        hitbox1.z < hitbox2.z + hitbox2.depth &&
        hitbox1.z + hitbox1.depth > hitbox2.z);
}

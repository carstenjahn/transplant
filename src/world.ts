import * as THREE from 'three';
export class World {
    public static WORLD_WIDTH=10; // -> coordinates -5..5 are in use
    public static WORLD_HEIGTH=10;

    // Objects teleport from one end of the world to the other - the
    // world's center is the current camera. This design decision makes
    // multiplayer games in the same world impossible, but it's easier
    // for now (compared to the torus implementation).
    public static wrapAroundEndOfWorld(wrapMe:THREE.Object3D, cameraPosition:THREE.Vector3) {
        if(wrapMe.position.x > cameraPosition.x + this.WORLD_WIDTH/2) {
            wrapMe.translateX(-1 * this.WORLD_WIDTH);
        } else if(wrapMe.position.x < cameraPosition.x - this.WORLD_WIDTH/2) {
            wrapMe.translateX(this.WORLD_WIDTH);
        }
        if(wrapMe.position.y > cameraPosition.y + this.WORLD_HEIGTH/2) {
            wrapMe.translateY(-1 * this.WORLD_HEIGTH);
        } else if(wrapMe.position.y < cameraPosition.y - this.WORLD_HEIGTH/2) {
            wrapMe.translateY(this.WORLD_HEIGTH);
        }
    }
}
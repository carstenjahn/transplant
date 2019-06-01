import * as THREE from 'three';
import {Object3D} from "three";
export class World {
    public static WORLD_WIDTH=10; // -> coordinates -5..5 are in use
    public static WORLD_HEIGTH=10;

    // Objects teleport from one end of the world to the other - the
    // world's center is the current camera. This design decision makes
    // multiplayer games in the same world impossible, but it's easier
    // for now (compared to the torus implementation).
    public static wrapAroundEndOfWorld(wrapMe:THREE.Object3D, cameraPosition:THREE.Vector3) {
        
        if(wrapMe.position.x > cameraPosition.x + this.WORLD_WIDTH/2) {
            wrapMe.position.setX(wrapMe.position.x - this.WORLD_WIDTH);
        } else if(wrapMe.position.x < cameraPosition.x - this.WORLD_WIDTH/2) {
            wrapMe.position.setX(wrapMe.position.x + this.WORLD_WIDTH);
        }
        if(wrapMe.position.y > cameraPosition.y + this.WORLD_HEIGTH/2) {
            wrapMe.position.setY(wrapMe.position.y - this.WORLD_HEIGTH);
        } else if(wrapMe.position.y < cameraPosition.y - this.WORLD_HEIGTH/2) {
            wrapMe.position.setY(wrapMe.position.y + this.WORLD_HEIGTH);
        }
    }

    // returns null or a colliding obstacle
    public static collision(detectFrom:THREE.Mesh, obstacles:Object3D[]): Object3D {
        // helpful example: https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
        const shipGeometry = detectFrom.geometry as THREE.Geometry;
        const originPoint = detectFrom.position.clone();
        for (var vertexIndex = 0; vertexIndex <  shipGeometry.vertices.length; vertexIndex++)
        {
            const localVertex = shipGeometry.vertices[vertexIndex].clone();
            const globalVertex = localVertex.applyMatrix4( detectFrom.matrix );
            const directionVector = globalVertex.sub( detectFrom.position );

            const ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
            const collisionResults = ray.intersectObjects( obstacles );
            // it's a collision if the nearest colliding obstacle (collisionResults[0])
            // is nearer than the ship's vertex that we're testing
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
                return collisionResults[0].object;
            }
        }
        return null;
    }

    public static visibleObjects(camera:THREE.Camera, objects:THREE.Mesh[]): THREE.Mesh[] {
        var frustum = new THREE.Frustum();
        var cameraViewProjectionMatrix = new THREE.Matrix4();
        camera.updateMatrixWorld(true);
        camera.matrixWorldInverse.getInverse( camera.matrixWorld );
        cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        frustum.setFromMatrix( cameraViewProjectionMatrix );
        return objects.filter( (o) => frustum.intersectsObject(o));
    }

}
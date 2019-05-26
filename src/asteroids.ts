import * as THREE from 'three';

export class Asteroids {

    private allAsteroids = new THREE.Group();

    constructor() {
        for (var i = 0; i < 1000; i++) {
            this.allAsteroids.add(this.randomBox());
        }
    }

    randomBox(): THREE.Mesh {
        const geometry = new THREE.BoxGeometry( 0.02, 0.02, 0.02 );
        const material = new THREE.MeshNormalMaterial();

        const mesh = new THREE.Mesh( geometry, material );
        mesh.translateX((Math.random() - 0.5)*20);
        mesh.translateY((Math.random() - 0.5)*20);
        return mesh;
    }

    public addToScene(scene:THREE.Scene) {
        scene.add(this.allAsteroids);
    }

}
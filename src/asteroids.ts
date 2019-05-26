import * as THREE from 'three';

export class Asteroids {

    private allAsteroids = new THREE.Group();

    constructor() {
        for (var i = 0; i < 1000; i++) {
            this.allAsteroids.add(new Asteroid());
        }
    }

    public addToScene(scene:THREE.Scene) {
        scene.add(this.allAsteroids);
    }

    public getAsteroids():THREE.Object3D[] {
        return this.allAsteroids.children;
    }

    public nextFrame() {
        this.allAsteroids.children.forEach( (e) => (<Asteroid> e).nextFrame());
    }

}

class Asteroid extends THREE.Mesh {
    private speedX:number;
    private speedY:number;

    constructor() {
        const geometry = new THREE.BoxGeometry( 0.02, 0.02, 0.02 );
        const material = new THREE.MeshNormalMaterial();
        super( geometry, material );
        this.translateX((Math.random() - 0.5)*20);
        this.translateY((Math.random() - 0.5)*20);

        this.speedX = (Math.random()-0.5)*0.001;
        this.speedY = (Math.random()-0.5)*0.001;
    }

    public nextFrame() {
        this.translateX(this.speedX);
        this.translateY(this.speedY);
    }

}
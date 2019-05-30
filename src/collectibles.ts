import * as THREE from 'three';
import {World} from './world';
import {randomNum} from './util';

export class Collectibles {
    private all: Collectible[] = [];
    private scene;

    constructor() {
        for (var i = 0; i < 50; i++) {
            this.all.push(new Collectible());
        }
    }

    public addToScene(scene: THREE.Scene) {
        scene.add(...this.all);
        this.scene = scene;
    }

    public nextFrame(camera: THREE.Camera) {
        this.all.forEach((c) => c.nextFrame(camera.position));
    }

    public getVisibleCollectibles(camera: THREE.Camera): Collectible[] {
        const v = <Collectible[]>World.visibleObjects(camera, this.all);
        if (v.length == 50)
            return [];
        return v;
    }

    public destroyCollectiblesOnObstacleCollision(camera: THREE.Camera, obstacles: THREE.Object3D[]) {
        this.getVisibleCollectibles(camera).forEach((c) => {
            if (World.collision(c, obstacles) !== null) {
                this.scene.remove(c);
                this.all = this.all.filter((e) => e !== c);
            }
        });
    }

    public bonusForCollection(camera: THREE.Camera, ship: THREE.Mesh) {
        const collectibles = this.getVisibleCollectibles(camera);
        const collectedMe = <Collectible>World.collision(ship, collectibles);
        if (collectedMe !== null) {
            this.scene.remove(collectedMe);
            this.all = this.all.filter((e) => e !== collectedMe);
            // and increase the score...
        }
    }
}

class Collectible extends THREE.Mesh {
    private speedX: number;
    private speedY: number;

    constructor() {
        const geometry = new THREE.TorusGeometry(0.02, 0.004);
        const material = new THREE.MeshBasicMaterial({color: 0xbbbb00});
        super(geometry, material);
        this.position.setX((Math.random() - 0.5) * World.WORLD_WIDTH);
        this.position.setY((Math.random() - 0.5) * World.WORLD_HEIGTH)
        this.speedX = randomNum(-0.0005, 0.0005);
        this.speedY = randomNum(-0.0005, 0.0005);
    }

    public nextFrame(cameraPosition: THREE.Vector3) {
        this.position.setX(this.position.x + this.speedX);
        this.position.setY(this.position.y + this.speedY);
        World.wrapAroundEndOfWorld(this, cameraPosition);
        this.rotateX(this.speedX * 10);
        this.rotateY(this.speedX * 10);
        this.rotateZ(this.speedX * 10);
    }
}
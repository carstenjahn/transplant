import * as THREE from 'three';
import {World} from  './world';
import {Vector3} from "three";

export class Asteroids {

    private allAsteroids = new THREE.Group();

    constructor() {
        for (var i = 0; i < 300; i++) {
            this.allAsteroids.add(new Asteroid());
        }
    }

    public addToScene(scene:THREE.Scene) {
        scene.add(this.allAsteroids);
    }

    public getAsteroids():THREE.Object3D[] {
        return this.allAsteroids.children;
    }

    public nextFrame(camera:THREE.Camera) {
        this.allAsteroids.children.forEach( (e) => (<Asteroid> e).nextFrame(camera.position));

        const largerAsteroids = (this.allAsteroids.children as Asteroid[]).filter( s => s.getSize() > 0.03);
        const visibleAsteroids = World.visibleObjects(camera, largerAsteroids);
        if(visibleAsteroids.length < 100) { // TODO on first render, all of them are visible
            visibleAsteroids.forEach((a) => {
                const allButMyself = visibleAsteroids.filter(v => v !== a);
                const collidingAsteroid = World.collision((a as Asteroid), allButMyself);
                if (collidingAsteroid !== null) {
                    //console.log('coll', visibleAsteroids.length, allButMyself.length,  a, World.collision(a as THREE.Mesh, allButMyself) );
                    this.allAsteroids.remove(a);
                    this.allAsteroids.remove(collidingAsteroid);
                    this.addSplinters(a.position);
                }
            });
        }
    }


    private addSplinters(position:THREE.Vector3) {
        // should set the splinter direction according to colliding object's directions
        for (var i = 0; i < 10; i++) {
            const a = new Asteroid(true);
            this.allAsteroids.add(a);
            a.position.setX(position.x + (Math.random()-0.5)*0.03);
            a.position.setY(position.y + (Math.random()-0.5)*0.03);
        }
    }

}

class Asteroid extends THREE.Mesh {
    private speedX:number;
    private speedY:number;
    private size:number;

    constructor(splitter=false) {
        const size = splitter ? 0.01 : 0.02 + Math.random()*0.05;
        const geometry = new THREE.OctahedronGeometry( size, 0 );
        const material = new THREE.MeshNormalMaterial();
        super( geometry, material );
        this.position.setX((Math.random() - 0.5)*World.WORLD_WIDTH);
        this.position.setY((Math.random() - 0.5)*World.WORLD_HEIGTH);

        this.size = size;
        this.speedX = (Math.random()-0.5)*0.003;
        this.speedY = (Math.random()-0.5)*0.003;
    }

    public nextFrame(cameraPosition:THREE.Vector3) {
        this.position.setX(this.position.x + this.speedX);
        this.position.setY(this.position.y + this.speedY);
        World.wrapAroundEndOfWorld(this, cameraPosition);
        this.rotateX(this.speedX*10);
        this.rotateY(this.speedX*10);
        this.rotateZ(this.speedX*10);
    }

    public getSize():number {
        return this.size;
    }

}
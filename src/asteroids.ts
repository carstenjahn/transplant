import * as THREE from 'three';
import {World} from './world';
import {Vector3} from "three";


function avg(a: number, b: number) {
    return (a + b) / 2;
}

function randomNum(from: number, to: number) {
    return from + Math.random() * (to - from);
}

function randomInt(from: number, to: number) {
    return Math.floor(randomNum(from, to + 1));
}

export class Asteroids {

    private allAsteroids = new THREE.Group();

    constructor() {
        for (var i = 0; i < 500; i++) {
            this.allAsteroids.add(new Asteroid());
        }
    }

    public addToScene(scene: THREE.Scene) {
        scene.add(this.allAsteroids);
    }

    public getAsteroids(): Asteroid[] {
        return <Asteroid[]>this.allAsteroids.children;
    }

    public getCollisionEnabledAsteroids(): Asteroid[] {
        const largerAsteroids = this.getAsteroids().filter(s => s.getSize() > Asteroid.VERYSMALL);
        return largerAsteroids;
    }

    private static avg(a: number, b: number) {
        return (a + b) / 2;
    }

    public nextFrame(camera: THREE.Camera) {
        {
            const all = this.allAsteroids.children as Asteroid[];
            all.forEach((e) => e.nextFrame(camera.position));

            all.forEach((e) => {
                if (e.isEndOfLife()) {
                    this.allAsteroids.remove(e);
                }
            });
        }

        const largerAsteroids = this.getCollisionEnabledAsteroids();
        const visibleAsteroids = World.visibleObjects(camera, largerAsteroids);
        if (visibleAsteroids.length < 100) { // TODO on first render, all of them are visible
            visibleAsteroids.map(a => a as Asteroid).forEach((a) => {
                const allButMyself = visibleAsteroids.filter(v => v !== a);
                const collidingAsteroid = <Asteroid>World.collision(a, allButMyself);
                if (collidingAsteroid !== null && !(collidingAsteroid.isNoAsteroidCollision() && a.isNoAsteroidCollision())) {
                    //console.log('coll', visibleAsteroids.length, allButMyself.length,  a, World.collision(a as THREE.Mesh, allButMyself) );
                    this.allAsteroids.remove(a);
                    this.allAsteroids.remove(collidingAsteroid);
                    this.addSplinters(a, collidingAsteroid);
                }

            });
        }
    }


    private addSplinters(c1: Asteroid, c2: Asteroid) {
        const n = Math.round(randomNum(3, 4));
        for (var i = 0; i < n; i++) {
            const a = Asteroid.createSplinter(c1, c2);
            this.allAsteroids.add(a);
        }
    }

}

class Asteroid extends THREE.Mesh {
    public static VERYSMALL = 0.02;

    private speedX: number;
    private speedY: number;
    private size: number;
    private noAsteroidCollision: number;
    private lifetime: number;

    constructor(size = undefined) {
        if (size === undefined) {
            size = 0.02 + Math.random() * 0.05;
            if (Math.random() > 0.95) {
                size *= 2;
            }
        }
        const geometry = new THREE.OctahedronGeometry(size, 0);
        const material = size > Asteroid.VERYSMALL ?
            new THREE.MeshNormalMaterial() :
            new THREE.MeshBasicMaterial({color: 0x333333});
        super(geometry, material);
        this.position.setX((Math.random() - 0.5) * World.WORLD_WIDTH);
        this.position.setY((Math.random() - 0.5) * World.WORLD_HEIGTH);

        this.size = size;
        this.speedX = randomNum(-0.0015, 0.0015);
        this.speedY = randomNum(-0.0015, 0.0015);
        this.noAsteroidCollision = 0;
        this.lifetime = -1;
    }

    public static createSplinter(c1: Asteroid, c2: Asteroid): Asteroid {
        const a = new Asteroid(avg(c1.size, c2.size) * randomNum(0.3, 0.8));
        a.speedX = randomNum(c1.speedX, c2.speedX) * avg(c1.size, c2.size) / a.size * 0.5;
        a.speedY = randomNum(c1.speedY, c2.speedY) * avg(c1.size, c2.size) / a.size * 0.5;
        const x = avg(c1.position.x, c2.position.x) + a.size * randomNum(-2, 2);
        const y = avg(c1.position.y, c2.position.y) + a.size * randomNum(-2, 2);
        a.position.setX(x);
        a.position.setY(y);
        a.noAsteroidCollision = randomInt(100, 250);
        if (a.size <= Asteroid.VERYSMALL) {
            a.lifetime = randomInt(500, 1500);
        }
        return a;
    }

    public nextFrame(cameraPosition: THREE.Vector3) {
        this.position.setX(this.position.x + this.speedX);
        this.position.setY(this.position.y + this.speedY);
        World.wrapAroundEndOfWorld(this, cameraPosition);
        this.rotateX(this.speedX * 10);
        this.rotateY(this.speedX * 10);
        this.rotateZ(this.speedX * 10);
        this.noAsteroidCollision = this.noAsteroidCollision > 0 ? this.noAsteroidCollision - 1 : 0;
        if (this.lifetime !== -1) {
            this.lifetime = this.lifetime > 0 ? this.lifetime - 1 : 0;
        }
    }

    public getSize(): number {
        return this.size;
    }

    public isNoAsteroidCollision(): boolean {
        return this.size <= Asteroid.VERYSMALL || this.noAsteroidCollision > 0;
    }

    public isEndOfLife(): boolean {
        return this.lifetime === 0;
    }

}
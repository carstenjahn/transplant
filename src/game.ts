import * as THREE from 'three';
import {ShipControl, ShipAndCamera} from  './shipcontrol';
import {Asteroids} from  './asteroids';

export default class Game {
    private camera;
    private renderer;
    private scene;
    private shipControl = new ShipControl();
    private shipAndCamera = new ShipAndCamera();
    private asteroids = new Asteroids();

    constructor() {
        //console.log('the answer to life, the universe, and everything is: ', config.answerToLifeTheUniverseAndEverything);

        this.scene = new THREE.Scene();
        this.shipAndCamera.addToScene(this.scene);
        this.asteroids.addToScene(this.scene);
        this.camera = this.shipAndCamera.getCamera();

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        window.addEventListener('keydown', (e) => this.handleKeyDown(e), false);
        window.addEventListener('keyup', (e) => this.handleKeyUp(e), false);

        requestAnimationFrame( () => this.animate() );
    }



    handleKeyDown(event:KeyboardEvent) {
        //console.log('down', event.key);
        switch (event.key) {
            case 'ArrowLeft':
                this.shipControl.turn.steeringA();
                break;
            case 'ArrowRight':
                this.shipControl.turn.steeringB();
                break;
            case 'ArrowUp':
                this.shipControl.forward.steeringA();
                break;
            case 'ArrowDown':
                this.shipControl.forward.steeringB();
                break;
        }
    }

    handleKeyUp(event:KeyboardEvent) {
        //console.log('up', event.key);
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                this.shipControl.turn.noSteer();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                this.shipControl.forward.noSteer();
                break;
        }
    }

    private collision():boolean {
        // helpful example: https://blog.webmaestro.fr/collisions-detection-three-js-raycasting/

        // Very simple implementation. Does not take ship's shape into account.
        // Does not work at high speeds; maybe the vector going in the forward path
        // should be longer when speed is high.

        const rays = [
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(-1, 0, -1),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 0, 1)
        ];
        const caster = new THREE.Raycaster();
        const obstacles = this.asteroids.getAsteroids();
        for (var i = 0; i < rays.length; i += 1) {
            // We reset the raycaster to this direction
            caster.set(this.shipAndCamera.getShip().position, rays[i].divideScalar(1.07));
            // Test if we intersect with any obstacle mesh
            const collisions = caster.intersectObjects(obstacles);
            if(collisions.length > 0) {
                return true;
            }
        }
    }


    animate() {
        requestAnimationFrame( () => this.animate() );

        this.shipControl.nextFrame();
        this.asteroids.nextFrame();

        this.shipAndCamera.applyShipControl(this.shipControl);
        if(this.collision()) {
            console.log('coll');
            this.shipAndCamera.shipCollided();
        }

        this.renderer.render( this.scene, this.camera );
    }

}

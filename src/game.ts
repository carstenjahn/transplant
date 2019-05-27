import * as THREE from 'three';
import {ShipControl, ShipAndCamera} from  './shipcontrol';
import {Asteroids} from  './asteroids';
import {World} from  './world';

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




    animate() {
        requestAnimationFrame( () => this.animate() );

        this.shipControl.nextFrame();
        this.asteroids.nextFrame(this.shipAndCamera.getCamera());

        this.shipAndCamera.applyShipControl(this.shipControl);
        if(World.collision(this.shipAndCamera.getShip(), this.asteroids.getAsteroids()) !== null) {
            this.shipAndCamera.shipCollided();
        }

        this.renderer.render( this.scene, this.camera );
    }

}

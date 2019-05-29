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
    private paused = false;

    constructor() {
        //console.log('the answer to life, the universe, and everything is: ', config.answerToLifeTheUniverseAndEverything);

        this.scene = new THREE.Scene();
        this.shipAndCamera.addToScene(this.scene);
        this.asteroids.addToScene(this.scene);
        this.camera = this.shipAndCamera.getCamera();

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        window.addEventListener('keydown', (event) => this.handleKeyDown(event), false);
        window.addEventListener('keyup', (event) => this.handleKeyUp(event), false);
        window.addEventListener('resize', () => { 
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight); 
        });

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
            case 'p':
                this.paused = !this.paused;
                if(!this.paused)
                    requestAnimationFrame( () => this.animate() );
        }
    }




    animate() {
        if(!this.paused)
            requestAnimationFrame( () => this.animate() );

        //console.time('game');
        this.shipControl.nextFrame();
        this.asteroids.nextFrame(this.shipAndCamera.getCamera());

        this.shipAndCamera.applyShipControl(this.shipControl);
        if(World.collision(this.shipAndCamera.getShip(), this.asteroids.getCollisionEnabledAsteroids()) !== null) {
            this.shipAndCamera.shipCollided();
        }
        //console.timeEnd('game'); - around 10ms currently

        this.renderer.render( this.scene, this.camera );
    }

}

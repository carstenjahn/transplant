import * as THREE from 'three';
import * as Stats from 'stats.js';
import {ShipControl, ShipAndCamera} from  './shipcontrol';
import {Asteroids} from  './asteroids';
import {World} from  './world';

export default class Game {
    private asteroids = new Asteroids();
    private camera;
    private renderer;
    private scene;
    private shipControl = new ShipControl();
    private shipAndCamera = new ShipAndCamera();
    private stats;

    constructor() {
        //console.log('the answer to life, the universe, and everything is: ', config.answerToLifeTheUniverseAndEverything);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000009 );

        this.shipAndCamera.addToScene(this.scene);
        this.asteroids.addToScene(this.scene);
        this.camera = this.shipAndCamera.getCamera();

        const ambientLight = new THREE.AmbientLight( 0x222222 );
        this.scene.add( ambientLight );

        const directionalLight = new THREE.DirectionalLight( 0xffffcc, 1 );
        directionalLight.position.set(0, 0, 0);
        directionalLight.target = this.shipAndCamera.getShip();
        this.scene.add( directionalLight );

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );

        window.addEventListener('keydown', (event) => this.handleKeyDown(event), false);
        window.addEventListener('keyup', (event) => this.handleKeyUp(event), false);
        window.addEventListener('resize', () => { 
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight); 
        });

        requestAnimationFrame(this.animate.bind(this));
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
        this.stats.begin();

        this.shipControl.nextFrame();
        this.asteroids.nextFrame(this.shipAndCamera.getCamera());

        this.shipAndCamera.applyShipControl(this.shipControl);
        if(World.collision(this.shipAndCamera.getShip(), this.asteroids.getCollisionEnabledAsteroids()) !== null) {
            this.shipAndCamera.shipCollided();
        }

        this.renderer.render( this.scene, this.camera );

        this.stats.end();

        requestAnimationFrame(this.animate.bind(this));
    }
}

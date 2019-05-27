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
        // helpful example: https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
        const shipGeometry = this.shipAndCamera.getShip().geometry as THREE.Geometry;
        const originPoint = this.shipAndCamera.getShip().position.clone();
        const obstacles = this.asteroids.getAsteroids();
        for (var vertexIndex = 0; vertexIndex <  shipGeometry.vertices.length; vertexIndex++)
        {
            const localVertex = shipGeometry.vertices[vertexIndex].clone();
            const globalVertex = localVertex.applyMatrix4( this.shipAndCamera.getShip().matrix );
            const directionVector = globalVertex.sub( this.shipAndCamera.getShip().position );

            const ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
            const collisionResults = ray.intersectObjects( obstacles );
            // it's a collision if the nearest colliding obstacle (collisionResults[0])
            // is nearer than the ship's vertex that we're testing
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
                return true;
            }
        }
        return false;
    }


    animate() {
        requestAnimationFrame( () => this.animate() );

        this.shipControl.nextFrame();
        this.asteroids.nextFrame(this.shipAndCamera.getCamera().position);

        this.shipAndCamera.applyShipControl(this.shipControl);
        if(this.collision()) {
            console.log('coll');
            this.shipAndCamera.shipCollided();
        }

        this.renderer.render( this.scene, this.camera );
    }

}

import * as THREE from 'three';
import Mesh = THREE.Mesh;
import ShipControl from  './shipcontrol' ;

export default class Game {
    private camera;
    private renderer;
    private scene;
    private shipControl = new ShipControl();

    constructor() {
        //console.log('the answer to life, the universe, and everything is: ', config.answerToLifeTheUniverseAndEverything);

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();

        /*geometry = new THREE.BoxGeometry( 0.2, 0.4, 0.2 );
        material = new THREE.MeshNormalMaterial();

        mesh = new THREE.Mesh( geometry, material );*/
        for(var i=0; i<100; i++) {
            this.scene.add( this.randomBox() );
        }

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        window.addEventListener('keydown', (e) => this.handleKeyDown(e), false);
        window.addEventListener('keyup', (e) => this.handleKeyUp(e), false);
        console.log('x');
        requestAnimationFrame( () => this.animate() );
    }

    randomBox(): Mesh {
        const geometry = new THREE.BoxGeometry( 0.02, 0.02, 0.02 );
        const material = new THREE.MeshNormalMaterial();

        const mesh = new THREE.Mesh( geometry, material );
        mesh.translateX((Math.random() - 0.5)*2);
        mesh.translateY((Math.random() - 0.5)*2);
        return mesh;
    }

    handleKeyDown(event:KeyboardEvent) {
        //console.log('down', event.key);
        switch (event.key) {
            case 'ArrowLeft':
                this.shipControl.steeringLeft();
                break;
            case 'ArrowRight':
                this.shipControl.steeringRight();
                break;
        }
    }

    handleKeyUp(event:KeyboardEvent) {
        //console.log('up', event.key);
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                this.shipControl.noSteer();
                break;
        }
    }



    animate() {

        requestAnimationFrame( () => this.animate() );

        // mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;
        //if(this.isBDown) {
        this.shipControl.nextFrame();
            this.camera.rotation.z += this.shipControl.getTurn() * Math.PI / 180;
        //}

        this.renderer.render( this.scene, this.camera );

    }

}

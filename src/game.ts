import * as THREE from 'three';
import {ShipControl, ShipAndCamera} from './shipcontrol';
import {Asteroids} from './asteroids';
import {World} from './world';
import {Collectibles} from "./collectibles";
import {ScoreLives} from "./score";

export default class Game {
    private camera;
    private renderer;
    private scene = new THREE.Scene();
    private scoreLives = new ScoreLives();
    private shipControl = new ShipControl();
    private shipAndCamera = new ShipAndCamera(this.scoreLives);
    private asteroids = new Asteroids();
    private collectibles = new Collectibles(this.scene, this.scoreLives);
    private paused = false;

    constructor() {
        this.shipAndCamera.addToScene(this.scene);
        this.asteroids.addToScene(this.scene);
        this.collectibles.addToScene();
        this.camera = this.shipAndCamera.getCamera();

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'absolute';
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(this.scoreLives.livesElement);
        document.body.appendChild(this.scoreLives.scoreElement);

        window.addEventListener('keydown', (event) => this.handleKeyDown(event), false);
        window.addEventListener('keyup', (event) => this.handleKeyUp(event), false);
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        requestAnimationFrame(() => this.animate());
    }


    handleKeyDown(event: KeyboardEvent) {
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

    handleKeyUp(event: KeyboardEvent) {
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
                if (!this.paused)
                    requestAnimationFrame(() => this.animate());
        }
    }


    animate() {
        if (!this.paused)
            requestAnimationFrame(() => this.animate());

        //console.time('game');
        this.shipControl.nextFrame();
        this.asteroids.nextFrame(this.camera);
        this.collectibles.nextFrame(this.camera);
        this.collectibles.destroyCollectiblesOnObstacleCollision(this.camera, this.asteroids.getCollisionEnabledAsteroids(this.camera));

        this.shipAndCamera.applyShipControl(this.shipControl);
        if (World.collision(this.shipAndCamera.getShip(), this.asteroids.getCollisionEnabledAsteroids(this.camera)) !== null) {
            this.shipAndCamera.shipCollided();
        }
        this.collectibles.bonusForCollection(this.camera, this.shipAndCamera.getShip());
        //console.timeEnd('game'); - around 10ms currently

        this.renderer.render(this.scene, this.camera);
    }

}

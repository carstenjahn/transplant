import * as THREE from 'three';
import * as Stats from 'stats.js';
import {ShipControl, ShipAndCamera} from './shipcontrol';
import {Asteroids} from './asteroids';
import {World} from './world';
import {Collectibles} from "./collectibles";
import {ScoreLives} from "./score";

export default class Game {
    private asteroids = new Asteroids();
    private camera;
    private paused = false;
    private renderer;
    private scene = new THREE.Scene();
    private scoreLives = new ScoreLives();
    private shipControl = new ShipControl();
    private shipAndCamera = new ShipAndCamera(this.scoreLives);
    private collectibles = new Collectibles(this.scene, this.scoreLives);
    private stats;

    constructor() {
        //console.log('the answer to life, the universe, and everything is: ', config.answerToLifeTheUniverseAndEverything);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000009 );

        this.shipAndCamera.addToScene(this.scene);
        this.camera = this.shipAndCamera.getCamera();
        this.asteroids.addToScene(this.scene);
        this.collectibles.addToScene();

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'absolute';
        document.body.appendChild(this.renderer.domElement);

        document.body.appendChild(this.scoreLives.livesElement);
        document.body.appendChild(this.scoreLives.scoreElement);

        this.initEvents();
        this.initLight();
        this.initStats();

        requestAnimationFrame(this.animate.bind(this));
    }

    private initEvents() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event), false);
        window.addEventListener('keyup', (event) => this.handleKeyUp(event), false);
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    private initLight() {
        /*const ambientLight = new THREE.AmbientLight( 0x222222 );
        this.scene.add( ambientLight );*/

        const directionalLight = new THREE.DirectionalLight( 0xffffcc, 3 );
        directionalLight.position.set(0, 0, 0);
        directionalLight.target = new THREE.Object3D;
        directionalLight.target.position.set(1, 1, 0);
        this.scene.add( directionalLight );

        const directionalLight2 = new THREE.DirectionalLight( 0x2233ff, 1 );
        directionalLight.position.set(1, 1, 0);
        directionalLight2.target = directionalLight;
        this.scene.add( directionalLight2 );
    }

    private initStats() {
        this.stats = new Stats();
        // this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this.stats.dom.removeAttribute('style');
        this.stats.dom.className = "stats";
        document.body.appendChild(this.stats.dom);
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
                document.body.classList.toggle('paused');
                if (!this.paused) requestAnimationFrame(this.animate.bind(this));
        }
    }

    animate() {
        this.stats.begin();

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

        this.stats.end();

        if (!this.paused) requestAnimationFrame(this.animate.bind(this));
    }
}

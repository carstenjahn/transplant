import * as THREE from 'three';

class OneDimControl {
    private speed = 0.0;
    private steering = 0;
    private steeringIntensity = 0;
    public steeringA() {
        this.steering = -1;
        this.steeringIntensity = this.steeringIntensity < 3 ? 3 : this.steeringIntensity+0.1;
    }
    public steeringB() {
        this.steering = 1;
        this.steeringIntensity = this.steeringIntensity < 3 ? 3 : this.steeringIntensity+0.1;
    }
    public noSteer() {
        this.steering = 0;
        this.steeringIntensity = 0;
    }

    public nextFrame() {
        this.speed += this.steering*this.steeringIntensity*0.01;
        this.speed *= 0.99;
        this.speed = this.speed > 0 ? Math.min(this.speed, 3) : Math.max(this.speed, -3);
    }

    public getSpeed() : number {
        return this.speed;
    }
}

export class ShipControl {
    public turn = new OneDimControl();
    public forward = new OneDimControl();
    public nextFrame() {
        this.turn.nextFrame();
        this.forward.nextFrame();
    }
}

export class ShipAndCamera {
    private ship:THREE.Mesh;
    private camera:THREE.PerspectiveCamera;
    constructor() {
        const geometry = new THREE.ConeGeometry( 0.05, 0.1, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        this.ship = new THREE.Mesh( geometry, material );
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.z = 1;
    }

    public addToScene(scene:THREE.Scene) {
        scene.add(this.ship);
    }

    public getCamera():THREE.PerspectiveCamera {
        return this.camera;
    }

    public getShip():THREE.Mesh {
        return this.ship;
    }

    public shipCollided() {
        this.ship.material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    }


    public applyShipControl(shipControl:ShipControl) {
        this.camera.rotation.z -= shipControl.turn.getSpeed() * Math.PI / 180;
        this.ship.rotation.z -= shipControl.turn.getSpeed() * Math.PI / 180;
        const forward = shipControl.forward.getSpeed() * -0.01;
        this.ship.translateY(forward);
        this.camera.translateY(forward);


    }
}
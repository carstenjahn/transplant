export default class ShipControl {
    private turn = 0.0;
    private steering = 0;
    private steeringIntensity = 0;
    public steeringLeft() {
        this.steering = -1;
        this.steeringIntensity = this.steeringIntensity < 10 ? 10 : this.steeringIntensity+1;
    }
    public steeringRight() {
        this.steering = 1;
        this.steeringIntensity = this.steeringIntensity < 10 ? 10 : this.steeringIntensity+1;
    }
    public noSteer() {
        this.steering = 0;
        this.steeringIntensity = 0;
    }

    public nextFrame() {
        this.turn += this.steering*this.steeringIntensity*0.01;
        this.turn *= 0.99;
    }

    public getTurn() : number {
        return this.turn;
    }
}
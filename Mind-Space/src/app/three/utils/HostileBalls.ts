import { Body, Material, Sphere, Vec3 } from "cannon-es";

export class HostileBalls {
    private mass = 100;
    private body: Body;

    constructor() {
        this.body = new Body({
            mass: this.mass,
            shape: new Sphere(5),
            position: new Vec3(0,20,0),
            material: new Material({friction: 5, restitution: 1})
        })
    }

    getHostileBallPhysicsBody() : Body{
        return this.body;
    }

    startBallAI() {
        console.log('ball pathing started', this.body.position)
    }

}
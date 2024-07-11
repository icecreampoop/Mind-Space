import { Body, Material, Quaternion, Sphere, Vec3 } from "cannon-es";
import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";

export class HostileBalls {
    private mass = 100;
    private physicsBalldy: Body;
    private timeToMove = 0;
    private ballRadius = 5;
    private ballVisualMesh: Mesh;
    private forwardOffset = new Vector3(0, 1, 1);
    private originPointAINav = new Vector3(0,0,0);

    constructor() {
        this.physicsBalldy = new Body({
            mass: this.mass,
            shape: new Sphere(this.ballRadius),
            position: new Vec3(0, 20, 0),
            material: new Material({ friction: 300, restitution: 0.1 })
        })

        this.ballVisualMesh = new Mesh(
            new SphereGeometry(this.ballRadius, 10, 10),
            new MeshBasicMaterial({
                wireframe: true
            })
        );
    }

    getHostileBallPhysicsBody(): Body {
        return this.physicsBalldy;
    }

    getHostileBallVisualMesh(): Mesh {
        return this.ballVisualMesh;
    }

    updateBallAI(dt) {
        //update visual mesh
        this.ballVisualMesh.position.copy(this.physicsBalldy.position);
        this.ballVisualMesh.quaternion.copy(this.physicsBalldy.quaternion);

        //ball ai that activates 20unit n below
        if (20 > this.physicsBalldy.position.y) {
            this.timeToMove += dt;

            //if near alr will stop, if not yeeted, otherwise yeet halfway stuck feels bad
            if (this.ballVisualMesh.position.distanceTo(this.originPointAINav) <= 15 
            && Math.abs(this.physicsBalldy.velocity.x) < 100 
            && Math.abs(this.physicsBalldy.velocity.y) < 100 
            && Math.abs(this.physicsBalldy.velocity.z) < 100){

                this.physicsBalldy.velocity.set(0, 0, 0);
            }

            //spawn time and ball shouldnt path when getting yeeted, wasting compute resources
            //also why am i so good lel, math.abs, also if ur a stranger pls understand im slowly going mad
            //this is one long chain of ifs, looks horrendous but imo need fulfil many conditions before moving the ball AI!
            if (this.ballVisualMesh.position.distanceTo(this.originPointAINav) > 15 && this.timeToMove > 5 
            && Math.abs(this.physicsBalldy.velocity.x) < 50 && Math.abs(this.physicsBalldy.velocity.y) < 50 && Math.abs(this.physicsBalldy.velocity.z) < 50) {

                this.physicsBalldy.velocity.set(0, 0, 0);
                this.physicsBalldy.angularVelocity.set(0,0,0);
                this.ballVisualMesh.lookAt(this.originPointAINav);
                this.physicsBalldy.quaternion.copy(new Quaternion(this.ballVisualMesh.quaternion.x,this.ballVisualMesh.quaternion.y, this.ballVisualMesh.quaternion.z, this.ballVisualMesh.quaternion.w));
                this.forwardOffset.applyQuaternion(this.physicsBalldy.quaternion);
                this.forwardOffset.add(this.ballVisualMesh.position);
                //idk why but it seems to be direct opposite so need negative/-
                this.physicsBalldy.velocity.set(-this.forwardOffset.x/3, 0, -this.forwardOffset.z/3);

                this.timeToMove = 0;
            }

        }

    }

}
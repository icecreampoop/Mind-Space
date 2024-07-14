import { Body, Material, Quaternion, Sphere, Vec3 } from "cannon-es";
import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3, Color, Scene } from "three";
import { getGroundVisualMesh } from '../loaders/GroundLoader';
import physicsWorld from './physics';

export class HostileBalls {
    private mass = 100;
    private physicsBalldy: Body;
    private timeToMove = 2;
    private ballRadius = 5;
    private ballVisualMesh: Mesh;
    private forwardOffset = new Vector3(0, 1, 1);
    private originPointAINav = new Vector3(0, 0, 0);
    private attackTimer = 0;
    private attackSwitch = false;
    private redSwitch = true;

    constructor() {
        this.physicsBalldy = new Body({
            mass: this.mass,
            shape: new Sphere(this.ballRadius),
            position: new Vec3(0, 20, 0),
            material: new Material({ friction: 300, restitution: 0.1 })
        })

        this.ballVisualMesh = new Mesh(
            new SphereGeometry(this.ballRadius, 15, 15),
            new MeshBasicMaterial({
                wireframe: true
            })
        );

        let x = 0;
        let z = 0;

        //random ball spawn position, copied n modified from stars
        //im not gonna overthink this lol, optimising is if i can complete
        while (Math.abs(x) < 30 && 120 > Math.abs(x) || Math.abs(z) < 30 && 120 > Math.abs(z)) {
            const radius = Math.random() * 50 + 50;
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            x = radius * Math.sin(phi) * Math.cos(theta);
            z = radius * Math.cos(phi);
        }

        this.physicsBalldy.position.set(x, Math.random() * 200 + 50, z);


        //prevent ghost balls lel, no weird ball flickers when spawning in at 0,0,0
        this.ballVisualMesh.position.copy(this.physicsBalldy.position);
        this.ballVisualMesh.quaternion.copy(this.physicsBalldy.quaternion);
    }

    getHostileBallPhysicsBody(): Body {
        return this.physicsBalldy;
    }

    getHostileBallVisualMesh(): Mesh {
        return this.ballVisualMesh;
    }

    updateBallAI(dt, enemyArray, scene: Scene) : boolean{
        //update visual mesh
        this.ballVisualMesh.position.copy(this.physicsBalldy.position);
        this.ballVisualMesh.quaternion.copy(this.physicsBalldy.quaternion);

        //ball ai that activates 20unit n below
        if (20 > this.physicsBalldy.position.y) {
            this.timeToMove += dt;

            //if near alr will stop, if not yeeted, otherwise yeet halfway stuck feels bad
            if (this.ballVisualMesh.position.distanceTo(this.originPointAINav) <= 15
                && Math.abs(this.physicsBalldy.velocity.x) < 90
                && Math.abs(this.physicsBalldy.velocity.y) < 90
                && Math.abs(this.physicsBalldy.velocity.z) < 90) {

                this.physicsBalldy.velocity.set(0, 0, 0);
                this.physicsBalldy.angularVelocity.set(0, 0, 0);

                //logic for 'attack'
                if (this.attackSwitch) {
                    this.attackTimer += dt;
                }
                if (!this.attackSwitch && this.attackTimer === 0) {
                    this.ballVisualMesh.material['color'] = new Color("#FFED00");
                    this.attackSwitch = true;
                }
                if (this.attackTimer > 3 && this.redSwitch) {
                    this.ballVisualMesh.material['color'] = new Color("#E40000");
                    this.redSwitch = false;
                }
                if (this.attackTimer > 6) {
                    getGroundVisualMesh().material['color'] = new Color("#E40000");
                    //remove visual first so no clutter/flashing of ghost balls
                    scene.remove(this.ballVisualMesh);
                    physicsWorld.removeBody(this.physicsBalldy);
                    delete enemyArray[this.physicsBalldy.id];
                    
                    //hack workaround for damage
                    return true;
                }


            }

            //ball shouldnt path when getting yeeted, wasting compute resources
            //also why am i so good lel, math.abs (future me to say this was cringe)
            //this is one long chain of ifs, looks horrendous but imo need fulfil many conditions before moving the ball AI!
            if (this.ballVisualMesh.position.distanceTo(this.originPointAINav) > 15 && this.timeToMove > 5
                && Math.abs(this.physicsBalldy.velocity.x) < 50 && Math.abs(this.physicsBalldy.velocity.y) < 50 && Math.abs(this.physicsBalldy.velocity.z) < 50) {

                this.physicsBalldy.velocity.set(0, 0, 0);
                this.physicsBalldy.angularVelocity.set(0, 0, 0);
                this.ballVisualMesh.lookAt(this.originPointAINav);
                this.physicsBalldy.quaternion.copy(new Quaternion(this.ballVisualMesh.quaternion.x, this.ballVisualMesh.quaternion.y, this.ballVisualMesh.quaternion.z, this.ballVisualMesh.quaternion.w));
                this.forwardOffset.applyQuaternion(this.physicsBalldy.quaternion);
                this.forwardOffset.add(this.ballVisualMesh.position);
                //idk why but it seems to be direct opposite so need negative/-
                this.physicsBalldy.velocity.set(-this.forwardOffset.x / 3, 0, -this.forwardOffset.z / 3);

                this.timeToMove = 0;
            }

        }

        return false;
    }

}
import { Scene } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { physics } from '../utils/physics';
import { AnimationMixer } from "three";

let loader = new FBXLoader();
let playerModel;
let mixers = [];

export function loadPlayer(scene: Scene) {
    loader.setPath('./assets/');
    loader.load('alien_soldier.fbx', (fbx) => {
        fbx.scale.setScalar(0.1);
        playerModel = fbx;
        fbx.traverse((child) => {

        });


        const anim = new FBXLoader();
        anim.setPath('./assets/');
        anim.load('breathing_idle.fbx', (anim) => {
            const m = new AnimationMixer(fbx);
            mixers.push(m);
            const idle = m.clipAction(anim.animations[0]);
            idle.play();
        });
    });
}

export function getPlayerModel() {
    return playerModel;
}

function createRapierCollider(geometry) {
    const vertices = geometry.attributes.position.array;
    const indices = geometry.index.array;

    // Create a Rapier collider from the vertices and indices
    const colliderDesc = physics.ColliderDesc.trimesh(vertices, indices);
    const rigidBodyDesc = physics.RigidBodyDesc.dynamic();

    // Add the collider to the world
    const rigidBody = physics.createRigidBody(rigidBodyDesc);
    physics.createCollider(colliderDesc, rigidBody);
}

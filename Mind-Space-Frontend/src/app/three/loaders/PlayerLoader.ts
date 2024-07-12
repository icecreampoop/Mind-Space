import { AnimationAction, Object3D, Object3DEventMap, Scene } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { AnimationMixer } from "three";
import * as CANNON from 'cannon-es';
import physicsWorld from '../utils/physics';

let loader = new FBXLoader();
let playerModel: Object3D<Object3DEventMap>;
let sceneConst: Scene;
let playerPhysicsBody: CANNON.Body;
let punchPhysicsHitBox: CANNON.Body;
let mixer: AnimationMixer;
const animationsMap: Map<string, AnimationAction> = new Map();

export async function getPlayerMixer() {
    return mixer;
}

export async function getPlayerAnimationsMap() {
    return animationsMap;
}

export function loadPlayer(scene: Scene) {
    sceneConst = scene;
    loader.setPath('./assets/');
    loader.load('mousey.fbx', (fbx) => {
        fbx.scale.setScalar(0.05);
        playerModel = fbx;

        // List of FBX animation file paths
        const fbxAnimationFiles = [
            'mousey_breathing_idle.fbx',
            'mousey_punch1.fbx',
            'mousey_run.fbx',
            'mousey_swing_dance.fbx',
            'mousey_dash.fbx',
            'mousey_zombie_death.fbx'
        ];

        mixer = new AnimationMixer(playerModel);

        const animLoader = new FBXLoader();
        animLoader.setPath('./assets/');

        fbxAnimationFiles.forEach((filePath) => {
            animLoader.load(filePath, (fbx) => {
                const animationClip = fbx.animations[0]; // assuming one animation per FBX file

                const action = mixer.clipAction(animationClip);
                animationsMap.set(filePath.split(".")[0], action);
            });
        });

    });

    //phsyics body
    const radiusTop = 1.5
    const radiusBottom = 1.5
    const height = 6
    const numSegments = 12
    const cylinderShape = new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments)
    playerPhysicsBody = new CANNON.Body({
        shape: cylinderShape,
        type: CANNON.Body.KINEMATIC
    })
    playerPhysicsBody.position.set(0, 6 / 2, 0);
    physicsWorld.addBody(playerPhysicsBody);

    //punch hit box
    punchPhysicsHitBox = new CANNON.Body({
        mass: 10,
        shape: new CANNON.Box(new CANNON.Vec3(1.3, 2, 1.5)),
        position: new CANNON.Vec3(0, 3, -2),
        type: CANNON.Body.KINEMATIC,
        collisionResponse: false
    });
    physicsWorld.addBody(punchPhysicsHitBox);
}

export function showPlayer() {
    if (playerModel) {
        sceneConst.add(playerModel);
    }
}

//probs can collapse this and mixer into one
export function updatePlayerMovement() {
    if (playerModel) {
        playerModel.position.copy(new CANNON.Vec3(playerPhysicsBody.position.x, 0, playerPhysicsBody.position.z));
    }
}

export function getPunchHitBox() {
    return punchPhysicsHitBox;
}

export function getPlayerModel() {
    return playerModel;
}

export function getPlayerPhysicsBody() {
    return playerPhysicsBody;
}
import { Color, CylinderGeometry, Mesh, MeshBasicMaterial, Scene } from 'three';
import { HostileBalls } from '../utils/HostileBalls';
import physicsWorld from '../utils/physics';

let enemyArray = {};
let gameTime = 0;
let spawnTimer = 0;
let spawnFrequency = 5;
let frequencyTimer = 0;
let sceneRef: Scene;
let numOfEnemies = 5;

export function loadGameLogic(scene: Scene) {
    //setups up the stage and enemies
    sceneRef = scene;

    for (let i = 0; i < numOfEnemies; i++) {
        const ball = new HostileBalls;
        enemyArray[ball.getHostileBallPhysicsBody().id] = ball;
    }

    for (let key in enemyArray) {
        physicsWorld.addBody(enemyArray[key].getHostileBallPhysicsBody());
        scene.add(enemyArray[key].getHostileBallVisualMesh());
    }


    //spawn defense zone
    const zoneHeight = 10;
    const groundVisualMesh = new Mesh(
        new CylinderGeometry(19, 19, zoneHeight, 50, 1),
        new MeshBasicMaterial({
            color: new Color('#00ECFF'),
            wireframe: true
        })
    );
    groundVisualMesh.position.set(0, zoneHeight / 2, 0);
    scene.add(groundVisualMesh);
}

export function updateGameLogic(dt) {
    gameTime += dt;
    spawnTimer += dt;
    frequencyTimer += dt;

    for (let key in enemyArray) {
        //clear up physics world if it falls below a certain point
        if (-300 > enemyArray[key].getHostileBallPhysicsBody().position.y) {
            //remove visual first so no clutter/flashing of ghost balls
            sceneRef.remove(enemyArray[key].getHostileBallVisualMesh());
            physicsWorld.removeBody(enemyArray[key].getHostileBallPhysicsBody());
            delete enemyArray[key];
        } else {
            enemyArray[key].updateBallAI(dt, enemyArray, sceneRef);
        }
    }


    //spawn balls
    if (spawnTimer >= spawnFrequency) {
        spawnTimer = 0;

        addBallToWorld();
    }

    //decrease frequency to make it harder over time
    if (frequencyTimer > 5 && spawnFrequency > 0.75) {
        frequencyTimer = 0;
        spawnFrequency -= 0.25;
    }
}

function addBallToWorld() {
    const ball = new HostileBalls;
    enemyArray[ball.getHostileBallPhysicsBody().id] = ball;
    physicsWorld.addBody(ball.getHostileBallPhysicsBody());
    sceneRef.add(ball.getHostileBallVisualMesh())
}
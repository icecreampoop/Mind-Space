import { CylinderGeometry, Mesh, MeshBasicMaterial, Scene } from 'three';
import { HostileBalls } from '../utils/HostileBalls';
import physicsWorld from '../utils/physics';

let enemyArray = {};
let gameTime = 0;
let spawnTimer = 0;
let spawnFrequency = 10;
let frequencyTimer = 0;
let sceneRef: Scene;
let numOfEnemies = 5;

export function loadGameLogic(scene: Scene) {
    //setups up the stage and enemies
    sceneRef = scene;

    for (let i = 0; i < numOfEnemies; i++) {
        const ball = spawnBall();
        enemyArray[ball.getHostileBallPhysicsBody().id] = ball;
    }

    for (let key in enemyArray) {
        physicsWorld.addBody(enemyArray[key].getHostileBallPhysicsBody());
        scene.add(enemyArray[key].getHostileBallVisualMesh());
    }


    //spawn defense zone
    const zoneHeight = 10;
    const groundVisualMesh = new Mesh(
        new CylinderGeometry(15, 15, zoneHeight , 15, 5),
        new MeshBasicMaterial({
            color: 0x0000ff,
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
            physicsWorld.removeBody(enemyArray[key].getHostileBallPhysicsBody());
            sceneRef.remove(enemyArray[key].getHostileBallVisualMesh());
            delete enemyArray[key];
        } else {
            enemyArray[key].updateBallAI(dt);
        }
    }


    //spawn balls
    if (spawnTimer >= spawnFrequency) {
        spawnTimer = 0;

        const ball = spawnBall();
        enemyArray[ball.getHostileBallPhysicsBody().id] = ball;
        physicsWorld.addBody(ball.getHostileBallPhysicsBody());
        sceneRef.add(ball.getHostileBallVisualMesh())
    }

    //decrease frequency to make it harder over time
    if (frequencyTimer > 15 && spawnFrequency > 1) {
        frequencyTimer = 0;
        spawnFrequency--;
    }
}

function spawnBall() {
    const hostileBall = new HostileBalls;
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

    hostileBall.getHostileBallPhysicsBody().position.set(x, Math.random() * 300 + 50, z);

    return hostileBall;
}
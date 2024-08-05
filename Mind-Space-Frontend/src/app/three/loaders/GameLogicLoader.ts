import { Color, CylinderGeometry, Mesh, MeshBasicMaterial, Scene, Audio, AudioListener, AudioLoader } from 'three';
import { HostileBalls } from '../utils/HostileBalls';
import physicsWorld from '../utils/physics';

let enemyArray = {};
let spawnTimer = 0;
let spawnFrequency = 5;
let frequencyTimer = 0;
let sceneRef: Scene;
let numOfEnemies = 5;

//audio
let ballChangeSound: Audio;
let gameStateChangeSound: Audio;
let gameBGM: Audio;
let gamePanicBGM: Audio;

export function loadGameLogic(scene: Scene, listener: AudioListener, audioLoader: AudioLoader) {
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

    //audio setup
    if (!ballChangeSound && !gamePanicBGM) {
        ballChangeSound = new Audio(listener);
        audioLoader.load('short-beep-tone.mp3', (buffer) => {
            ballChangeSound.setBuffer(buffer);
            ballChangeSound.setLoop(false);
            ballChangeSound.setVolume(0.15);
        });
        gameStateChangeSound = new Audio(listener);
        audioLoader.load('infographic-pop (floraphonic).mp3', (buffer) => {
            gameStateChangeSound.setBuffer(buffer);
            gameStateChangeSound.setLoop(false);
            gameStateChangeSound.setVolume(0.3);
        });
        gameBGM = new Audio(listener);
        audioLoader.load('Brave Circus Clowns (AnyStyle).mp3', (buffer) => {
            gameBGM.setBuffer(buffer);
            gameBGM.setLoop(true);
            gameBGM.setVolume(0.1);
            gameBGM.play();
        });
        gamePanicBGM = new Audio(listener);
        audioLoader.load('Panic (SergeQuadrado).mp3', (buffer) => {
            gamePanicBGM.setBuffer(buffer);
            gamePanicBGM.setLoop(true);
            gamePanicBGM.setVolume(0.2);
        });
    } else {
        gameBGM.play();
    }
}

export function updateGameLogic(dt): boolean {
    //hack work around injection
    let damage = false;

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
            if (enemyArray[key].updateBallAI(dt, enemyArray, sceneRef)) {
                damage = true;
            }
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

    return damage;
}

export function getBallChangeSound() {
    if (ballChangeSound.isPlaying) ballChangeSound.stop();
    ballChangeSound.play();
}

export function getGameStateChangeSound() {
    if (gameStateChangeSound.isPlaying) gameStateChangeSound.stop();
    gameStateChangeSound.play();
}

export function getGamePanicBGM() {
    if (gameBGM.isPlaying) gameBGM.stop();

    if (!gamePanicBGM.isPlaying) {
        setTimeout(() => {
            gamePanicBGM.play();
        }, 1000);
    };
}

export function stopAllBGM() {
    if (gameBGM) gameBGM.stop();
    if (gamePanicBGM) gamePanicBGM.stop();
}

function addBallToWorld() {
    const ball = new HostileBalls;
    enemyArray[ball.getHostileBallPhysicsBody().id] = ball;
    physicsWorld.addBody(ball.getHostileBallPhysicsBody());
    sceneRef.add(ball.getHostileBallVisualMesh())
}

export function resetGameLogic() {
    enemyArray = {};
    spawnTimer = 0;
    spawnFrequency = 5;
    frequencyTimer = 0;
}
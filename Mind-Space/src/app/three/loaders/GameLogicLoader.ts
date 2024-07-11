import { HostileBalls } from '../utils/HostileBalls';
import physicsWorld from '../utils/physics';

let enemyArray: HostileBalls[] = [];

export function loadGameLogic() {
    //setups up the stage and enemies
    let numOfEnemies = 10;
    enemyArray = [];

    for (let i = 0; i < numOfEnemies; i++) {
        const hostileBall = new HostileBalls;

        //random ball spawn position, copied n modified from stars
        const radius = Math.random() * 50 + 50;
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        let x = radius * Math.sin(phi) * Math.cos(theta);
        let z = radius * Math.cos(phi);


        hostileBall.getHostileBallPhysicsBody().position.set(x, Math.random() * 500 + 50, z);

        enemyArray.push(hostileBall);
    }

    enemyArray.forEach((hostileBall) => {
        physicsWorld.addBody(hostileBall.getHostileBallPhysicsBody())
    })
}

export function updateGameLogic() {
    enemyArray.forEach((hostileBall) => {
        //clear up physics world if it falls below a certain point
        if (-300 >hostileBall.getHostileBallPhysicsBody().position.y) {
            physicsWorld.removeBody(hostileBall.getHostileBallPhysicsBody());
        }
    })
}
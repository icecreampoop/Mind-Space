import * as CANNON from 'cannon-es';

let physicsWorld: CANNON.World;

export default physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -30.82, 0),
})

export async function cleanUpPhysics() {
  while (physicsWorld.bodies.length > 0) {
    physicsWorld.removeBody(physicsWorld.bodies[0]);
  }
}
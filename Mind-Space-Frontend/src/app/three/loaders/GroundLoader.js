import { PlaneGeometry, Mesh, MeshBasicMaterial } from 'three';
import * as CANNON from 'cannon-es';
import physicsWorld from '../utils/physics';
import * as THREE from 'three';

let groundVisualMesh;

export function setupGround(scene) {
    groundVisualMesh = new Mesh(
        new PlaneGeometry(200, 200, 50, 50),
        new MeshBasicMaterial({
            wireframe: true,
            transparent: true
        })
    );

    // Get the dimensions of the Three.js mesh
    const boundingBox = new THREE.Box3().setFromObject(groundVisualMesh);
    const dimensions = new THREE.Vector3();
    boundingBox.getSize(dimensions);

    const groundPhysicsBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(dimensions.x / 2, dimensions.y / 2, 0.1))
    })

    groundVisualMesh.rotation.x = -Math.PI / 2;
    scene.add(groundVisualMesh);
    groundPhysicsBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    groundPhysicsBody.position.set(0,-0.1,0);
    physicsWorld.addBody(groundPhysicsBody);
}

export function getGroundVisualMesh() {
    return groundVisualMesh;
}




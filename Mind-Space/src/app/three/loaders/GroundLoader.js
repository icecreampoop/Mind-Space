import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d';
import { PlaneGeometry, Mesh, MeshBasicMaterial } from 'three';
import { physics } from '../utils/physics';


const groundVisualMesh = new Mesh(
    new PlaneGeometry(300, 300, 50, 50),
    new MeshBasicMaterial({
        wireframe: true,
        transparent: true
    })
);

//setting up variables required for physics
const groundRigidBody = physics.createRigidBody(RigidBodyDesc.fixed());
const geo = groundVisualMesh.geometry;
const colliderDesc = ColliderDesc.trimesh(
    new Float32Array(geo.attributes.position.array),
    new Float32Array(geo.index.array)
);

export function setupGround(scene) {
    groundVisualMesh.rotation.x = -Math.PI / 2;
    scene.add(groundVisualMesh);
    physics.createCollider(colliderDesc, groundRigidBody);
}




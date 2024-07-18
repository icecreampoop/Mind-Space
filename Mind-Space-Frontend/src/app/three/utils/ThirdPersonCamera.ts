import { ElementRef } from '@angular/core';
import { Vec3 } from 'cannon-es';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let orbitControl: OrbitControls;

export function perspectiveCamera() {
  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1.0;
  const far = 1000.0;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 0);

  return camera;
}

export function createOrbitControls(cam: THREE.Camera, canvas: ElementRef<HTMLCanvasElement>) {
  orbitControl = new OrbitControls(cam, canvas.nativeElement);
  orbitControl.enablePan = false;
  orbitControl.enableZoom = false;
  orbitControl.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
  };
  orbitControl.minDistance = 10;
  orbitControl.maxDistance = 10;
  //prevent top down or bottom up, as it will bug out for movement
  orbitControl.minPolarAngle = Math.PI * 0.15;
  orbitControl.maxPolarAngle = Math.PI * 0.85;
  orbitControl.update();
}

export function updateOrbitControls(playerModel: THREE.Object3D<THREE.Object3DEventMap>) {
  if (playerModel) {
    orbitControl.target.copy(new Vec3(playerModel.position.x, playerModel.position.y + 5, playerModel.position.z));
    orbitControl.update();
  }
}


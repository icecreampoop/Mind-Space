import * as THREE from 'three';

export class ThirdPersonCamera {
  //third_person_camera itself returns the camera
  //but constructor will need the player object to look at
  private _player: any;
  private _camera: THREE.PerspectiveCamera;
  private _currentPosition: THREE.Vector3;
  private _currentLookat: THREE.Vector3;

  constructor(params, camera:THREE.PerspectiveCamera) {
    this._player = params;
    this._camera = camera;

    this._currentPosition = new THREE.Vector3();
    this._currentLookat = new THREE.Vector3();
  }

  _CalculateIdealOffset() {
    const idealOffset = new THREE.Vector3(-0, 10, -15);
    idealOffset.applyQuaternion(this._player.target._rotation);
    idealOffset.add(this._player.target._position);
    return idealOffset;
  }

  _CalculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 5, 20);
    idealLookat.applyQuaternion(this._player.target._rotation);
    idealLookat.add(this._player.target._position);
    return idealLookat;
  }

  Update(timeElapsed) {
    const idealOffset = this._CalculateIdealOffset();
    const idealLookat = this._CalculateIdealLookat();

    // const t = 0.05;
    // const t = 4.0 * timeElapsed;
    //change 0.01 to bigger like 0.1 for snappier cam movement
    //or smaller if want to have longer transition/more frames
    const t = 1.0 - Math.pow(0.01, timeElapsed);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookat.lerp(idealLookat, t);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);
  }

  public getCamera(){
    return this._camera;
  }
}

export function perspectiveCamera() {
  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1.0;
  const far = 10000.0;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 0);
  
  return camera;
}


import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private listener = new THREE.AudioListener();
  private audioLoader = new THREE.AudioLoader();

  constructor() {
    this.audioLoader.setPath('./assets/');
  }

  public setupAudioListener(cam: THREE.Camera) {
    cam.add(this.listener);
  }

  public getAudioListener() {
    return this.listener;
  }

  public getAudioLoader() {
    return this.audioLoader;
  }
}

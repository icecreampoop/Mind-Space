import { ElementRef, Injectable } from '@angular/core';
import { RendererService } from './game-engine/renderer.service';
import * as THREE from 'three';
import { blinkAllStarFields, loadStarfield, updateStarfield } from './loaders/starfieldLoader';
import { stopRecursiveStarfieldBlink } from './utils/StarfieldUtil';
import { perspectiveCamera, ThirdPersonCamera } from './utils/ThirdPersonCamera';
import { setupGround } from './loaders/GroundLoader';
import { physics } from './utils/physics';
import { getPlayerModel, loadPlayer } from './loaders/PlayerLoader';

@Injectable({
  providedIn: 'root'
})
export class MindSpaceService {
  private scene = new THREE.Scene();
  private cam: any;
  private worldPhysics;
  
  constructor(private renderer: RendererService) { 
    this.cam = perspectiveCamera();
    this.loadPhysics();

  }

  async loadPhysics() {
    this.worldPhysics = await physics;
  }

  destroy(): void {
    this.renderer.destroy()
    stopRecursiveStarfieldBlink();
  }

  landingPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();

    loadStarfield(this.scene);
    blinkAllStarFields();
    setupGround(this.scene);
    loadPlayer(this.scene);

    this.renderer.createWorld(canvas, this.scene, this.cam);
    this.renderer.animate();

    this.renderer.onUpdate( (dt) => {
      updateStarfield();
      this.worldPhysics.step();
    });
  }

  mainPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();

    blinkAllStarFields();
    this.cam = new ThirdPersonCamera(getPlayerModel(), this.cam);

    this.renderer.createWorld(canvas, this.scene, this.cam.getCamera());
    this.renderer.animate();

    this.renderer.onUpdate( (dt) => {
      updateStarfield();
      this.worldPhysics.step();
      this.cam.Update(dt);
    });
  }
}

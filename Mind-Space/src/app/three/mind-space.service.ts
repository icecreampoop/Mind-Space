import { ElementRef, Injectable } from '@angular/core';
import { RendererService } from './game-engine/renderer.service';
import * as THREE from 'three';
import { blinkAllStarFields, loadStarfield, updateStarfield } from './loaders/starfieldLoader';
import { stopRecursiveStarfieldBlink } from './utils/StarfieldUtil';
import { perspectiveCamera, ThirdPersonCamera } from './utils/ThirdPersonCamera';

@Injectable({
  providedIn: 'root'
})
export class MindSpaceService {
  private scene = new THREE.Scene();
  private cam: any;
  
  constructor(private renderer: RendererService) { 
    this.cam = perspectiveCamera();
    
  }

  destroy(): void {
    this.renderer.destroy()
    stopRecursiveStarfieldBlink();
  }

  landingPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();

    loadStarfield(this.scene);
    blinkAllStarFields();

    this.renderer.createWorld(canvas, this.scene, this.cam);
    this.renderer.animate();

    this.renderer.onUpdate( (dt) => {
      updateStarfield();
    });
  }

  mainPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();

    blinkAllStarFields();
    this.cam = new ThirdPersonCamera(playa);

    this.renderer.createWorld(canvas, this.scene, this.cam.getCamera());
    this.renderer.animate();

    this.renderer.onUpdate( (dt) => {
      updateStarfield();
      this.cam.Update(dt);
    });
  }
}

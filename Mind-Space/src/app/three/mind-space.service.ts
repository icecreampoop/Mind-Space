import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { RendererService } from './game-engine/renderer.service';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class MindSpaceService {
  private scene: THREE.Scene;
  private camera: THREE.Camera;

  constructor(private renderer: RendererService) { }

  destroy(): void {
    this.renderer.destroy()
  }

  landingPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.renderer.createScene(canvas, this.scene, this.camera);
    this.renderer.animate();
  }

  mainPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.renderer.createScene(canvas, this.scene, this.camera);
    this.renderer.animate();

    // this.renderer.onUpdate( (dt) => {
    //   physics.step();
    //   player.update(dt);
    //   this.camera.update(player);
    //   light.update(player);
    // });
  }
}

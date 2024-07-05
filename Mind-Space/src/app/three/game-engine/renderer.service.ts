import { ElementRef, Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class RendererService {
  private scene = null;
  private clock = new THREE.Clock();
  private renderer: THREE.WebGLRenderer;
  private camera = null;
  private cbUpdate = null;
  private canvas = null;
  private frameId: number = null;

  constructor(private ngZone: NgZone) {
  }

  public destroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.forceContextLoss();
      this.renderer.dispose();
      this.renderer = null;
      this.canvas = null;
    }
  }

  public createWorld(canvas: ElementRef<HTMLCanvasElement>, scene: THREE.Scene, camera: THREE.Camera) {
    // Getting the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;
    this.scene = scene;
    this.camera = camera;

    //check to make sure no leaked memory (cus there was lol)
    if (this.renderer != null) {
      this.renderer.forceContextLoss();
      this.renderer.dispose();
      this.renderer = null;
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      //alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }

  public onUpdate(callback) {
    this.cbUpdate = callback
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  private render(): void {
    const dt = this.clock.getDelta();
    
    //if there is callback updates
    if (this.cbUpdate) {
      this.cbUpdate(dt)
    }

    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    this.renderer.render(this.scene, this.camera);
  }

  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
  
}

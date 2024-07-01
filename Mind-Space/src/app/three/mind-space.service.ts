import { ElementRef, Injectable } from '@angular/core';
import { RendererService } from './game-engine/renderer.service';
import * as THREE from 'three';
import createStarfield, { blinkStarField, moveStarField, stopRecursiveStarfieldBlink } from './utils/starfieldUtil';

@Injectable({
  providedIn: 'root'
})
export class MindSpaceService {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private starfieldMain = createStarfield();
  private starfieldBlink1 = createStarfield({"numStars": 10});
  private starfieldBlink2 = createStarfield({"numStars": 10});
  private starfieldBlink3 = createStarfield({"numStars": 10});
  private starfieldBlink4 = createStarfield({"numStars": 10});
  private starfieldMove = createStarfield({"numStars": 50});

  constructor(private renderer: RendererService) { }

  destroy(): void {
    this.renderer.destroy()
    stopRecursiveStarfieldBlink();
  }

  landingPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();
    
    //to delete
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.starfieldMain);
    this.scene.add(this.starfieldMove);
    this.scene.add(this.starfieldBlink1);
    blinkStarField(this.starfieldBlink1);
    this.scene.add(this.starfieldBlink2);
    blinkStarField(this.starfieldBlink2);
    this.scene.add(this.starfieldBlink3);
    blinkStarField(this.starfieldBlink3);
    this.scene.add(this.starfieldBlink4);
    blinkStarField(this.starfieldBlink4);
    //to delete^

    this.renderer.createWorld(canvas, this.scene, this.camera);
    this.renderer.animate();

    this.renderer.onUpdate( (dt) => {
      moveStarField(this.starfieldMove);
    //   physics.step();
    //   player.update(dt);
    //   this.camera.update(player);
    //   light.update(player);
    });
  }

  mainPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();

    //to delete
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.starfieldMain);
    this.scene.add(this.starfieldMove);
    this.scene.add(this.starfieldBlink1);
    blinkStarField(this.starfieldBlink1);
    this.scene.add(this.starfieldBlink2);
    blinkStarField(this.starfieldBlink2);
    this.scene.add(this.starfieldBlink3);
    blinkStarField(this.starfieldBlink3);
    this.scene.add(this.starfieldBlink4);
    blinkStarField(this.starfieldBlink4);
    //to delete^

    this.renderer.createWorld(canvas, this.scene, this.camera);
    this.renderer.animate();

    this.renderer.onUpdate( (dt) => {
      moveStarField(this.starfieldMove);
    //   physics.step();
    //   player.update(dt);
    //   this.camera.update(player);
    //   light.update(player);
    });
  }
}

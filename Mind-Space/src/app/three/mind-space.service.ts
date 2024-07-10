import { ElementRef, Injectable } from '@angular/core';
import { RendererService } from './game-engine/renderer.service';
import * as THREE from 'three';
import { blinkAllStarFields, loadStarfield, updateStarfield } from './loaders/starfieldLoader';
import { stopRecursiveStarfieldBlink } from './utils/StarfieldUtil';
import { createOrbitControls, perspectiveCamera, updateOrbitControls } from './utils/ThirdPersonCamera';
import { setupGround } from './loaders/GroundLoader';
import { getPlayerModel, loadPlayer, showPlayer, updatePlayerMovement } from './loaders/PlayerLoader';
import physicsWorld, { cleanUpPhysics } from './utils/physics';
import CannonDebugger from 'cannon-es-debugger'
import { CharacterControls } from './utils/CharacterControls';

@Injectable({
  providedIn: 'root'
})
export class MindSpaceService {
  private scene = new THREE.Scene();
  private cam: any;
  private light = new THREE.AmbientLight(0xffffff, 1.5);
  private characterControls: CharacterControls;
  private cannonDebugger = CannonDebugger(this.scene, physicsWorld);

  constructor(private renderer: RendererService) {
    this.cam = perspectiveCamera();
  }

  destroy(): void {
    this.renderer.destroy()
    stopRecursiveStarfieldBlink();
  }

  landingPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();
    //i hate js so much why is it async, causing issues with cleanup code
    this.renderer.cleanUpScene();
    cleanUpPhysics().then(() => {
      setupGround(this.scene);
    });

    loadStarfield(this.scene);
    blinkAllStarFields();
    loadPlayer(this.scene);

    this.renderer.createWorld(canvas, this.scene, this.cam);
    this.renderer.animate();

    this.renderer.onUpdate((dt) => {
      updateStarfield();
      this.cannonDebugger.update();
    });
  }

  mainPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();

    blinkAllStarFields();
    this.scene.add(this.light);
    createOrbitControls(this.cam, canvas);
    showPlayer();

    this.renderer.createWorld(canvas, this.scene, this.cam);
    this.renderer.animate();

    this.characterControls = new CharacterControls('mousey_breathing_idle', this.cam);

    this.renderer.onUpdate((dt) => {
      this.characterControls.update(dt);
      updateOrbitControls(getPlayerModel());
      updatePlayerMovement();
      updateStarfield();
      physicsWorld.fixedStep();
      this.cannonDebugger.update();
    });
  }
}

import { ElementRef, inject, Injectable, signal } from '@angular/core';
import { RendererService } from '../three/game-engine/renderer.service';
import * as THREE from 'three';
import { blinkAllStarFields, loadStarfield, updateStarfield } from '../three/loaders/starfieldLoader';
import { stopRecursiveStarfieldBlink } from '../three/utils/StarfieldUtil';
import { createOrbitControls, perspectiveCamera, updateOrbitControls } from '../three/utils/ThirdPersonCamera';
import { setupGround } from '../three/loaders/GroundLoader';
import { getPlayerModel, loadPlayer, showPlayer, updatePlayerMovement } from '../three/loaders/PlayerLoader';
import physicsWorld, { cleanUpPhysics } from '../three/utils/physics';
//import CannonDebugger from 'cannon-es-debugger'
import { CharacterControls } from '../three/utils/CharacterControls';
import { loadGameLogic, resetGameLogic, updateGameLogic } from '../three/loaders/GameLogicLoader';
import { GameStateStore } from '../ngrx-signal-store/gamestate.store';

@Injectable({
  providedIn: 'root'
})
export class MindSpaceService {
  private scene = new THREE.Scene();
  private cam: THREE.PerspectiveCamera;
  private light = new THREE.AmbientLight(0xffffff, 1.5);
  private characterControls: CharacterControls;
  private gameStateStore = inject(GameStateStore);
  gameTimer = signal(0);
  //private cannonDebugger = CannonDebugger(this.scene, physicsWorld);

  constructor(private renderer: RendererService) {
    this.cam = perspectiveCamera();
  }

  destroy(): void {
    this.renderer.destroy()
    stopRecursiveStarfieldBlink();
    resetGameLogic();
    this.gameTimer.set(0);
    this.gameStateStore.resetPlayerHP();
  }

  //for support me and how to play view, is just no load player
  starsBackground(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();
    //i hate js so much why is it async, causing issues with cleanup code
    this.renderer.cleanUpScene();
    cleanUpPhysics().then(() => {
      setupGround(this.scene);
    });

    //reset camera each time redirect so look nicer
    this.cam.position.set(0, 10, 0);
    loadStarfield(this.scene);
    blinkAllStarFields();

    this.renderer.createWorld(canvas, this.scene, this.cam);
    this.renderer.animate();

    this.renderer.onUpdate((dt) => {
      updateStarfield();
      //this.cannonDebugger.update();
    });
  }

  landingPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();
    //i hate js so much why is it async, causing issues with cleanup code
    this.renderer.cleanUpScene();
    cleanUpPhysics().then(() => {
      setupGround(this.scene);
      loadPlayer(this.scene);
    });

    //reset camera each time redirect so look nicer
    this.cam.position.set(0, 10, 0);
    loadStarfield(this.scene);
    blinkAllStarFields();

    this.renderer.createWorld(canvas, this.scene, this.cam);
    this.renderer.animate();

    this.renderer.onUpdate((dt) => {
      updateStarfield();
      //this.cannonDebugger.update();
    });
  }

  mainPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.destroy();

    blinkAllStarFields();
    this.scene.add(this.light);
    createOrbitControls(this.cam, canvas);
    showPlayer();
    loadGameLogic(this.scene);

    this.renderer.createWorld(canvas, this.scene, this.cam);
    this.renderer.animate();

    this.characterControls = new CharacterControls('mousey_breathing_idle', this.cam);

    this.renderer.onUpdate((dt) => {
      if (!(this.gameStateStore.gameState() === "game end")) {
        this.gameTimer.set(this.gameTimer() + dt);
      }

      updatePlayerMovement();
      this.characterControls.update(dt, this.gameStateStore.gameState() === "game end");
      updateOrbitControls(getPlayerModel());
      
      updateStarfield();

      //honestly my genius scares me
      const damageTaken = updateGameLogic(dt);
      if (damageTaken) {
        this.gameStateStore.reducePlayerHP();
      }
      if (0 >= this.gameStateStore.playerHP()) {
        this.gameStateStore.changeGameState("game end");
        this.gameStateStore.gameEndLogic(Math.round(this.gameTimer() * 100));
      }

      physicsWorld.fixedStep();
      //this.cannonDebugger.update();
    });
  }
}

import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GameEngineService } from './game-engine.service';

@Injectable({
  providedIn: 'root'
})
export class MindSpaceService implements OnDestroy{
  constructor(private gameEngineSVC: GameEngineService) { }
  
  ngOnDestroy(): void {
    this.gameEngineSVC.destroy()
  }

  landingPage(canvas: ElementRef<HTMLCanvasElement>) {
    this.gameEngineSVC.createScene(canvas);
    this.gameEngineSVC.animate();
  }

  main(canvas: ElementRef<HTMLCanvasElement>) {
    this.gameEngineSVC.createScene(canvas);
  }
}

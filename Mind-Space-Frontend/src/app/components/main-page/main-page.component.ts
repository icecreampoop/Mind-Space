import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MindSpaceService } from '../../services/mind-space.service';
import { GameStateStore } from '../../ngrx-signal-store/gamestate.store';
import { GameEndViewComponent } from "../game-end-view/game-end-view.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [GameEndViewComponent, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  // took out the confirmation dialog as it is detrimental UX
  // @HostListener('window:beforeunload', ['$event'])
  // public onBeforeUnload(event: BeforeUnloadEvent): void {
  //   event.preventDefault();
  //   event.returnValue = ''; // Triggers the confirmation dialog
  // }

  mindSpace = inject(MindSpaceService);
  gameStateStore = inject(GameStateStore);

  constructor() { }

  ngOnDestroy(): void {
    this.mindSpace.destroy;
  }

  public ngOnInit(): void {
    this.mindSpace.mainPage(this.rendererCanvas);
  }
}

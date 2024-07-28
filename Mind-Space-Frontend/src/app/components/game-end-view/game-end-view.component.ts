import { Component, inject, OnInit } from '@angular/core';
import { MindSpaceService } from '../../services/mind-space.service';
import { CommonModule } from '@angular/common';
import { GameStateStore } from '../../ngrx-signal-store/gamestate.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-end-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-end-view.component.html',
  styleUrl: './game-end-view.component.css'
})
export class GameEndViewComponent implements OnInit {
  mindSpaceSvc = inject(MindSpaceService);
  gameStateStore = inject(GameStateStore);
  router = inject(Router);

  ngOnInit(): void {
  }

  backToLanding() {
    this.router.navigate(['/']);
  }
}

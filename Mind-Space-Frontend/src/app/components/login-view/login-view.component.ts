import { Component, inject } from '@angular/core';
import { GameStateStore } from '../../ngrx-signal-store/gamestate.store';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent {

  gameStateStore = inject(GameStateStore);

  backToLanding() {
    this.gameStateStore.changeGameState("landing page");
  }

}

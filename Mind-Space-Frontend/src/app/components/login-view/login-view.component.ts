import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GameStateStore } from '../../ngrx-signal-store/gamestate.store';
import { BackendApiService } from '../../services/backend-api.service';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent implements OnDestroy, OnInit {
  gameStateStore = inject(GameStateStore);
  private backendService = inject(BackendApiService);
  highScoreOfTheDay$: any;
  allTimeHighScore$: any;

  ngOnInit(): void {
    //sub to backend api observable to show high score of the day/all-time
    this.allTimeHighScore$ = this.backendService.getAllTimeHighScores();
    this.highScoreOfTheDay$ = this.backendService.getHighScoresOfTheDay();
  }

  ngOnDestroy(): void {
    //unsub from observable
  }

  backToLanding() {
    this.gameStateStore.changeGameState("landing page");
  }

  login() {
    //checks if fulfil min/max length
    //both required
    //semantic check for whitespace
    //backend check if pw correct
  }

  createAccount() {
    //checks if fulfil min/max length
    //both required
    //semantic check for whitespace
    //backend check if username already taken

  }

}

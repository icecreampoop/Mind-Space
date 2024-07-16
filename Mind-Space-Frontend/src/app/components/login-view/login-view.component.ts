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
export class LoginViewComponent implements OnInit {
  gameStateStore = inject(GameStateStore);
  private backendService = inject(BackendApiService);
  highScoreOfTheDay$: any[];
  allTimeHighScore$: any;

  ngOnInit(): void {
    //sub to backend api observable to show high score of the day/all-time, auto unsubs cus its http
    //this.allTimeHighScore$ = this.backendService.getAllTimeHighScores().subscribe();
    this.backendService.getHighScoresOfTheDay().subscribe({
      next: (data) => this.highScoreOfTheDay$ = data,
      error: (error) => console.log(error)
    });
  }



  backToLanding() {
    this.gameStateStore.changeGameState("landing page");
  }

  play(){
    
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

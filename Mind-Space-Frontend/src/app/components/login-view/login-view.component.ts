import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { GameStateStore } from '../../ngrx-signal-store/gamestate.store';
import { BackendApiService } from '../../services/backend-api.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent implements OnInit {
  gameStateStore = inject(GameStateStore);
  private backendService = inject(BackendApiService);
  highScoreOfTheDay$: any[];
  allTimeHighScore$: any;
  errorMsg = '';
  errorBoolean = false;
  router = inject(Router);
  userForm = inject(FormBuilder).group({
    username: ['', [Validators.required, this.whitespaceLengthValidator]],
    password: ['', [Validators.required, this.whitespaceLengthValidator]]
  });

  public whitespaceLengthValidator(control: FormControl) {
    //(control.value || '') if value null or undefined return '' so no error
    //length check after trim, if true return whitespace:true cus error
    return 5 > (control.value || '').trim().length || 32 < (control.value || '').trim().length
            ? { 'whitespacelengthcheck': true } : null;
  }

  ngOnInit(): void {
    //sub to backend api observable to show high score of the day/all-time, auto unsubs cus its http
    //this.allTimeHighScore$ = this.backendService.getAllTimeHighScores().subscribe();
    this.backendService.getHighScoresOfTheDay().subscribe({
      next: (data) => this.highScoreOfTheDay$ = data,
      error: (error) => console.log(error)
    });

    this.backendService.getAllTimeHighScores().subscribe({
      next: (data) => this.allTimeHighScore$ = data,
      error: (error) => console.log(error)
    });
  }



  backToLanding() {
    this.gameStateStore.changeGameState("landing page");
  }

  play() {
    this.gameStateStore.changeGameState("gaming");
    this.router.navigate(['/main']);
  }

  login() {
    this.errorBoolean = false;
    //backend check if pw correct
    //TRIM BEFORE SENDING OVER THE INPUTS
    this.backendService.userLoginAttempt(this.userForm.value.username,this.userForm.value.password).subscribe({
      next: (scoreResponse) => {
        this.gameStateStore.changeLogInState();
        this.gameStateStore.setUserStateAfterLogin(this.userForm.value.username, this.userForm.value.password, Number(scoreResponse));
      },
      error: (error) => {
        this.errorBoolean = true;
        this.errorMsg = error.error;
      }
    });
  }

  createAccount() {
    this.errorBoolean = false;
    //backend check if username already taken
    this.backendService.createNewAccount(this.userForm.value.username,this.userForm.value.password).subscribe({
      next: () => {
        this.gameStateStore.changeLogInState();
        this.gameStateStore.setUserStateAfterLogin(this.userForm.value.username, this.userForm.value.password, 0);
      },
      error: (error) => {
        this.errorBoolean = true;
        this.errorMsg = error.error;
      }
    });
  }
}

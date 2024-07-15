import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  constructor(private httpClient: HttpClient) { }

  //redis
  getHighScoresOfTheDay() {
    this.httpClient.get('/api/scores');
  }

  //sql
  getAllTimeHighScores() {
    this.httpClient.get('/api/scores');
  }

  userLoginAttempt(username: string, password: string) {
    //need handle 2 diff case, username does not exist
    //or wrong password
    //if pass both get personal high score!
    lastValueFrom(this.httpClient.get('/api/login'))
      .then()
      .catch();
  }

  createNewAccount(username: string, password: string) {
    //need handle if username alr exist
    lastValueFrom(this.httpClient.post('', ''))
      .then()
      .catch();
  }

  updatePersonalHighScore() {
    lastValueFrom(this.httpClient.put('', ''))
      .then()
      .catch();
    
  }
}

const accountModel = {
    
}
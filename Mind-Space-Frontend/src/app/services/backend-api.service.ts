import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  constructor(private httpClient: HttpClient) { }

  //redis
  getHighScoresOfTheDay() {
    return this.httpClient.get<any[]>('/api/scores', {params: new HttpParams().set("score", "dailyscores")});
  }

  //sql
  getAllTimeHighScores() {
    return this.httpClient.get<any[]>('/api/scores', {params: new HttpParams().set("score", "halloffame")});
  }

  userLoginAttempt(username: string, password: string) {
    //need handle 2 diff case, username does not exist
    //or wrong password
    //if pass both get personal high score!
    return this.httpClient.get('/api/login')

  }

  createNewAccount(username: string, password: string) {
    //need handle if username alr exist
    lastValueFrom(this.httpClient.post('', ''))
      .then()
      .catch();
  }

  updateDBHighScore(username: string ,score: number) {
    return this.httpClient.put(`/api/${username}/update-score`, score, { responseType: 'text' })
  }
}
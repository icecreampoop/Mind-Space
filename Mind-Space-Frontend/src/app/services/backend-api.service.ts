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
    return this.httpClient.post('/api/login', {username: username, password: password}, {responseType: 'text'});

  }

  createNewAccount(username: string, password: string) {
    return this.httpClient.post('/api/create-new-account', {username: username, password: password}, {responseType: 'text'});
  }

  updateDBHighScore(username: string ,score: number) {
    return this.httpClient.put(`/api/${username}/update-score`, score.toString(), { responseType: 'text' });
  }
}
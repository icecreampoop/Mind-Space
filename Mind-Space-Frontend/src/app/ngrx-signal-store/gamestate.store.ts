import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { BackendApiService } from "../services/backend-api.service";

type GameState = {
    gameState: 'landing page' | 'logging in' | 'gaming' | 'game end';
    playerHP: number;
    loggedIn: boolean;
    spinner: boolean;
    username: string;
    password: string;
    userHighScore: number;
    gameEndState: null | 'Not Your Best Run, Try Again?' | 'Personal High Score Updated' | 'Daily Rank Updated' | 'Hall Of Fame Updated'
}

const initialGameState: GameState = {
    gameState: 'landing page',
    playerHP: 2,
    loggedIn: false,
    spinner: false,
    username: '',
    password: '',
    userHighScore: 0,
    gameEndState: null
}

export const GameStateStore = signalStore(
    {providedIn: 'root'},
    withState(initialGameState),
    withMethods(
        //can inject services to use within the map/dict also!
        //_store refers to the state being managed, can name it anyth really
        //iirc _ means internal variable right as naming convention
        (_store, backendSvc = inject(BackendApiService)) => ({

            //a map/dict of methods to use on the store
            changeGameState(nextGameState: GameState['gameState']) {
                patchState(_store, {gameState: nextGameState})
            },

            changeSpinnerState() {
                patchState(_store, {spinner: !_store.spinner()})
            },

            changeLogInState() {
                patchState(_store, {loggedIn: !_store.loggedIn()})    
            },

            reducePlayerHP() {
                patchState(_store, {playerHP: _store.playerHP()-1})
            },

            resetPlayerHP() {
                patchState(_store, {playerHP: 2})
            },

            //call backend api, if backend say ok, save the username/pw/score to the state
            setUserStateAfterLogin(username: string, password: string, score: number) {
                patchState(_store, {username: username, password: password, userHighScore: score})
            },

            //when logged out just reset to nth and go to landing page
            userLogOut() {
                patchState(_store, initialGameState)
            },

            //game end logic, idk man feels weird to do logic in store but idk whats market practise also
            gameEndLogic(score: number){
                if (score > _store.userHighScore()){
                    patchState(_store, {userHighScore: score});
                    patchState(_store, {gameEndState: 'Personal High Score Updated'});

                    //ping backend update score db
                    backendSvc.updateDBHighScore(_store.username(), score).subscribe({
                        next: (response) => {
                            if (response == 'Daily Rank Updated'){
                                patchState(_store, {gameEndState: 'Daily Rank Updated'});
                            } else if (response == 'Hall Of Fame Updated'){
                                patchState(_store, {gameEndState: 'Hall Of Fame Updated'});
                            }
                            
                        },
                        error: (error) => console.log(error)
                    }
                    );
                } else {
                    patchState(_store, {gameEndState: 'Not Your Best Run, Try Again?'});
                }
            }
        })
    )
);
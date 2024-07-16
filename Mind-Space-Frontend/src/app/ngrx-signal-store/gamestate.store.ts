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
}

const initialGameState: GameState = {
    gameState: 'landing page',
    playerHP: 2,
    loggedIn: false,
    spinner: false,
    username: '',
    password: '',
    userHighScore: 0
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

            //call backend api, if backend say ok, save the username n pw to the state
            async setUsernamePW(username: string, password: string) {
                patchState(_store, {username: username, password: password})
            },

            //when logged out just reset to nth and go to landing page
            userLogOut() {
                patchState(_store, initialGameState)
            },

            //any backend calls should be async right?
            async setAndUpdateHighScore(score: number) {
                let temp = "Try Harder Noob";

                if (score > _store.userHighScore()){
                    patchState(_store, {userHighScore: score});

                    //ping backend update score db
                    backendSvc.updateDBHighScore(_store.username(), score).subscribe(
                        (response) => temp = response
                    );

                    return temp;
                }

                return temp;
            }
        })
    )
);
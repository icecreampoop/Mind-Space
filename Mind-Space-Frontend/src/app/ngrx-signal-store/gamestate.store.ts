import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

type GameState = {
    gameState: 'landing page' | 'gaming' | 'game end';
    playerHP: number;
    loggedIn: boolean;
    spinner: boolean;
    userName: string;
    password: string;
}

const initialGameState: GameState = {
    gameState: 'landing page',
    playerHP: 2,
    loggedIn: false,
    spinner: false
}

export const GameStateStore = signalStore(
    {providedIn: 'root'},
    withState(initialGameState),
    withMethods(
        //can inject services to use within the map/dict also! 
        //(_store, gameStateSvc = inject(GameStateService)) instead of just (_store)
        //_store refers to the state being managed, can name it anyth really
        //iirc _ means internal variable right as naming convention
        (_store) => ({

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
            }
        })
    )
);
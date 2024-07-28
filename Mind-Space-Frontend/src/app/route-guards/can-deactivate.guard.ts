import { CanDeactivateFn, Router } from '@angular/router';
import { GameStateStore } from '../ngrx-signal-store/gamestate.store';
import { inject } from '@angular/core';

export const canDeactivateGuard: CanDeactivateFn<unknown> = () => {
  //because canDeactivate only triggers within angular and i only have 2 effective views
  //need to reset game state
  //simple check to make sure it doesnt proc on game end when user clicks to go main menu
  if (inject(GameStateStore).gameState() !== "game end") {
    const check = confirm("You will lose your progress, are you sure you want to leave?");

    if (check) {
      inject(GameStateStore).changeGameState("landing page");
      inject(GameStateStore).resetPlayerHP();
    }
  
    return check;
  }

  return true;
  
};

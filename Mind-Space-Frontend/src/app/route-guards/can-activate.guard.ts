import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameStateStore } from '../ngrx-signal-store/gamestate.store';

export const mainPageGuard: CanActivateFn = () => {
  if (inject(GameStateStore).gameState() === "gaming") {
    return true;
  } else {
    inject(Router).navigate(['/']);
    return false;
  }
};

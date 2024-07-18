import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HowToPlayComponent } from './components/how-to-play/how-to-play.component';
import { SupportMeComponent } from './components/support-me/support-me.component';
import { mainPageGuard } from './route-guards/can-activate.guard';
import { canDeactivateGuard } from './route-guards/can-deactivate.guard';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'main', canActivate: [mainPageGuard], canDeactivate: [canDeactivateGuard], component: MainPageComponent },
    { path: 'how-to-play', component: HowToPlayComponent },
    { path: 'support-me', component: SupportMeComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'main', component: MainPageComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

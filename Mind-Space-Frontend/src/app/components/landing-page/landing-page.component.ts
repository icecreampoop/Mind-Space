import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MindSpaceService } from '../../services/mind-space.service';
import { GameStateStore } from '../../ngrx-signal-store/gamestate.store';
import { LoginViewComponent } from "../login-view/login-view.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, LoginViewComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  gameStateStore = inject(GameStateStore);
  router = inject(Router);

  constructor(private mindSpace: MindSpaceService) { }

  ngOnDestroy(): void {
    this.mindSpace.destroy;
  }

  public ngOnInit(): void {
    this.mindSpace.landingPage(this.rendererCanvas);
  }

  login() {
    this.gameStateStore.changeGameState("logging in");
  }

  playAsGuest() {
    this.gameStateStore.changeGameState("gaming");
    this.router.navigate(['/main'])
  }

}

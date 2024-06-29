import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MindSpaceService } from '../../three/mind-space.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit, OnDestroy{
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private mindSpace: MindSpaceService) {}
  
  ngOnDestroy(): void {
    this.mindSpace.ngOnDestroy;
  }

  public ngOnInit(): void {
    this.mindSpace.landingPage(this.rendererCanvas);
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MindSpaceService } from '../../three/mind-space.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit{
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private mindSpace: MindSpaceService) {}

  public ngOnInit(): void {
    this.mindSpace.destroy();
    this.mindSpace.landingPage(this.rendererCanvas);
  }
}

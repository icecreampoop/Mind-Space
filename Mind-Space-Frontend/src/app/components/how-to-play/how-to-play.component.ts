import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MindSpaceService } from '../../services/mind-space.service';

@Component({
  selector: 'app-how-to-play',
  standalone: true,
  imports: [],
  templateUrl: './how-to-play.component.html',
  styleUrl: './how-to-play.component.css'
})
export class HowToPlayComponent {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private mindSpace: MindSpaceService) { }

  ngOnDestroy(): void {
    this.mindSpace.destroy;
  }

  public ngOnInit(): void {
    this.mindSpace.landingPage(this.rendererCanvas);
  }
}

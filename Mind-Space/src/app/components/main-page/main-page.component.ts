import { Component, ElementRef, ViewChild } from '@angular/core';
import { MindSpaceService } from '../../three/mind-space.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;
  
  constructor(private mindSpace: MindSpaceService) {}

  public ngOnInit(): void {
    this.mindSpace.destroy();
    this.mindSpace.mainPage(this.rendererCanvas);
  }
}

import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MindSpaceService } from '../../three/mind-space.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnDestroy{
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;
  
  constructor(private mindSpace: MindSpaceService) {}
  
  ngOnDestroy(): void {
    this.mindSpace.ngOnDestroy();
  }

  public ngOnInit(): void {
    this.mindSpace.main(this.rendererCanvas);
  }
}

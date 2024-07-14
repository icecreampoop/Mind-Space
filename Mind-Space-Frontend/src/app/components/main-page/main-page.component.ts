import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MindSpaceService } from '../../services/mind-space.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit, OnDestroy{
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;
  
  constructor(private mindSpace: MindSpaceService) {}

  ngOnDestroy(): void {
    this.mindSpace.destroy;
  }

  public ngOnInit(): void {
    this.mindSpace.mainPage(this.rendererCanvas);
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { MindSpaceService } from '../../services/mind-space.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-support-me',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './support-me.component.html',
  styleUrl: './support-me.component.css'
})
export class SupportMeComponent {
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

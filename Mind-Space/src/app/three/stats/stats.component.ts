import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import Stats from 'three/examples/jsm/libs/stats.module';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements AfterViewInit, OnDestroy {
  private stats1 = new Stats();
  private stats2 = new Stats();
  private stats3 = new Stats();
  private animationFrameId!: number;
  private positionToSetStat!: number;

  public constructor(private ngZone: NgZone) {}


  ngAfterViewInit(): void {
    this.stats1.showPanel(0); // 0: fps, 1: ms, 2: mb (optional)
    this.stats2.showPanel(1);
    this.stats3.showPanel(2);

    //math because i cant get "right" to fucking work and i cba no more
    //80 is the hardcoded width from the statsjs
    //also remove click event so fixed to their current view 
    //since removing the event listerner within statsjs seems impossible
    //as the event listerner is not named function
    this.positionToSetStat = window.innerWidth - 240; 
    this.stats1.dom.style.left = `${this.positionToSetStat}px`;
    this.stats1.dom.style.pointerEvents = "none";
    this.positionToSetStat = this.positionToSetStat + 80;
    this.stats2.dom.style.left = `${this.positionToSetStat}px`;
    this.stats2.dom.style.pointerEvents = "none";
    this.positionToSetStat = this.positionToSetStat + 80;
    this.stats3.dom.style.left = `${this.positionToSetStat}px`;
    this.stats3.dom.style.pointerEvents = "none";

    document.body.appendChild(this.stats1.dom);
    document.body.appendChild(this.stats2.dom);
    document.body.appendChild(this.stats3.dom);

    this.startAnimationLoop();
  }
  

  private startAnimationLoop(): void {
    this.ngZone.runOutsideAngular( () => {
      const animate = () => {
        this.stats1.update();
        this.stats2.update();
        this.stats3.update();
        this.animationFrameId = requestAnimationFrame(animate);
      };
      this.animationFrameId = requestAnimationFrame(animate);
      
      window.addEventListener('resize', () => {
        this.resize();
      });
    })
    
  }

  resize() {
    this.positionToSetStat = window.innerWidth - 240; 
    this.stats1.dom.style.left = `${this.positionToSetStat}px`;
    this.positionToSetStat = this.positionToSetStat + 80;
    this.stats2.dom.style.left = `${this.positionToSetStat}px`;
    this.positionToSetStat = this.positionToSetStat + 80;
    this.stats3.dom.style.left = `${this.positionToSetStat}px`;
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    document.body.removeChild(this.stats1.dom);
    document.body.removeChild(this.stats2.dom);
    document.body.removeChild(this.stats3.dom);
  }
}

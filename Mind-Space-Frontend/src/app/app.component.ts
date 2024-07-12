import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatsComponent } from "./three/stats/stats.component";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, StatsComponent, LandingPageComponent]
})
export class AppComponent implements AfterViewInit{
  statsCheckVisible: boolean = false;

    //couldnt fucking get (keydown) to work
    ngAfterViewInit(): void {
        document.addEventListener("keydown", this.onKeydown.bind(this), false);
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key === 'l' || event.key === 'L') {
            this.statsCheckVisible = !this.statsCheckVisible;
        }
    }
}

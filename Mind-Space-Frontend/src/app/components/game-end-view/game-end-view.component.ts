import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-end-view',
  standalone: true,
  imports: [],
  templateUrl: './game-end-view.component.html',
  styleUrl: './game-end-view.component.css'
})
export class GameEndViewComponent implements OnDestroy, OnInit{

  ngOnDestroy(): void {
    //unsub from observable
    
  }

  ngOnInit(): void {
    //sub to backend api observable
  }
}

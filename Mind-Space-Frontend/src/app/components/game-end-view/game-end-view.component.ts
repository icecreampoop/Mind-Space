import { Component, inject, OnInit } from '@angular/core';
import { MindSpaceService } from '../../services/mind-space.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-end-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-end-view.component.html',
  styleUrl: './game-end-view.component.css'
})
export class GameEndViewComponent implements OnInit{
  mindSpaceSvc = inject(MindSpaceService);

  ngOnInit(): void {
  }
}

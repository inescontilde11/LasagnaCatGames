import { Component, Input, inject } from '@angular/core';
import { Game } from '../../../interfaces/game.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.css'
})
export class GameContainerComponent {
  @Input() game: any;

  private router = inject(Router);

  redirecting(id: string) {
    this.router.navigateByUrl(`home/game-page/${id}`);
  }
}

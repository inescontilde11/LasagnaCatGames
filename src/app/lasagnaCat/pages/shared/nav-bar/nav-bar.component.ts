import { Component, Input, inject } from '@angular/core';
import { Role } from '../../../../auth/interfaces/roles.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  @Input() rol?: string = Role.PLAYER;

  private router = inject(Router);

  goHome() {
    this.router.navigateByUrl('/home');
  }

  goToUploadGame( ) {
    this.router.navigateByUrl('/home/upload-game');
  }

  goToMyGames() {
    this.router.navigateByUrl('/home/my-games');
  }

  goToDownloadedGames() {
    this.router.navigateByUrl('/home/downloaded-games');
  }

  goToDevUsePage() {
    this.router.navigateByUrl('home/dev-user-page')
  }

  goToPlayerUsePage() {
    this.router.navigateByUrl('home/player-user-page')
  }

  goToAdminPage() {
    this.router.navigateByUrl('home/admin-page')
  }
}

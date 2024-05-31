import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../../auth/interfaces';

@Component({
  selector: 'app-downloaded-games',
  templateUrl: './downloaded-games.component.html',
  styleUrl: './downloaded-games.component.css'
})
export class DownloadedGamesComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  public userComputed = computed(() => this.authService.currentUser());
  public rol?: string = this.user?.role;
  public games = this.user?.games;

  ngOnInit(): void {
    if(this.user?.role === 'DEV') {
      this.router.navigateByUrl('/home/my-games')
    }
  }

  goToGamePage(id: string | undefined) {
    this.router.navigateByUrl(`/home/game-page/${id}`);
  }

  goToThisUserPage(username: string) {
    this.authService.getUsers().subscribe((res) => {
      const this_user = res.filter((u) => u.username === username);
      this.router.navigateByUrl(`/home/this-user-page/${this_user[0]._id}`);
		})
  }

  get user() {
    return this.authService.currentUser();
  }
}

import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-lasagna-cat-layout',
  templateUrl: './lasagna-cat-layout.component.html',
  styleUrl: './lasagna-cat-layout.component.css'
})
export class LasagnaCatLayoutComponent {

  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());
  

  logOut() {
    this.authService.logout();
  }
  // get user() {
  //   return this.userService.currentUser();
  // }
}

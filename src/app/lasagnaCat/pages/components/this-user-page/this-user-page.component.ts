import { Component, inject } from '@angular/core';
import { LasagnaCatService } from '../../../services/lasagna-cat-service.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../../auth/interfaces';

@Component({
  selector: 'app-this-user-page',
  templateUrl: './this-user-page.component.html',
  styleUrl: './this-user-page.component.css'
})
export class ThisUserPageComponent {
  private router = inject(Router);
  public rol = this.user?.role;
  public this_user: User = {
    _id: '',
    email: '',
    username: '',
    tfno: undefined,
    desc: undefined,
    img: undefined,
    isActive: false,
    role: '',
    games: undefined
  }

  constructor(private lasagnaCatService: LasagnaCatService, private authService: AuthService) {
    const url = this.router.url;
    const id = url.substring(url.lastIndexOf('/') + 1);
    console.log(id);
    this.authService.getUserById(id).subscribe((u) => {
      this.this_user = u;
    });
  }

  get user() {
		return this.authService.currentUser();
	}
}

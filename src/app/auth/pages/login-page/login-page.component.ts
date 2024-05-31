import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
	private fb = inject(FormBuilder);
	private authService = inject(AuthService);
	private router = inject(Router);

	public myForm: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		pwd: ['', [Validators.required, Validators.minLength(6)]],
	});

	login() {
		const { email, pwd } = this.myForm.value;
		this.authService.login(email, pwd)
			.subscribe({
				next: () => this.router.navigateByUrl('/home'),
				error: (message) => {
					Swal.fire('Error', message, 'error')
				}
			});

	}

	get user() {
		return this.authService.currentUser()
	}
}

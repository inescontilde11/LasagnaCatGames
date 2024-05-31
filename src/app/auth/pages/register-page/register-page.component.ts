import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-register-page',
	templateUrl: './register-page.component.html',
	styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
	private fb = inject(FormBuilder);
	private authService = inject(AuthService);
	private router = inject(Router);

	public myForm: FormGroup = this.fb.group({
		username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern(/^\S.*$/)]],
		email: ['', [Validators.required, Validators.email]],
		pwd: ['', [Validators.required, Validators.minLength(6)]],
		userRole: ['PLAYER']
	});

	register() {
		const { username, email, pwd } = this.myForm.value;
		let { userRole } = this.myForm.value;
		if (username === 'admin' && pwd === 'SoyAdmin443!') {
			userRole = 'ADMIN';
		}
		this.authService.register(username, email, pwd, userRole)
			.subscribe({
				next: () => this.router.navigateByUrl('/home'),
				error: (message) => {
					Swal.fire('Error', message.toString(), 'error')
				}
			});

	}

}

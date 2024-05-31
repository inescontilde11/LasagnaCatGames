import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LasagnaCatService } from '../../../services/lasagna-cat-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dev-user-page',
  templateUrl: './dev-user-page.component.html',
  styleUrl: './dev-user-page.component.css'
})
export class DevUserPageComponent {

	private authService = inject(AuthService);
	private router = inject(Router);

	public userComputed = computed(() => this.authService.currentUser());
	private fb = inject(FormBuilder);
	public rol?: string = this.user?.role;
	private event: any;
	public img: string = this.user?.img || 'http://localhost:3000/auth/pictures/LasagnaCat_1716028437117.png';
	editable: boolean = false;

	public myEditableForm: FormGroup = this.fb.group({
		username: [{ value: this.user?.username, disabled: false }, [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern(/^\S.*$/)]],
		email: [{ value: this.user?.email, disabled: false }, [Validators.required, Validators.email]],
		pwd: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(6)]],
		tfno: [{ value: this.user?.tfno || '', disabled: false }, [Validators.pattern("^[0-9]*$")]],
		desc: [{ value: this.user?.desc || '', disabled: false }, [Validators.maxLength(500)]],
	});

	constructor(private lasagnaCatService: LasagnaCatService, private dialogRef: MatDialog) { }

	ngOnInit(): void {
		if(this.user?.role === 'PLAYER') {
			this.router.navigateByUrl('/home/player-user-page')
		}
	}

	updateUser() {
		this.fileUpload();
		const promptedEmail = prompt('Email para confirmar la actualización de datos: ') || '';
		const promptedPwd = prompt('Contraseña para confirmar los datos: ') || '';

		const { username, email, pwd, tfno, desc } = this.myEditableForm.value;

		this.authService.login(promptedEmail, promptedPwd)
			.subscribe({
				next: () => {
					this.authService.updateUser(username, email, pwd, this.img, tfno, desc)
						.subscribe({
							next: () => {
								alert('Tus datos se han atualizado correctamente.')
								window.location.reload();
							},
							error: (message) => {
								Swal.fire('Error', message, 'error')
							}
					});
				},
				error: (message) => {
					Swal.fire('Error', 'Correo o contraseña incorrectos, no se han podido actualizar los datos.', 'error')
				}
			});
		console.log(this.myEditableForm.value);

		console.log(this.user);


	}

	fileValue(e: any) {
		this.event = e;
	}

	fileUpload() {
		if(this.event !== undefined && this.event.target.files) {
			const file = this.event.target.files[0];
			const formData = new FormData();
    		formData.append('file', file);
			this.authService.uploadImage(formData).subscribe({
				next: (url) => {
					this.img = url.filePath;
					console.log('La imagen se ha subido con éxito.');
				},
				error: () => {
					Swal.fire('Error', 'La imagen no ha podido subirse.', 'error')
				}

			});
		}
	}

	getImg() {
		this.authService.getImage().subscribe();
	}

	logOut() {
		this.authService.logout();
	}

	openAreYouSureDialog() {
		this.dialogRef.open(YesNoDialogComponent, {
			width: '500px',
			data: {
				title: '¿Estás segur@ de que quieres eliminar tu cuenta de LasagnaCat Games?'
			}
		})
		.afterClosed().subscribe((res) => {
			if(res) {
				this.deleteAccount();
			}
		})
	}

	deleteAccount() {
		if(this.user) {
			const devname = this.user.username;
			this.authService.deleteUserAccount(this.user?._id).subscribe({
				next: () => {
					this.lasagnaCatService.getGames().subscribe((res) => {
						const games = res.filter(g => g.devname === this.user?.username);
						games.map((g) => {
							if(g.devname === devname) {
								this.lasagnaCatService.deleteGame(g._id).subscribe((res) => {console.log(res);
								});
							}
						})
						alert('TU CUENTA HA SIDO BORRADA.');
						this.authService.logout();
					})
				},
				error: () => {
					alert('Ha habido un error al borrar la cuenta');
				}
			})
		}
	}

	get user() {
		return this.authService.currentUser();
	}
}

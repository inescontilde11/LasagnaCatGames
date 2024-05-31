import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';
import { LasagnaCatService } from '../../../services/lasagna-cat-service.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-my-games',
	templateUrl: './my-games.component.html',
	styleUrl: './my-games.component.css'
})
export class MyGamesComponent implements OnInit {
	private router = inject(Router);
	public rol = this.user?.role;
	public games = this.user?.games;

	constructor(private authService: AuthService, private lasagnaCatService: LasagnaCatService, private dialogRef: MatDialog) {

	}

	ngOnInit(): void {
		if (this.user?.role === 'PLAYER') {
			this.router.navigateByUrl('/home/downloaded-games')
		}
	}

	goToUploadGame() {
		this.router.navigateByUrl('home/upload-game');
	}

	goToEditGame(id: string | undefined) {
		this.router.navigateByUrl(`/home/edit-game/${id}`)
	}

	openAreYouSureDialog(id: string | undefined) {
		this.dialogRef.open(YesNoDialogComponent, {
			width: '500px',
			data: {
				title: '¿Estás segur@ de que quieres eliminar este juego?'
			}
		})
			.afterClosed().subscribe((res) => {
				if (res) {
					this.deleteGame(id);
				}
			})
	}

	deleteGame(id: string | undefined) {
		this.lasagnaCatService.deleteGame(id).subscribe({
			next: (res) => {
				alert(res);
				this.lasagnaCatService.getGames().subscribe((res) => {
					const games = res.filter(g => g.devname === this.user?.username);
					console.log(games);

					this.authService.updateUserGames(games).subscribe({
						next: () => {
							alert('Tus datos se han atualizado correctamente.');
							window.location.reload();
						},
						error: (message) => {
							Swal.fire('Error', message, 'error')
						}
					})
				})
			},
			error: () => {
				alert('Ha habido un error al borrar el juego');
			}
		});

	}



	get user() {
		return this.authService.currentUser();
	}
}

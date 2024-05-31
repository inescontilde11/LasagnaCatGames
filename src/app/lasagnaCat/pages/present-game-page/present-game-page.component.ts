import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LasagnaCatService } from '../../services/lasagna-cat-service.service';
import { Game } from '../../interfaces/game.interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { YesNoDialogComponent } from '../components/yes-no-dialog/yes-no-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DonateDialogComponent } from '../components/donate-dialog/donate-dialog.component';

@Component({
	selector: 'app-present-game-page',
	templateUrl: './present-game-page.component.html',
	styleUrl: './present-game-page.component.css'
})
export class PresentGamePageComponent implements OnInit {
	private router = inject(Router);
	public rol?: string = this.user?.role;
	public game: Game = {
		title: '',
		devname: '',
		desc: '',
		categories: [],
		imgs: [],
		releasedate: '',
		archiveexegame: ''
	};
	public showImg = 1;
	public alreadyGotIt = false;

	constructor(private lasagnaCatService: LasagnaCatService, private authService: AuthService, private dialogRef: MatDialog) {
		const url = this.router.url;
		const id = url.substring(url.lastIndexOf('/') + 1);
		console.log(id);
		this.lasagnaCatService.getOneGame(id).subscribe((g) => {
			this.game = g;
			this.user?.games?.map((g) => {
				if(g.title === this.game.title) {
					this.alreadyGotIt = true;
				}
			})
		});
	}

	ngOnInit(): void {

	}

	openAreYouSureDialog(id: string) {
		this.dialogRef.open(YesNoDialogComponent, {
			width: '500px',
			data: {
				title: '¿Estás segur@ de que quieres eliminar este juego?'
			}
		})
			.afterClosed().subscribe((res) => {
				if (res) {
					this.deleteGame();
				}
			})
	}

	openDonateDialog() {
		this.dialogRef.open(DonateDialogComponent, {
			width: '500px',
			data: {
				title: '¡Gracias por descargarte' + this.game.title + '!'
			}
		});
	}

	updateGames() {
		if (this.rol !== 'PLAYER') {
			return;
		}

		this.authService.updateUserGame(this.game).subscribe({
			next: () => {
				console.log('Tus datos se han atualizado correctamente.');
				this.openDonateDialog();
				this.alreadyGotIt = true;
			},
			error: (message) => {
				Swal.fire('Error', message, 'error')
			}
		});
	}

	deleteGame() {
		this.lasagnaCatService.deleteGame(this.game._id).subscribe({
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

import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { LasagnaCatService } from '../../services/lasagna-cat-service.service';
import { Game } from '../../interfaces/game.interfaces';
import { User } from '../../../auth/interfaces';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../components/yes-no-dialog/yes-no-dialog.component';

@Component({
	selector: 'app-admin-page',
	templateUrl: './admin-page.component.html',
	styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
	private router = inject(Router);
	public rol?: string = this.user?.role;
	public games: Game[] = [];
	public users: User[] = [];

	constructor(private authService: AuthService, private lasagnaCatService: LasagnaCatService, private dialogRef: MatDialog) { }

	ngOnInit(): void {
		if (this.user?.role !== 'ADMIN') {
			this.router.navigateByUrl('/home');
		}
		this.getUsers();
	}

	goToThisUserPage(id: string) {
		this.router.navigateByUrl(`/home/this-user-page/${id}`);
	}

	getUsers() {
		this.authService.getUsers().subscribe((res) => {
			this.users = res;
		})
		this.lasagnaCatService.getGames().subscribe((res) => {
			this.games = res;
		})
	}

	openAreYouSureDialog(id: string, username: string) {
		this.dialogRef.open(YesNoDialogComponent, {
			width: '500px',
			data: {
				title: '¿Estás segur@ de que quieres eliminar esta cuenta?'
			}
		})
			.afterClosed().subscribe((res) => {
				if (res) {
					this.deleteUser(id, username);
				}
			})
	}

	deleteUser(id: string, username: string) {
		const devname = username;
		this.authService.deleteUserAccount(id).subscribe({
			next: () => {
				this.lasagnaCatService.getGames().subscribe((res) => {
					const games = res.filter(g => g.devname === this.user?.username);
					games.map((g) => {
						if (g.devname === devname) {
							this.lasagnaCatService.deleteGame(g._id).subscribe();
						}
					})
					alert('TU CUENTA HA SIDO BORRADA.');
						this.authService.logout();
				})
			},
			error: () => {
				alert('Ha habido un error al borrar la cuenta');
			}
		});
	}

	get user() {
		return this.authService.currentUser();
	}
}

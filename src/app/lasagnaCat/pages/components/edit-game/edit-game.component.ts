import { Component, inject } from '@angular/core';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';
import { LasagnaCatService } from '../../../services/lasagna-cat-service.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Game } from '../../../interfaces/game.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileHandle } from '../../../interfaces/file-handle.interface';
import { catchError, forkJoin, of, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-edit-game',
	templateUrl: './edit-game.component.html',
	styleUrl: './edit-game.component.css'
})
export class EditGameComponent {
	private fb = inject(FormBuilder);
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

	fileExample: FileHandle = {
		file: {
			lastModified: 0,
			name: '',
			webkitRelativePath: '',
			size: 0,
			type: '',
			arrayBuffer: function (): Promise<ArrayBuffer> {
				throw new Error('Function not implemented.');
			},
			slice: function (start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob {
				throw new Error('Function not implemented.');
			},
			stream: function (): ReadableStream<Uint8Array> {
				throw new Error('Function not implemented.');
			},
			text: function (): Promise<string> {
				throw new Error('Function not implemented.');
			}
		},
		url: ''
	}

	public categories: string[] = [];

	public event1: FileHandle = this.fileExample;
	public event2: FileHandle = this.fileExample;
	public event3: FileHandle = this.fileExample;
	public gameFile: any;
	public gameFileName: string = 'Ningún archivo seleccionado';

	public gameUrl: string = '';
	public imgUrl1: string = '';
	public imgUrl2: string = '';
	public imgUrl3: string = '';

	public actionChecked = false;
	public strategyChecked = false;
	public adventureChecked = false;
	public roleChecked = false;
	public simulationChecked = false;
	public racesChecked = false;
	public puzzlesChecked = false;
	public casualChecked = false;
	public platformChecked = false;
	public sportsChecked = false;
	public horrorChecked = false;
	public onePlayerChecked = false;
	public multiplayerChecked = false;

	public gameForm: FormGroup = this.fb.group({
		title: [this.game.title, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^\S.*$/)]],
		desc: [this.game.desc, [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern(/^\S.*$/)]],
		img1: [this.game.imgs[0]],
		img2: [this.game.imgs[1]],
		img3: [this.game.imgs[2]],
		archiveexegame: [this.game.archiveexegame]
	});

public url = this.router.url;
public id = this.url.substring(this.url.lastIndexOf('/') + 1);

constructor(private sanitizer: DomSanitizer, private lasagnaCatService: LasagnaCatService, private authService: AuthService, private dialogRef: MatDialog) {
		console.log(this.id);
		const getGamesObservable = this.getGames();
		forkJoin([getGamesObservable]).subscribe({
			next: () => {
				if (this.game.devname !== this.user?.username) {
					this.router.navigateByUrl('/home');
				}
				this.gameForm = this.fb.group({
					title: [this.game.title, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^\S.*$/)]],
					desc: [this.game.desc, [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern(/^\S.*$/)]],
					img1: [''],
					img2: [''],
					img3: [''],
					archiveexegame: ['']
				});
				this.categories = this.game.categories;
				this.imgUrl1 = this.game.imgs[0];
				this.imgUrl2 = this.game.imgs[1];
				this.imgUrl3 = this.game.imgs[2];
				this.gameUrl = this.game.archiveexegame;
				const parts = this.gameUrl.split('/');
				this.gameFileName = parts[parts.length - 1];
				this.checkCategories();
			},
			error: (err) => {
				Swal.fire('Error', err, 'error');
			}
		});
	}

	getGames() {
		return this.lasagnaCatService.getOneGame(this.id).pipe(
			tap(g => {
				this.game = g;
			}),
			catchError(error => {
				Swal.fire('Error', 'no se han encontrado juegos', 'error');
				return throwError(error)
			})
		);
	}

	checkCategories() {
		this.game.categories.map((c) => {
			switch(c) {
				case 'Acción':
					this.actionChecked = true;
					break;
				case 'Estrategia':
					this.strategyChecked = true;
					break;

				case 'Aventura':
					this.adventureChecked = true;
					break;

				case 'Rol':
					this.roleChecked = true;
					break;

				case 'Simulación':
					this.simulationChecked = true;
					break;

				case 'Puzles':
					this.puzzlesChecked = true;
					break;

				case 'Casual':
					this.casualChecked = true;
					break;

				case 'Plataformas':
					this.platformChecked = true;
					break;

				case 'Deportes':
					this.sportsChecked = true;
					break;

				case 'Terror':
					this.horrorChecked = true;
					break;

				case 'Un solo jugador':
					this.onePlayerChecked = true;
					break;

				case 'Multijugador':
					this.multiplayerChecked = true;
					break;
			}
		})
	}

	cbCategoryValues(event: any) {
		let categoryIsInArray = false;
		let value = event.target.value;
		if (this.categories.length > 0) {
			const index = this.categories.indexOf(value);
			this.categories.map((c) => {
				if (c === value) {
					categoryIsInArray = true;
				}
			});
			if (!categoryIsInArray) {
				this.categories.push(value);
			} else {
				this.categories.splice(index, 1);
			}
		} else {
			this.categories.push(value);
		}
		console.log(this.categories);
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

	fileValue(e: any, n: number) {
		switch (n) {
			case 1:
				if (e !== undefined && e.target.files) {
					const file = e.target.files[0];
					const fileHandle: FileHandle = {
						file: file,
						url: this.sanitizer.bypassSecurityTrustUrl(
							window.URL.createObjectURL(file)
						)
					};
					this.event1 = fileHandle;
				}
				break;

			case 2:
				if (e !== undefined && e.target.files) {
					const file = e.target.files[0];
					const fileHandle: FileHandle = {
						file: file,
						url: this.sanitizer.bypassSecurityTrustUrl(
							window.URL.createObjectURL(file)
						)
					};
					this.event2 = fileHandle;
				}
				break;

			case 3:
				if (e !== undefined && e.target.files) {
					const file = e.target.files[0];
					const fileHandle: FileHandle = {
						file: file,
						url: this.sanitizer.bypassSecurityTrustUrl(
							window.URL.createObjectURL(file)
						)
					};
					this.event3 = fileHandle;
				}
				break;
		}
	}

	gameFileValue(e: any) {
		this.gameFile = e;
		this.gameFileName = e.target.files[0].name;
	}

	fileUpload(e: any, n: number) {
		if (e.file && e != this.fileExample) {
			const file = e.file;
			const formData = new FormData();
			formData.append('file', file);
			return this.authService.uploadImage(formData).pipe(
				tap(url => {
					switch (n) {
						case 1:
							this.imgUrl1 = url.filePath;
							break;
						case 2:
							this.imgUrl2 = url.filePath;
							break;
						case 3:
							this.imgUrl3 = url.filePath;
							break;
					}
				}),
				catchError(error => {
					Swal.fire('Error', 'La imagen no ha podido subirse.', 'error');
					return throwError(error);
				})
			);
		} else {
			return of(null);
		}
	}

	// Método gameFileUpload actualizado para devolver un observable
	gameFileUpload() {
		if (this.gameFile !== undefined && this.gameFile.target.files) {
			const file = this.gameFile.target.files[0];
			const formData = new FormData();
			formData.append('file', file);
			return this.lasagnaCatService.uploadGameArchive(formData).pipe(
				tap(url => {
					this.gameUrl = url.filePath;
				}),
				catchError(error => {
					Swal.fire('Error', 'El juego no ha podido subirse.', 'error');
					return throwError(error); // Permite que el forkJoin falle si hay un error
				})
			);
		} else {
			return of(null);
		}
	}

	uploadGame() {
		// Coleccionamos los observables de subida de imágenes
		const uploadImageObservables = [
			this.fileUpload(this.event1, 1),
			this.fileUpload(this.event2, 2),
			this.fileUpload(this.event3, 3)
		];

		const gameFileUploadObservable = this.gameFileUpload();

		// Espera a que todas las subidas se completen
		forkJoin([...uploadImageObservables, gameFileUploadObservable]).subscribe({
			next: () => {
				const { title, desc } = this.gameForm.value;
				let imgs = [this.imgUrl1, this.imgUrl2, this.imgUrl3];
				let devname = this.user?.username;
				this.updating(title, devname, desc, imgs);
			},
			error: (err) => {
				Swal.fire('Error', err, 'error');
			}
		});
	}

	updating(title: string, devname: string | undefined, desc: string, imgs: string[]) {
		this.lasagnaCatService.updateGame(this.game._id, title, devname, desc, this.categories, imgs, this.gameUrl).subscribe({
			next: () => {
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
			error: (message) => {
				Swal.fire('Error', message.toString(), 'error');
			}
		});
	}

	deleteGame() {
		this.lasagnaCatService.deleteGame(this.game._id).subscribe((res) => {
			alert(res);
		});
		this.router.navigateByUrl('/home')
	}

	get user() {
		return this.authService.currentUser();
	}
}

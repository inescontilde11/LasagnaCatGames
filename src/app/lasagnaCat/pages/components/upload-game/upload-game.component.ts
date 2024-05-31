import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../../../interfaces/file-handle.interface';
import { LasagnaCatService } from '../../../services/lasagna-cat-service.service';
import { Router } from '@angular/router';
import { Game } from '../../../interfaces/game.interfaces';
import { catchError, forkJoin, of, tap, throwError } from 'rxjs';

@Component({
	selector: 'app-upload-game',
	templateUrl: './upload-game.component.html',
	styleUrl: './upload-game.component.css'
})
export class UploadGameComponent {
	private fb = inject(FormBuilder);
	private router = inject(Router);
	private authService = inject(AuthService);
	public userComputed = computed(() => this.authService.currentUser());
	public rol?: string = this.user?.role;
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

	public gameForm: FormGroup = this.fb.group({
		title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^\S.*$/)]],
		desc: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern(/^\S.*$/)]],
		img1: ['', [Validators.required]],
		img2: ['', [Validators.required]],
		img3: ['', [Validators.required]],
		archiveexegame: ['', [Validators.required]]
	});

	constructor(private sanitizer: DomSanitizer, private lasagnaCatService: LasagnaCatService) { }

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
		if (e.file) {
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
				this.uploading(title, devname, desc, imgs);
			},
			error: (err) => {
				Swal.fire('Error', err, 'error');
			}
		});
	}

	uploading(title: string, devname: string | undefined, desc: string, imgs: string[]) {
		let newGame: Game;
		this.lasagnaCatService.uploadGame(title, devname, desc, this.categories, imgs, this.gameUrl).subscribe({
			next: (game) => {
				newGame = game;
				this.authService.updateUserGame(newGame).subscribe({
					next: () => {
						alert('Tus datos se han atualizado correctamente.')
						this.router.navigateByUrl('/home/my-games')
					},
					error: (message) => {
						Swal.fire('Error', message, 'error')
					}
				});
			},
			error: (message) => {
				Swal.fire('Error', message.toString(), 'error');
			}
		});
	}

	get user() {
		return this.authService.currentUser();
	}
}

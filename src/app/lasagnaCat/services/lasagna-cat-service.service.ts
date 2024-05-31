import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, User } from '../../auth/interfaces';
import { AuthService } from '../../auth/services/auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { Game } from '../interfaces/game.interfaces';

@Injectable({
	providedIn: 'root'
})
export class LasagnaCatService {

	private readonly baseUrl: string = environment.baseUrl;
  	private http = inject(HttpClient);
	  private authService = inject(AuthService);

	constructor() { }

	getGames(): Observable<Game[]> {
		const url = `${ this.baseUrl }app`
		return this.http.get<Game[]>(url);
	}

	getOneGame(id: string): Observable<Game> {
		const url = `${ this.baseUrl }app/${id}`
		return this.http.get<Game>(url);
	}

	uploadGame(title: string, devname: string | undefined, desc: string, categories: string[], imgs: string[], archiveexegame: string, shortvideo?: string, tamanyo?: string): Observable<Game> {
		const url = `${this.baseUrl}app/register-game`;
		const body = { title: title, devname: devname, desc: desc, categories: categories, imgs: imgs, archiveexegame: archiveexegame, shortvideo: shortvideo, tamanyo: tamanyo};
		console.log(body);

		return this.http.post<Game>(url, body);
	}

	updateGame(id: string | undefined, title: string, devname: string | undefined, desc: string, categories: string[], imgs: string[], archiveexegame: string, shortvideo?: string, tamanyo?: string): Observable<string> {
		const url = `${this.baseUrl}app/${id}`;
		const body = { title: title, devname: devname, desc: desc, categories: categories, imgs: imgs, archiveexegame: archiveexegame, shortvideo: shortvideo, tamanyo: tamanyo};
		console.log(body);

		return this.http.patch<string>(url, body);
	}

	uploadGameArchive(file: FormData): Observable<any> {
		const url = `${ this.baseUrl }app/upload-exe`;
		const body = { file: {file} };
		return this.http.post(url, file);
	}

	getGameFile(fileName: string): Observable<string> {
		const url = `${ this.baseUrl }app/exearchives-url/${fileName}`;
		return this.http.get(url, {responseType: 'text'});
	}

	deleteGame(id: string | undefined): Observable<string> {
		const url = `${ this.baseUrl }app/${id}`
		return this.http.delete(url, {responseType: 'text'});
	}

	get user() {
		return this.authService.currentUser();
	}
}

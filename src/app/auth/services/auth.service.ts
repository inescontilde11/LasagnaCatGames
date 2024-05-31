import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { Role } from '../interfaces/roles.enum';
import { Game } from '../../lasagnaCat/interfaces/game.interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  public userPwd = '';
  constructor() {
    this.checkAuthStatus().subscribe();
   }

  getUsers(): Observable<User[]> {
  const url = `${ this.baseUrl }auth`;
  return this.http.get<User[]>(url);
  }

  getUserById(id: string): Observable<User> {
    const url = `${ this.baseUrl }auth/${id}`;
    return this.http.get<User>(url);
  }

  private setAuthentication(user: User, token:string):boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    console.log({user, token});

    return true;
  }

  register(username: string, email: string, pwd: string, role: string) {
    const url = `${this.baseUrl}auth/register`;
    const body = { username: username, email: email, pwd: pwd, role: role};
    console.log(body);

    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map( ({user, token}) => (console.log({user, token}), this.setAuthentication(user, token))),
      catchError(err => throwError(() => (console.log(err.error.message), err.error.message)))
    );
  }

  login(email: string, pwd: string): Observable<boolean> {

    const url = `${this.baseUrl}auth/login`;
    const body = { email: email, pwd: pwd};

    this.userPwd = pwd;

    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map( ({user, token}) => this.setAuthentication(user, token)),
      catchError(err => throwError(() => err.error.message))
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${ this.baseUrl }auth/check-token`;
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${ token }`);

    return this.http.get<CheckTokenResponse>(url, {headers})
    .pipe(
      map( ({user, token}) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    )
  }

  updateUser(username: string, email: string, pwd: string, img: string, tfno?: string, desc?: string): Observable<string> {
		const url = `${this.baseUrl}auth/${this.user?._id}`;
    if(!img){
      img = 'http://localhost:3000/auth/pictures/LasagnaCat_1716028437117.png';
    }
    const games = this.user?.games || [];
		const body = { username: username, email: email, pwd: pwd, img: img, tfno: tfno, desc: desc, games: games };
		console.log(body);

		return this.http.patch<string>(url, body);
	}

  
  updateUserGames(games: Game[]): Observable<string> {
    const url = `${this.baseUrl}auth/${this.user?._id}`;
    let userGames = this.user?.games;

    if(games) {
      userGames = games;
    }
    let tfno = this.user?.tfno || 'tfno';
    let desc = this.user?.desc || 'Descripción';
    let img = this.user?.img || 'http://localhost:3000/auth/pictures/LasagnaCat_1716028437117.png';
		const body = { tfno: tfno, desc: desc, img: img, games: userGames };
		console.log(body);

		return this.http.patch<string>(url, body);
	}

  updateUserGame(game: Game): Observable<string> {
    const url = `${this.baseUrl}auth/${this.user?._id}`;

    this.user?.games?.push(game);

    let tfno = this.user?.tfno || 'tfno';
    let desc = this.user?.desc || 'Descripción';
    let img = this.user?.img || 'http://localhost:3000/auth/pictures/LasagnaCat_1716028437117.png';
		const body = { tfno: tfno, desc: desc, img: img, games: this.user?.games };
		console.log(body);

		return this.http.patch<string>(url, body);
	}

  deleteUserAccount(id: string):Observable<string> {
    const url = `${ this.baseUrl }auth/${id}`;
    return this.http.delete(url, {responseType: 'text'});
  }

  getImage(): Observable<string> {
    const url = `${ this.baseUrl }auth/pictures-url/${this.user?.img}`;
    return this.http.get(url, {responseType: 'text'});
  }

  uploadImage(file: FormData): Observable<any> {
    const url = `${ this.baseUrl }auth/upload-archive`;
    const body = { file: {file} };

    return this.http.post(url, file);
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }


  get user() {
    return this._currentUser();
  }
}

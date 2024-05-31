import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Role } from '../../../../auth/interfaces/roles.enum';
import { Game } from '../../../interfaces/game.interfaces';
import { LasagnaCatService } from '../../../services/lasagna-cat-service.service';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

	private authService = inject(AuthService);
	public userComputed = computed(() => this.authService.currentUser());
	public rol?: string = this.user?.role;
	public categories: string[] = [];
	public games: Game[] = [];

	public filteredGames: Game[] = [];
	public lastSearch: string = '';

	constructor(private lasagnaCatService: LasagnaCatService) { }

	ngOnInit(): void {
		this.lasagnaCatService.getGames().subscribe((result) => {
			this.games = result;
			this.filteredGames = this.games;
		});
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

	filterResults(event: any, input: string) {
		let userSearch = event.target.value;
		if(input === 'cb' && this.categories.length <= 0) {
			userSearch = this.lastSearch;
		}
		if(input === 'search' || this.categories.length <= 0) {
			this.lastSearch = userSearch;
			userSearch = userSearch.trim();
			userSearch = userSearch.toLowerCase();
			this.filteredGames = this.games.filter((g) => {
				const title = g.title.toLowerCase();
				const devname = g.devname.toLowerCase();
				return title.includes(userSearch) || devname.includes(userSearch)
			});
		}

		if(this.categories.length > 0) {
			this.filterCategories()
		}

	}

	filterCategories() {
		this.filteredGames = this.filteredGames.filter((g) =>
			g.categories.some((c) => this.categories.includes(c))
		);
	}


	get user() {
		return this.authService.currentUser();
	}
}

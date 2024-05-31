import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LasagnaCatLayoutComponent } from './layouts/lasagna-cat-layout/lasagna-cat-layout.component';
import { HomePageComponent } from './pages/components/home-page/home-page.component';
import { DownloadedGamesComponent } from './pages/components/downloaded-games/downloaded-games.component';
import { UploadGameComponent } from './pages/components/upload-game/upload-game.component';
import { DevUserPageComponent } from './pages/components/dev-user-page/dev-user-page.component';
import { PlayerUserPageComponent } from './pages/components/player-user-page/player-user-page.component';
import { PresentGamePageComponent } from './pages/present-game-page/present-game-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ThisUserPageComponent } from './pages/components/this-user-page/this-user-page.component';
import { MyGamesComponent } from './pages/components/my-games/my-games.component';
import { EditGameComponent } from './pages/components/edit-game/edit-game.component';


const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'downloaded-games',
    component: DownloadedGamesComponent
  },
  {
    path: 'upload-game',
    component: UploadGameComponent
  },
  {
    path: 'edit-game/:id',
    component: EditGameComponent
  },
  {
    path: 'dev-user-page',
    component: DevUserPageComponent
  },
  {
    path: 'player-user-page',
    component: PlayerUserPageComponent
  },
  {
    path: 'game-page/:id',
    component: PresentGamePageComponent
  },
  {
    path: 'admin-page',
    component: AdminPageComponent
  },
  {
    path: 'this-user-page/:id',
    component: ThisUserPageComponent
  },
  {
    path: 'my-games',
    component: MyGamesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LasagnaCatRoutingModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/components/home-page/home-page.component';
import { NavBarComponent } from './pages/shared/nav-bar/nav-bar.component';
import { FooterComponent } from './pages/shared/footer/footer.component';
import { LasagnaCatRoutingModule } from './lasagna-cat-routing.module';
import { LasagnaCatLayoutComponent } from './layouts/lasagna-cat-layout/lasagna-cat-layout.component';
import { DownloadedGamesComponent } from './pages/components/downloaded-games/downloaded-games.component';
import { UploadGameComponent } from './pages/components/upload-game/upload-game.component';
import { DevUserPageComponent } from './pages/components/dev-user-page/dev-user-page.component';
import { PlayerUserPageComponent } from './pages/components/player-user-page/player-user-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { YesNoDialogComponent } from './pages/components/yes-no-dialog/yes-no-dialog.component';
import { PresentGamePageComponent } from './pages/present-game-page/present-game-page.component';
import { GameContainerComponent } from './pages/shared/game-container/game-container.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ThisUserPageComponent } from './pages/components/this-user-page/this-user-page.component';
import { MyGamesComponent } from './pages/components/my-games/my-games.component';
import { EditGameComponent } from './pages/components/edit-game/edit-game.component';
import { DonateDialogComponent } from './pages/components/donate-dialog/donate-dialog.component';



@NgModule({
  declarations: [
    HomePageComponent,
    NavBarComponent,
    FooterComponent,
    LasagnaCatLayoutComponent,
    DownloadedGamesComponent,
    UploadGameComponent,
    DevUserPageComponent,
    PlayerUserPageComponent,
    YesNoDialogComponent,
    PresentGamePageComponent,
    GameContainerComponent,
    AdminPageComponent,
    ThisUserPageComponent,
    MyGamesComponent,
    EditGameComponent,
    DonateDialogComponent
  ],
  imports: [
    CommonModule,
    LasagnaCatRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    HomePageComponent,
    NavBarComponent,
    FooterComponent
  ]
})
export class LasagnaCatModule { }

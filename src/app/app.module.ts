import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { GamePage } from '../pages/game/game';
import { GameGameplay } from '../pages/game/game-gameplay/game-gameplay';
import { GameOptions } from '../pages/game/game-options/game-options';
import { GameResults } from '../pages/game/game-results/game-results';
import { HomePage } from '../pages/home/home';
import { UserPopover } from '../pages/home/user-popover/user-popover';
import { SettingsPage } from '../pages/settings/settings';
import { StatsPage } from '../pages/stats/stats';
import { BookPipe } from '../pipes/index';
import { Game, Scriptures, SgToast, Sql } from '../providers/index';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '0280dc86'
  },
  'auth': {
    'facebook': {
      'scope': ['email', 'public_profile']
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    BookPipe,
    GamePage,
    GameGameplay,
    GameOptions,
    GameResults,
    SettingsPage,
    StatsPage,
    UserPopover
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    GamePage,
    SettingsPage,
    StatsPage,
    UserPopover
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Game,
    Scriptures,
    SgToast,
    Sql
  ]
})
export class AppModule { }

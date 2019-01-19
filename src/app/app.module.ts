import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Facebook } from '@ionic-native/facebook';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Pro } from '@ionic/pro';
import firebase from 'firebase';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { GamePage } from '../pages/game/game';
import { GameGameplay } from '../pages/game/game-gameplay/game-gameplay';
import { GameOptions } from '../pages/game/game-options/game-options';
import { GameResults } from '../pages/game/game-results/game-results';
import { HomePage } from '../pages/home/home';
import { UserPopover } from '../pages/home/user-popover/user-popover';
import { SettingsPage } from '../pages/settings/settings';
import { BookPipe } from '../pipes/index';
import { Game, Scriptures, SgToast, Sql } from '../providers/index';

const IonicPro = Pro.init('e99360cc', {
  appVersion: '1.1.2'
});

firebase.initializeApp({
  apiKey: "AIzaSyCMPWjOG94jm6ymv9FMS24V0AejaZjyPHs",
  authDomain: "lds-scripture-golf.firebaseapp.com",
  databaseURL: "https://lds-scripture-golf.firebaseio.com",
  projectId: "lds-scripture-golf",
  storageBucket: "lds-scripture-golf.appspot.com",
  messagingSenderId: "1091761098220"
});

@Injectable()
export class ScriptureGolfErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    IonicPro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

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
    UserPopover
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    GamePage,
    SettingsPage,
    UserPopover
  ],
  providers: [
    {provide: ErrorHandler, useClass: ScriptureGolfErrorHandler},
    Game,
    Scriptures,
    SgToast,
    Sql,
    SocialSharing,
    Facebook,
    GoogleAnalytics
  ]
})
export class AppModule { }

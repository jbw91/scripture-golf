import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, AlertController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppVersion } from '@ionic-native/app-version';
import { HeaderColor } from '@ionic-native/header-color';
import {HomePage} from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {SettingsPage} from '../pages/settings/settings';
import {SgToast, Scriptures} from '../providers/index';

@Component({
  templateUrl: 'app.html',
  providers: [
    SplashScreen,
    StatusBar,
    GoogleAnalytics,
    AppVersion,
    HeaderColor
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>;
  isWindows: boolean;

  constructor(public platform: Platform, public toastService: SgToast, public alertCtrl: AlertController, public scriptures: Scriptures, public splashScreen: SplashScreen, public statusBar: StatusBar, public googleAnalytics: GoogleAnalytics, public appVersion: AppVersion, public headerColor: HeaderColor) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Settings', component: SettingsPage },
      { title: 'About', component: AboutPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.isWindows = this.platform.is('windows');
      this.headerColor.tint('#5AA02E');
      this.statusBar.backgroundColorByHexString('#36601C');
      this.statusBar.styleLightContent();
      this.statusBar.show();
      this.splashScreen.hide();
      if(this.platform.is('cordova') && !this.isWindows) {
        this.googleAnalytics.startTrackerWithId('UA-46243905-10').then(() => {
          console.log('STARTED TRACKING VIA GOOGLE ANALYTICS');
          this.appVersion.getVersionNumber().then((version) => {
            console.log('SET APP VERSION IN ANALYTICS: ' + version);
            this.googleAnalytics.setAppVersion(version);
          });
        });
      }

      this.setupDatabase();

      this.listenForBackButton();
    });
  }

  listenForBackButton() {
    this.platform.registerBackButtonAction(() => {
      if(!this.nav.canGoBack()) {
        let alert = this.alertCtrl.create({
          title: 'Exit?',
          subTitle: 'Would you like to exit Scripture Golf?',
          buttons: [
            {
              text: 'Stay',
              handler: () => {
                console.log('Decided to stay!');
              }
            },
            {
              text: 'Exit',
              handler: () => {
                this.platform.exitApp();
              }
            }
          ]
        });
        alert.present();
      }
      else {
        this.nav.pop();
      }
    }, 1000);
  }

  openPage(page: any) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  setupDatabase() {
    this.scriptures.initializeScriptures().then((successful) => {
      if(successful) {
        console.log('DATABASE SUCCESSFULLY INITIALIZED');
      }
    });
  }
}

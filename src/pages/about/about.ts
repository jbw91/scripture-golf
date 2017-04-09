import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AppRate } from '@ionic-native/app-rate';
import { AppVersion } from '@ionic-native/app-version';
import { SgToast } from '../../providers';

@Component({
  selector: 'about-page',
  templateUrl: 'about.html',
  providers: [
    AppRate,
    AppVersion
  ]
})
export class AboutPage {
  appName: string;
  appVersion: string;

  constructor(public navCtrl: NavController, public platform: Platform, public toastCtrl: SgToast, public av: AppVersion, public appRate: AppRate) {
    if(!this.platform.is('cordova')) {
      this.appName = 'Scripture Golf';
      this.appVersion = '1.0.0';
    }
    this.platform.ready().then(() => {
      if(this.platform.is('cordova')) {
        this.av.getAppName().then((name) => {
          this.appName = name;
        });
        this.av.getVersionNumber().then((version) => {
          this.appVersion = version;
        });
        this.appRate.preferences.storeAppURL = {
          ios: '1186113597',
          android: 'market://details?id=com.scripture-golf.ldsscripturegolf',
          windows: 'ms-windows-store://pdp/?ProductId=9wzdncrdnjbc'
        };
      }
    });
  }

  reviewApp() {
    if(this.platform.is('ios')) {
      window.open(`itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1186113597`, '_system');
    }
    else {
      this.appRate.promptForRating(true);
    }
  }
}

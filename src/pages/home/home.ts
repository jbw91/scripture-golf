import {Component} from '@angular/core';
import {NavController, Platform, PopoverController} from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';

import {SgToast} from '../../providers'
import {GamePage} from '../game/game';
import {SettingsPage} from '../settings/settings';
import {AboutPage} from '../about/about';
import {UserPopover} from './user-popover/user-popover';
import {SG_IMAGE_URL} from '../game/game-results/game-results';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
  isAuthenticated: boolean;
  currUser: any;
  isWindows: boolean;

  constructor(public nav: NavController, public platform: Platform, public popoverCtrl: PopoverController, public toastService: SgToast, private analytics: GoogleAnalytics, private socialSharing: SocialSharing, private facebook: Facebook) {
    this.currUser = {
      id: '0',
      name: ''
    };

    this.platform.ready().then(() => {
      this.isWindows = this.platform.is('windows');
      if(this.platform.is('cordova')) {
        // this.isAuthenticated = this.auth.isAuthenticated();
        this.analytics.trackView('Home Page');

        // if(this.user.social.facebook && this.user.social.facebook.uid) {
        //   this.currUser = {
        //     id: this.user.social.facebook.uid,
        //     name: this.user.social.facebook.data.full_name,
        //     photo: this.user.social.facebook.data.profile_picture
        //   };
        // }
      }
    });

    if(!this.platform.is('cordova')) {
      this.isAuthenticated = false;
    }
  }

  authenticate() {
    let provider = new firebase.auth.FacebookAuthProvider();
    this.facebook.login(['email', 'public_profile']).then((response) => {
      console.log('FINISHED AUTH PROCESS');
      console.log(JSON.stringify(response));
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      console.log(JSON.stringify(facebookCredential));

      firebase.auth().signInWithCredential(facebookCredential).then((success) => {
        console.log('SUCCESS' + JSON.stringify(success));
      })
    });
    // this.facebookAuth.login().then(() => {
    //   this.currUser = {
    //     id: this.user.social.facebook.uid,
    //     name: this.user.social.facebook.data.full_name,
    //     photo: this.user.social.facebook.data.profile_picture
    //   };
    //   this.toastService.showToast('Successfully signed in');
    // });
  }

  logout() {
    // this.facebookAuth.logout();
    // this.user.clear();
    // this.user.social.facebook.uid = null;
    this.currUser = {
      id: '0',
      name: ''
    };
    this.toastService.showToast('Successfully signed out');
  }

  openPage(page: string) {
    switch(page) {
      case 'about':
        this.nav.push(AboutPage);
        break;
      case 'settings':
        this.nav.setRoot(SettingsPage);
        break;
      case 'game':
        this.nav.setRoot(GamePage);
        break;
    }
  }

  openPopover(event) {
    let popover = this.popoverCtrl.create(UserPopover);
    popover.present({
      ev: event
    });
    popover.onDidDismiss((action) => {
      if(action === 'logout') {
        this.logout();
      }
      else if(action === 'share') {
        this.share();
      }
    });
  }

  share() {
    let message = 'I love playing Scripture Golf! You should download it too! #ScriptureGolf';
    this.socialSharing.share(message, 'Scripture Golf', SG_IMAGE_URL, 'https://www.facebook.com/ldsscripturegolf/').then(() => {
      console.log('Shared');
    }).catch(() => {
      this.toastService.showToast('Cannot share at this time');
    });
  }
}

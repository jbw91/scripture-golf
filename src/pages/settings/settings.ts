import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Sql, SgToast} from '../../providers/index';
import {Settings} from '../../models/index';
import {HomePage} from '../home/home';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settings: Settings;

  constructor(public nav: NavController, public storage: Sql, public toastService: SgToast) {
    this.settings = {
      bookOfMormon: true,
      doctrineAndCovenants: true,
      pearlOfGreatPrice: true,
      oldTestament: true,
      newTestament: true
    };

    this.getSettings();
  }

  getSettings() {
    this.storage.get('settings').then((data) => {
      if(data) {
        this.settings = JSON.parse(data);
      }
      else {
        this.saveSettings();
      }
    });
  }

  saveSettings() {
    this.storage.set('settings', JSON.stringify(this.settings));
  }

  eraseData() {
    this.storage.clear().then(() => {
      this.settings = {
        bookOfMormon: true,
        doctrineAndCovenants: true,
        pearlOfGreatPrice: true,
        newTestament: true,
        oldTestament: true
      };
      this.saveSettings();
      this.toastService.showToast('Data successfully cleared!');
    });
  }

  openPage(page: string) {
    switch(page) {
      case 'home':
        this.nav.setRoot(HomePage);
        break;
    }
  }
}

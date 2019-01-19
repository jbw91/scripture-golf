import { Injectable } from '@angular/core';
import { ToastController, ToastOptions, Platform } from 'ionic-angular';

@Injectable()
export class SgToast {

  constructor(public toastCtrl: ToastController, public platform: Platform) {}

  public showToast(message: string, showCloseButton?: boolean) {
    showCloseButton = (!showCloseButton) ? false : showCloseButton;
    let toastConfig: ToastOptions = {
      message: message,
      showCloseButton: showCloseButton,
      position: 'top',
      closeButtonText: 'OK'
    };
    if(!showCloseButton) {
      toastConfig.duration = 3000;
    }
    let toast = this.toastCtrl.create(toastConfig);
    toast.present();
  }
}


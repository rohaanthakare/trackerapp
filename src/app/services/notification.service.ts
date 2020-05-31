import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastCtrl: ToastController) { }

  public async errorNotification(messageString: string) {
    const msgBox = await this.toastCtrl.create({
      color: 'danger',
      duration: 2000,
      showCloseButton: true,
      message: messageString,
      position: 'top'
    });
    await msgBox.present();
  }

  public async successNotification(messageString: string) {
    const msgBox = await this.toastCtrl.create({
      color: 'success',
      duration: 2000,
      showCloseButton: true,
      message: messageString,
      position: 'top'
    });
    await msgBox.present();
  }
}

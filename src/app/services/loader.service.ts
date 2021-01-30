import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoadingController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = new BehaviorSubject(false);
  isLoadingFlag = false;
  isPresented = false;
  loaderToShow: any;
  constructor(private loadingCtrl: LoadingController, private modalCtrl: ModalController,
    private ngZone: NgZone) { }

  async present() {
    if (!this.isLoadingFlag) {
      this.isLoadingFlag = true;
      return await this.loadingCtrl.create({
        message: 'Please wait...'
      }).then(a => {
        a.present().then(() => {
          if (!this.isLoadingFlag) {
            a.dismiss().then(() => {
            });
          }
        });
      });
    }
  }

  async dismiss() {
    setTimeout(async () => {
      if (this.isLoadingFlag) {
        this.isLoadingFlag = false;
        return await this.loadingCtrl.dismiss().then(() => {});
      }
    }, 100);
  }
}

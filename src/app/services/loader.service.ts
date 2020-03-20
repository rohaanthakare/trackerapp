import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoadingController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = new BehaviorSubject(false);
  loaderToShow: any;
  constructor(private loadingCtrl: LoadingController, private modalCtrl: ModalController) { }

  showLoader() {
      if (!this.loaderToShow) {
        this.loaderToShow = this.loadingCtrl.create({
            message: 'Loading...'
          }).then((res) => {
            res.present();
          });
      }
  }

  hideLoader() {
    setTimeout(() => {
        if (this.loaderToShow) {
            this.loadingCtrl.dismiss();
            this.loaderToShow = undefined;
        }
    }, 4000);
  }
}

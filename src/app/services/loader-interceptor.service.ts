import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { LoaderService } from './loader.service';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor(private loaderService: LoaderService, private toastCtrl: ToastController) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }

    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.requests.push(req);
    this.loaderService.isLoading.next(true);
    return Observable.create(observer => {
      const subscription = next.handle(req).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        },
        async err => {
            const msgBox = await this.toastCtrl.create({
                color: 'danger',
                duration: 2000,
                showCloseButton: true,
                message: 'Internal server error, please try again',
                position: 'top'
            });
            await msgBox.present();
            this.removeRequest(req);
            observer.error(err);
        },
        () => {
          this.removeRequest(req);
          observer.complete();
        }
      );
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}

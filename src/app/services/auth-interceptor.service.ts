import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Inside Auth Interceptor');
    const userDetails = this.authService.getCurrentUser();
    const userToken = this.authService.getUserToken();
    if (userDetails && userToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken}`
        }
      });
    }
    return next.handle(req);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { FormUtils } from '../utils/form-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthorized = false;
  constructor(private http: HttpClient) { }

  isUserAuthenticated() {
    return this.isAuthorized;
  }

  setUserToken(token: any) {
    localStorage.setItem('Token', token);
  }

  getUserToken() {
    return localStorage.getItem('Token');
  }

  setUserDetails(userDetails: any) {
    localStorage.setItem('currentUser', JSON.stringify(userDetails));
  }

  getCurrentUser() {
    return localStorage.getItem('currentUser');
  }

  authenticateUser(userInfo) {
    return this.http.post(`${environment.baseUrl}/api/authenticate_user`, userInfo).pipe(map((res: any) => {
      if (res.user) {
        this.setUserDetails(res.user);
        this.setUserToken(res.user_token);
      }
      return res;
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('Token');
  }
}

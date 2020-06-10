import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MasterDataService } from './master-data.service';
import { FinanceService } from './finance.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthorized = false;
  constructor(private http: HttpClient, private router: Router, private masterDataService: MasterDataService,
              private financeService: FinanceService) { }

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
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  authenticateUser(userInfo) {
    return this.http.post(`${environment.baseUrl}/api/authenticate_user`, userInfo).pipe(map((res: any) => {
      if (res.user) {
        this.setUserDetails(res.user);
        this.setUserToken(res.user_token);
        // Cache some master data
        this.masterDataService.getAllMasterData().subscribe();
        this.financeService.getBanks().subscribe();
        this.financeService.getBranches().subscribe();
        this.financeService.getFinancialAccounts().subscribe();
      }
      return res;
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('Token');
    this.router.navigate(['login']);
  }
}

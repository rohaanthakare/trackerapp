import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User, UserRoles } from '../models/user.model';
import { FormUtils } from '../utils/form-utils';
import { DataLoadModule } from '../models/data-load-module.model';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  module = 'user';
  constructor(private http: HttpClient) { }

  registerUser(user: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/register_user`, user);
  }

  attachRoleToUser(userRole: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/attach_role`, userRole);
  }

  activateUser(userId: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/activate_user`, {
      id: userId
    });
  }

  uploadUsers(rows, moduleDetails: DataLoadModule, dataLoaderCmp) {
    return from(rows).pipe(
      concatMap(currentRow => {
        const userObj = new User();
        userObj.username = currentRow[0];
        userObj.password = currentRow[1];
        userObj.emailId = currentRow[2];
        userObj.mobileNo = currentRow[3];
        userObj.role = currentRow[4];
        userObj.userStatus = currentRow[5];
        return this.registerUser(userObj);
      })
    );
  }

  sendPasswordResetLink(emailId) {
    return this.http.post<any>(`${environment.baseUrl}/api/send_reset_pass_link`, emailId);
  }

  resetPassword(userDetails) {
    return this.http.put<any>(`${environment.baseUrl}/api/reset_password`, userDetails);
  }
}

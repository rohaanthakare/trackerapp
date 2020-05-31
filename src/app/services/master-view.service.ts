import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormUtils } from '../utils/form-utils';
import { DataLoadModule } from '../models/data-load-module.model';
import { MasterView } from '../models/master-view.model';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MasterViewService {
  module = 'MasterView';
  currentView: MasterView;
  constructor(private http: HttpClient) { }

  createMasterView(masterview) {
    return this.http.post(`${environment.baseUrl}/api/create_master_view`, masterview);
  }

  getNavigationMenu() {
    return this.http.get<any>(`${environment.baseUrl}/api/get_navigation_menu`);
  }

  getToolbarActions(viewCode) {
    return this.http.get<any>(`${environment.baseUrl}/api/get_toolbar_actions/${viewCode}`);
  }

  uploadViewConfig(rows, moduleDetails: DataLoadModule, dataLoaderCmp) {
    return from(rows).pipe(
      concatMap(currentRow => {
        const masterViewObj = new MasterView();
        masterViewObj.viewCode = currentRow[0];
        masterViewObj.viewTitle = currentRow[1];
        // masterViewObj.viewName = currentRow[2];
        masterViewObj.iconClass = currentRow[3];
        masterViewObj.viewRoute = currentRow[4];
        masterViewObj.viewType = currentRow[5];
        masterViewObj.parentView = currentRow[6];
        masterViewObj.displayOrder = currentRow[7];
        masterViewObj.isMenu = currentRow[8];
        masterViewObj.isToolbar = currentRow[9];
        return this.createMasterView(masterViewObj);
      })
    );
  }

  getCurrentView() {
    return this.currentView;
  }

  setCurrentView(viewConfig) {
    this.currentView = viewConfig;
  }
}

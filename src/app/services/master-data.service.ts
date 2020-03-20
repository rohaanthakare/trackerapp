import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormUtils } from '../utils/form-utils';
import { environment } from 'src/environments/environment';
import { DataLoadModule } from '../models/data-load-module.model';
import { MasterData } from '../models/master-data.model';
import { Observable, from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  constructor(private http: HttpClient) { }

  createMasterData(masterDataObj) {
    return this.http.post(`${environment.baseUrl}/api/create_master_data`, masterDataObj);
  }

  getMasterDataForParent(parentConfigCode) {
    return this.http.get(`${environment.baseUrl}/api/get_data_for_parent`, {
      params: {
        configCode: parentConfigCode
      }
    });
  }

  uploadMasterData(rows, moduleDetails: DataLoadModule, dataLoaderCmp) {
    return from(rows).pipe(
      concatMap(currentRow => {
        const masterDataObj = new MasterData();
        masterDataObj.configCode = currentRow[0];
        masterDataObj.configName = currentRow[1];
        masterDataObj.configDesc = currentRow[2];
        masterDataObj.displayOrder = currentRow[3];
        masterDataObj.parentConfig = currentRow[4];
        return this.createMasterData(masterDataObj);
      })
    );
  }
}

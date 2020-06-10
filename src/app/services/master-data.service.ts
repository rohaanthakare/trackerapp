import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormUtils } from '../utils/form-utils';
import { environment } from 'src/environments/environment';
import { DataLoadModule } from '../models/data-load-module.model';
import { MasterData } from '../models/master-data.model';
import { Observable, from } from 'rxjs';
import { concatMap, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private cachedMasterData: Observable<Array<MasterData>>;
  constructor(private http: HttpClient) { }

  createMasterData(masterDataObj) {
    return this.http.post(`${environment.baseUrl}/api/create_master_data`, masterDataObj);
  }

  requestAllMasterData() {
    return this.http.get<any>(`${environment.baseUrl}/api/get_master_data`).pipe(
      map(response => {
        return response;
      })
    );
  }

  getAllMasterData() {
    if (!this.cachedMasterData) {
      this.cachedMasterData = this.requestAllMasterData().pipe(
        shareReplay(1000)
      );
    }

    return this.cachedMasterData;
  }
  getMasterDataForParent(parentConfigCode) {
    return this.getAllMasterData().pipe(
      map(response => {
        const returnResponse = response.filter((d) => d.parentConfig && d.parentConfig.configCode === parentConfigCode);
        return {data: returnResponse};
      })
    );
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

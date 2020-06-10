import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataLoadModule } from '../models/data-load-module.model';
import { Bank, Branch } from '../models/finance.model';
import { from, Observable } from 'rxjs';
import { concatMap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  cachedBanks: Observable<Array<Bank>>;
  cachedBranches: Observable<Array<Branch>>;
  cachedAccounts: Observable<Array<any>>;
  constructor(private http: HttpClient) { }

  createBank(bankDetails) {
    return this.http.post(`${environment.baseUrl}/api/create_bank`, bankDetails);
  }

  requestBanks() {
    return this.http.get<any>(`${environment.baseUrl}/api/banks`);
  }

  getBanks() {
    if (!this.cachedBanks) {
      this.cachedBanks = this.requestBanks().pipe(
        shareReplay(100)
      );
    }

    return this.cachedBanks;
  }

  createBranch(branchDetails) {
    return this.http.post(`${environment.baseUrl}/api/create_branch`, branchDetails);
  }

  getBranches() {
    if (!this.cachedBranches) {
      this.cachedBranches = this.requestBranches().pipe(
        shareReplay(100)
      );
    }

    return this.cachedBranches;
  }

  requestBranches() {
    return this.http.get<any>(`${environment.baseUrl}/api/branches`);
  }

  uploadBanks(rows, moduleDetails: DataLoadModule, dataLoaderCmp) {
    return from(rows).pipe(
      concatMap(currentRow => {
        const bankObj = new Bank();
        bankObj.bankCode = currentRow[0];
        bankObj.bankName = currentRow[1];
        return this.createBank(bankObj);
      })
    );
  }

  uploadBranch(rows, moduleDetails: DataLoadModule, dataLoaderCmp) {
    return from(rows).pipe(
      concatMap(currentRow => {
        const branchObj = new Branch();
        branchObj.branchCode = currentRow[0];
        branchObj.branchName = currentRow[1];
        branchObj.branchIfsc = currentRow[2];
        branchObj.branchMicr = currentRow[3];
        branchObj.address = currentRow[4];
        branchObj.city = currentRow[5];
        branchObj.state = currentRow[6];
        branchObj.country = currentRow[7];
        branchObj.bank = currentRow[8];
        return this.createBranch(branchObj);
      })
    );
  }

  requestFinancialAccounts() {
    return this.http.get<any>(`${environment.baseUrl}/api/get_financial_accounts`);
  }

  getFinancialAccounts() {
    if (this.cachedAccounts) {
      this.cachedAccounts = this.requestFinancialAccounts().pipe(
        shareReplay(50)
      );
    }

    return this.cachedAccounts;
  }

  getFinancialAccountDetails(id) {
    return this.http.get(`${environment.baseUrl}/api/get_financial_account/${id}`);
  }

  createFinancialAccount(accountDetails) {
    return this.http.post(`${environment.baseUrl}/api/create_financial_account`, {
      accountDetails
    });
  }

  updateFinancialAccount(accountId, accountDetails) {
    return this.http.put(`${environment.baseUrl}/api/update_financial_account/${accountId}`, {
      accountDetails
    });
  }

  depositMoney(transactionDetail) {
    return this.http.post(`${environment.baseUrl}/api/deposit_money`, {
      transactionDetail
    });
  }

  transferMoney(transactionDetail) {
    return this.http.post(`${environment.baseUrl}/api/transfer_money`, transactionDetail);
  }

  addExpense(transactionDetail) {
    return this.http.post(`${environment.baseUrl}/api/add_expense`, transactionDetail);
  }

  getUserTransactions(filterParams, startIndex, pageSize) {
    return this.http.get(`${environment.baseUrl}/api/get_passbook`, {
      params: {
        start: startIndex,
        limit: pageSize
      }
    });
  }

  revertTransaction(transId) {
    return this.http.put(`${environment.baseUrl}/api/revert_transaction/${transId}`, {});
  }

  getContactTransactions(contactId) {
    return this.http.get(`${environment.baseUrl}/api/get_contact_transactions/${contactId}`);
  }

  getFinancialProfile() {
    return this.http.get(`${environment.baseUrl}/api/get_financial_profile`);
  }

  createFinancialProfile(profileData) {
    return this.http.post(`${environment.baseUrl}/api/create_financial_profile`, profileData);
  }

  updateFinancialProfile(profileId, profileData) {
    return this.http.put(`${environment.baseUrl}/api/update_financial_profile/${profileId}`, profileData);
  }

  addInvestment(transactionDetail) {
    return this.http.post(`${environment.baseUrl}/api/add_investment`, transactionDetail);
  }

  getTransactionClass(transactionCategory, transactionSubCategory) {
    if (transactionCategory === 'TRANSFER') {
      if (transactionSubCategory === 'SETTLEMENT_TR') {
        return 'fas fa-handshake';
      } else if (transactionSubCategory === 'LEND') {
        return 'fas fa-hand-holding-usd';
      } else if (transactionSubCategory === 'CASH') {
        return 'fas fa-money-bill-wave';
      } else if (transactionSubCategory === 'ADJUSTMENT_TR') {
        return 'fas fa-adjust';
      }
      return 'fas fa-exchange-alt';
    } else if (transactionCategory === 'DEPOSIT') {
      if (transactionSubCategory === 'SALARY') {
        return 'fas fa-wallet';
      } else if (transactionSubCategory === 'TAX_RETURN' || transactionSubCategory === 'INVESTMENT_RETURN') {
        return 'fas fa-reply';
      } else if (transactionSubCategory === 'SETTLEMENT') {
        return 'fas fa-handshake';
      } else if (transactionSubCategory === 'CASHBACK') {
        return 'fas fa-wallet';
      } else if (transactionSubCategory === 'ADJUSTMENT') {
        return 'fas fa-adjust';
      }
      return 'fas fa-sign-in-alt';
    } else if (transactionCategory === 'EXPENSE') {
      if (transactionSubCategory === 'GROCERY') {
        return 'fas fa-carrot';
      } else if (transactionSubCategory === 'DEBT') {
        return 'fas fa-credit-card';
      } else if (transactionSubCategory === 'MISSING') {
        return 'fas fa-meh-rolling-eyes';
      } else if (transactionSubCategory === 'FOOD') {
        return 'fas fa-utensils';
      } else if (transactionSubCategory === 'BILLS') {
        return 'fas fa-file-invoice-dollar';
      } else if (transactionSubCategory === 'TRANSPORTATION') {
        return 'fas fa-car';
      } else if (transactionSubCategory === 'TRAVEL') {
        return 'fas fa-umbrella-beach';
      } else if (transactionSubCategory === 'ENTERTAINMENT') {
        return 'fas fa-film';
      } else if (transactionSubCategory === 'PERSONAL') {
        return 'fas fa-street-view';
      } else if (transactionSubCategory === 'MEDICAL') {
        return 'fas fa-file-medical';
      } else if (transactionSubCategory === 'SHOPPING') {
        return 'fas fa-shopping-cart';
      } else if (transactionSubCategory === 'GIFTS') {
        return 'fas fa-gifts';
      } else if (transactionSubCategory === 'EDUCATION') {
        return 'fas fa-graduation-cap';
      } else if (transactionSubCategory === 'HOUSING') {
        return 'fas fa-home';
      }
      return 'fas fa-sign-in-alt';
    } else if (transactionCategory === 'INVESTMENT') {
      return 'fas fa-donate';
    }
    return 'fas fa-sign-in-alt';
  }
}

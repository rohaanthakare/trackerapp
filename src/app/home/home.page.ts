import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { MasterViewService } from '../services/master-view.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {
  menus: any;
  allMenus: any;
  trackerMenuTitle = `<i class="fas fa-cog mr-1"></i>Menu`;
  constructor(private menuCtrl: MenuController, private masterView: MasterViewService, private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.masterView.getNavigationMenu().subscribe(
      (response: any) => {
        this.menus = response.menus;
        this.allMenus = response.menus;
      }
    );
  }

  openSettings() {
    // alert('settings clicked');
    this.menuCtrl.open('settings');
  }

  openTrackerNav() {
    this.menuCtrl.open('trackerNav');
  }

  logout() {
    this.menuCtrl.close();
    this.authService.logout();
  }

  onMenuClicked(menu, homeMenuClicked?) {
    console.log(menu);
    if (menu && menu.items) {
      this.menus = menu.items;
      this.trackerMenuTitle = `<i class="fas fa-chevron-left mr-1" onClick="onMenuClicked(undefined, true)"></i>Back`;
    } else if (homeMenuClicked) {
      this.menus = this.allMenus;
      this.trackerMenuTitle = `<i class="fas fa-cog mr-1"></i>Menu`;
    } else {
      this.router.navigate([menu.viewRoute]);
      this.menuCtrl.close();
    }
  }
}

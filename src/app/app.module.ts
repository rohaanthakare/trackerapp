import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LoaderInterceptorService } from './services/loader-interceptor.service';
import { HomePageModule } from './home/home.module';

@NgModule({
  declarations: [AppComponent, LoginComponent ],
  entryComponents: [],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule,
    IonicModule.forRoot(), AppRoutingModule, HomePageModule],
  providers: [
    StatusBar,
    SplashScreen, CurrencyPipe, DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

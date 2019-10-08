import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import {Plugins , Capacitor} from '@capacitor/core';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent  implements OnInit , OnDestroy {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }
  // tslint:disable-next-line: member-ordering
  private authSub: Subscription;
  private previousAuthState = false;
  ngOnDestroy(){
if (this.authSub)  {
 this.authSub.unsubscribe();
}
}
  ngOnInit() {
this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
  if( !isAuth && this.previousAuthState !== isAuth) {
    this.router.navigateByUrl('/auth');

  }
  this.previousAuthState = isAuth;
});
 }
  OnLogOut() {
this.authService.logout();
//this.router.navigateByUrl('/auth');
  }
  initializeApp() {
    this.platform.ready().then(() => {
      if(Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }
}

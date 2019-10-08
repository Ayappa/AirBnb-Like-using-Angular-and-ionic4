import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { AuthService } from './auth.service';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService,  private router: Router ) {}
  canLoad(
    route: import('@angular/router').Route, segments: import('@angular/router').UrlSegment[]
    ): boolean | Observable<boolean> | Promise<boolean> {
     
      return this.authService._userAuth.pipe(take(1),switchMap(isAuth => {
        if (! isAuth){
         return this.authService.autoLogin();
        } else {
          return of(isAuth);
        }
        }) , tap(isAuth => {
       // this.router.navigateByUrl('/auth');
        if (!isAuth) {
          this.router.navigateByUrl('/auth');
        }
      }));
    // throw new Error("Method not implemented.");
  }
}




import { Injectable ,OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import {Plugins} from '@capacitor/core';

export interface AuthResponseData{
  kind: string ;
  idToken: string;
  email: string ;
  refreshToken: string ;
  localId: string ;
  expiresIn: string ;
  registered ?: boolean ;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{
  ngOnDestroy(){
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
  private _user = new BehaviorSubject<User>(null);
 // private userAuth = false;
// tslint:disable-next-line: variable-name
 private _userId = null;
 // tslint:disable-next-line: variable-name
 // private _token = new BehaviorSubject <string>(null)  ;
 private activeLogoutTimer: any;

 get _userAuth() {
  return this._user.asObservable().pipe(map(user => {
    if (user) {
      return !!user.token;
    } else {
    return false ;
    }
  }));
}

  constructor(private http: HttpClient) { }

signup(email: string , password: string) {
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: object-literal-shorthand
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: whitespace
// tslint:disable-next-line: max-line-length
return this.http.post<AuthResponseData>(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`, {email , password , returnSecureToken : true}).pipe(tap(res => {
this.setUserData(res);
} ));
}

private setUserData(res: AuthResponseData) {
  const expriationTime = new Date (new Date().getTime() + (+res.expiresIn * 1000));
  const user = new User(res.localId, res.email , res.idToken , expriationTime );
  this._user.next( user);
  this.autoLogout(user.tokenDuration);

  this.storeAuthDate(res.localId  , res.idToken, expriationTime.toISOString()  , res.email);
}


get userId() {
  return this._user.asObservable().pipe(map(user => {
    if (user) {
    return user.id;
    } else {
      return null;
    }
  }));
}


get token() {
  return this._user.asObservable().pipe(
    map(user => {
      if (user) {
        return user.token;
      } else {
        return null;
      }
    })
  );
}

login(email: string , password: string) {
// tslint:disable-next-line: max-line-length
return this.http.post<AuthResponseData>(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`, {email, password, returnSecureToken : true}).pipe(tap(res => {
  this.setUserData(res);
  } ));
}

logout() {
  if (this.activeLogoutTimer) {
    clearTimeout(this.activeLogoutTimer);
  }
  this._user.next(null);
  Plugins.Storage.remove({key: 'authData' });
  }


  private storeAuthDate( userId: string, token: string, tokenExpirationDate: string , email: string ) {
    const data = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
      email
    });

    Plugins.Storage.set({key: 'authData', value: data});
  }

  autoLogin() {
   return from( Plugins.Storage.get({key : 'authData'})).pipe(map(stored => {
     if (!stored || !stored.value) {
       return null;
     }
     const parsedData = JSON.parse(stored.value) as {token: string; tokenExpirationDate: string; userId: string; email: string 

    };
     const expirationTime = new Date(parsedData.tokenExpirationDate);
     if (expirationTime <= new Date()) {
  return null;
}
     const user = new User(parsedData.userId ,parsedData.email ,parsedData.token , expirationTime);
     return user; 
   }),
   tap (user => {
     if(user) {
       this._user.next(user);
       this.autoLogout(user.tokenDuration);
     }
   }), 
   map(user => {
     return !!user;
   }));
  }


  private autoLogout (duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
       this.logout();
     }, duration);
  }
}

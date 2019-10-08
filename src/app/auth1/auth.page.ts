import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    islogin =  true;
  isLoading = true;
  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService , private router: Router, private loadingctl: LoadingController , private altctl : AlertController) { }

  ngOnInit() {
  }
  authenticate( email: string , password: string) {
this.loadingctl.create({
  keyboardClose: true,
  message: 'Loading please wait...'
}).then(loaded => {
  loaded.present();
  let authObs: Observable<AuthResponseData>;
  if (this.islogin){
  authObs =  this.authService.login(email , password);

  } else {
   authObs= this.authService.signup(email , password);
  }
   authObs.subscribe( res => {
    this.router.navigateByUrl('/places/tabs/discover');
    console.log(res);
    this.isLoading = false;
    loaded.dismiss();
    

  }, err => {
    loaded.dismiss();
    const code = err.error.error.message;
    let message = 'could not sign you up , please try later';
    if (code === '"EMAIL_EXISTS') {
      message = 'This email address already taken';
    } else if (code === '"EMAIL_NOT_FOUND') {
      message = 'This email could not be found';
    // tslint:disable-next-line: align
    } else if (code === '"INVALID PASSWORD"')  {
      message = 'this password is not correct';
    }
    this.showAlert(message);
  });
});
  }
  onswitchLogin() {
    this.islogin = !this.islogin;
  }

private showAlert(message: string) {
this.altctl.create({
header: 'Authentication failed' ,
message: message,
buttons: ['okay']
}).then(alert => alert.present());
}


  onSubmit(form: NgForm) {
    if (!form.valid) {
  return;
}
    const email = form.value.email;
    const password = form.value.password;
    //if (this.islogin) {
    // } else {
         this.authenticate(email, password);
         
         form.reset();
        // this.router.navigateByUrl('/places/tabs/discover');

     //}

  }
}

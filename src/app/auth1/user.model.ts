import { TouchSequence } from 'selenium-webdriver';

export class User {
     constructor (
         public id: string,
         public email: string,
         // tslint:disable-next-line: variable-name
         public _token: string,
         private tokenExpirationDate: Date
     ) {}

     get token() {
         if (!this.tokenExpirationDate  || this.tokenExpirationDate <= new Date()) {
             return null;
         }
         return this._token;
     }

     get tokenDuration() {
         if (this.token) {
             return 0;
         }
         return new Date().getTime() - new Date().getTime();
     }
}
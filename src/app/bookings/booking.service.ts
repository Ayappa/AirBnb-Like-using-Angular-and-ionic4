import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject ,  } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, delay, tap, switchMap , map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { strict } from 'assert';


interface BoookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}
@Injectable({
  providedIn: 'root'
})
export class BookingService {
// tslint:disable-next-line: variable-name
private _booking = new BehaviorSubject< Booking[]>([]);

  constructor(private authService: AuthService , private http: HttpClient) {
   }

   get bookings() {
    return this._booking.asObservable();
   }

// tslint:disable-next-line: max-line-length
   addBooking( placeId: string , placeTitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date) {
     let generstedId: string ;
     let newBooking: Booking;
     return this.authService.userId.pipe(
       take(1),
       switchMap ( userId => {
      if (!userId) {
        throw new Error('No user id found! ');
      }
      // tslint:disable-next-line: max-line-length
      newBooking = new Booking(Math.random().toString(), placeId , userId, placeTitle , placeImage, firstName, lastName , guestNumber, dateFrom, dateTo  );
      return this.http.post<{name: string}>('https://bookings-292c0.firebaseio.com/bookings.json', {...newBooking, id: null}
      );

     }),
     switchMap(resData => {
    generstedId = resData.name;
    return this.bookings;
     }) ,
     take(1),
      tap (bookings => {
       newBooking.id = generstedId;
       this._booking.next(bookings.concat(newBooking));
     // return  this.bookings.pipe(take(1), delay(1000), tap(bookings => {

    })
    );
   }


   cancelBooking(id: string) {
     return this.http.delete(`https://bookings-292c0.firebaseio.com/bookings/${id}.json`).pipe(switchMap(() => {
       return this.bookings;
     }), take(1),
   // return  this.bookings.pipe(take(1), delay(1000), tap(bookings => {

    tap(bookings => {
      this._booking.next(bookings.filter(b => b.id !== id));
    }));
   }

   fetchBookings() {
// tslint:disable-next-line: no-unused-expression
// tslint:disable-next-line: max-line-length

return this.authService.userId.pipe(take(1), switchMap(userId => {
  if (!userId) {
    throw new Error ('User not found');
  }
  // tslint:disable-next-line: max-line-length
  return  this.http.get<{[key: string]: BoookingData}>(`https://bookings-292c0.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"  `);
})).
pipe(map(bookingData=> {
        const bookings = [];
        for (const key in bookingData) {
         if (bookingData.hasOwnProperty(key)) {
             bookings.push
// tslint:disable-next-line: max-line-length
           (new Booking(key , bookingData[key].placeId, bookingData[key].userId, bookingData[key].placeTitle, bookingData[key].placeImage, bookingData[key].firstName, bookingData[key].lastName, bookingData[key].guestNumber, new Date(bookingData[key].bookedFrom), new Date(bookingData[key].bookedTo)  )) ;
         }
        }
        return bookings;
     }), tap(bookings => {
       this._booking.next(bookings);
     }));
   }
}

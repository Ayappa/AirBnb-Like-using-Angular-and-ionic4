import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit , OnDestroy {
  private  placesSub: Subscription;

  constructor(private bookingService: BookingService , private loaderctl: LoadingController ) { }
  loadedBookings: Booking[];
  isLoading= false;
  ngOnInit() {
    this. placesSub =  this.bookingService.bookings.subscribe(booking => {

      this.loadedBookings = booking;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });;
  }
  onCancelBooking(id: string, sliding: IonItemSliding) {
   sliding.close();
   this.loaderctl.create({
    message: 'Deleting Place..'
  }).then((ctl) => {
    ctl.present();
    this.bookingService.cancelBooking(id).subscribe(() => { ctl.dismiss(); });
  });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}

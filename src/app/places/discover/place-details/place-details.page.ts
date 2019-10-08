import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../places.model';
import { PlaceService } from '../../place.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit , OnDestroy{
  place: Place;
  private  placesSub: Subscription;
  isBook = false;
  isLoading = false;
// tslint:disable-next-line: max-line-length
  constructor(private router: Router , private navctl: NavController, private modalctl: ModalController , private placeService: PlaceService , private activatedRoute: ActivatedRoute , private actionctl: ActionSheetController , private bookingservice: BookingService ,private loaderctl: LoadingController ,private auth: AuthService, private alertctl: AlertController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => {
      if (!param.has('placeId')) {
        this.navctl.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoading = true;
      let fetchedUserId: string;
      this.auth.userId.pipe(take(1), switchMap (userId => {
        if ( !userId) {
          throw new Error ('Found no user!');
        }
        fetchedUserId = userId;
        return  this.placeService.getPlace(param.get('placeId'));
      })).subscribe(place => {
        this.place = place;
        this.isBook = place.uderId !== fetchedUserId;
        this.isLoading = false;
      }, error => {
          this.alertctl.create({
            header: 'An error occurred!',
            message: 'could not load place' ,
            buttons: [{text: 'okay', handler: () => {
              this.router.navigate(['/places/tabs/discover']);
            }}]
          }).then(ctl => {ctl.present(); } );
      });
  });
  }
  OnBookPlace() {
   this.actionctl.create({
     header: 'Choose a Action',
     buttons: [
       {
         text: 'Select Date',
         handler: () => {
           this.openBookingModal('select');
         }
       },
       {
         text: 'Random Date',
         handler: () => {
          this.openBookingModal('random');

         }
       },{
         text: 'Cancel',
         role: 'cancel'
       }
     ]
   }).then(action => {
     action.present();
   });
  }

  // this.navctl.navigateBack('/places/tabs/discover');
   openBookingModal(mode: 'select' | 'random') {
  this.modalctl.create({component: CreateBookingComponent,
    componentProps : {selectedPlace: this.place, selectedMode: mode}}).then(modal => {
     modal.present();
     return modal.onDidDismiss();
   })
   .then(result => { 
     console.log(result);
     const data = result.data.bookingData;
     if (result.role === 'confirm') {
      this.loaderctl.create({
        message: 'Booking Place..'
      }).then(ctl => {
        ctl.present();
// tslint:disable-next-line: max-line-length
        this.bookingservice.addBooking(this.place.id, this.place.title, this.place.imageurl, data.lastName, data.LastName , data.guestNumber , data.startDate , data.endDate ).subscribe(() => { ctl.dismiss(); });
      });
// tslint:disable-next-line: max-line-length
 
     }
   });
}

onSubmit(form: NgForm) {

}

ngOnDestroy() {
  if (this.placesSub) {
    this.placesSub.unsubscribe();
  }
}
}



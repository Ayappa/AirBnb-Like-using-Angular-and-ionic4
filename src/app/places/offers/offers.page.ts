import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../places.model';
import { PlaceService } from '../place.service';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit , OnDestroy {

 offers: Place[];
 isLoading= false;
 private placesSub: Subscription;
  constructor(private placesService: PlaceService, private router: Router) {
   }

  ngOnInit() {
  this.placesSub = this.placesService.places.subscribe(places => {
    this.offers = places;
  });
  }
 
  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlace().subscribe(() => { this.isLoading = false; });
  }

  onEdit(offerId: string, sliding: IonItemSliding ) {
    sliding.close();
    this.router.navigate(['/', 'places', 'tabs', 'offer', 'edit', offerId]);
  }
  ngOnDestroy() {
   if (this.placesSub) {
     this.placesSub.unsubscribe();
   }
  }
}
